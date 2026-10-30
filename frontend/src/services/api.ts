/**
 * API service layer — centralizes all HTTP calls to the FastAPI backend.
 * Uses axios with interceptors for auth token injection.
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_PREFIX = '/api/v1'

// ── Create axios instance ────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}${API_PREFIX}`,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: inject auth token ───────────────────────

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ptai_access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor: handle 401 ────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If request explicitly opted out of auth redirect, reject cleanly without wiping session
    if ((error.config as any)?.skipAuthRedirect) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        const refreshToken = localStorage.getItem('ptai_refresh_token')
        if (refreshToken) {
          const res = await axios.post(`${API_URL}${API_PREFIX}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          const { access_token, refresh_token } = res.data
          localStorage.setItem('ptai_access_token', access_token)
          localStorage.setItem('ptai_refresh_token', refresh_token)
          error.config.headers.Authorization = `Bearer ${access_token}`
          return api(error.config)
        }
      } catch {
        // Refresh failed
      }

      // If user has an active workstation clinical profile, do not kick them out
      const activeUser = typeof window !== 'undefined' ? localStorage.getItem('ptai_active_user_v2') : null
      if (activeUser) {
        return Promise.reject(error)
      }

      localStorage.removeItem('ptai_access_token')
      localStorage.removeItem('ptai_refresh_token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

// ── Auth ──────────────────────────────────────────────────────────

export const documentsApi = {
  structureNotes: (patientId: string, rawNotes: string) => 
    api.post('/documents/assistant', { patient_id: patientId, raw_notes: rawNotes }),
}

export const reportsApi = {
  generate: (reportType: string, parameters: any) => 
    api.post('/reports/generate', { report_type: reportType, parameters }),
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (payload: any) =>
    api.post('/auth/signup', payload),
  verifyMfa: (mfaCode: string, tempToken: string) =>
    api.post('/auth/mfa/verify', { mfa_code: mfaCode, temp_token: tempToken }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refresh_token: refreshToken }),
  setupMfa: () => api.post('/auth/mfa/setup'),
  enableMfa: (code: string) => api.post('/auth/mfa/enable', { mfa_code: code }),
}

// ── Patients ──────────────────────────────────────────────────────

export const patientsApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get('/patients', { params, skipAuthRedirect: true } as any),
  get: (id: string) => api.get(`/patients/${id}`, { skipAuthRedirect: true } as any),
  create: (data: any) => api.post('/patients', data),
  update: (id: string, data: any) => api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
  getTimeline: (id: string) => api.get(`/patients/${id}/timeline`, { skipAuthRedirect: true } as any),
  getPrescriptions: (id: string) => api.get(`/patients/${id}/prescriptions`, { skipAuthRedirect: true } as any),
  getDocuments: (id: string) => api.get(`/patients/${id}/documents`, { skipAuthRedirect: true } as any),
  getVisits: (id: string) => api.get(`/patients/${id}/encounters`, { skipAuthRedirect: true } as any),
  getFollowUps: (id: string) => api.get(`/patients/${id}/follow-ups`, { skipAuthRedirect: true } as any),
}

// ── Prescription Uploads (NEW FEATURE) ───────────────────────────

export const prescriptionUploadsApi = {
  list: (patientId: string) =>
    api.get(`/patients/${patientId}/prescription-uploads`),

  upload: (patientId: string, formData: FormData) =>
    api.post(`/patients/${patientId}/prescription-uploads`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    }),

  get: (patientId: string, uploadId: string) =>
    api.get(`/patients/${patientId}/prescription-uploads/${uploadId}`),

  review: (patientId: string, uploadId: string, reviewNotes?: string) =>
    api.post(`/patients/${patientId}/prescription-uploads/${uploadId}/review`, {
      review_notes: reviewNotes,
    }),

  delete: (patientId: string, uploadId: string) =>
    api.delete(`/patients/${patientId}/prescription-uploads/${uploadId}`),
}

// ── External Datasets (NEW FEATURE) ──────────────────────────────

export const datasetsApi = {
  list: () => api.get('/datasets'),

  upload: (formData: FormData) =>
    api.post('/datasets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    }),

  get: (id: string) => api.get(`/datasets/${id}`),

  getSchema: (id: string) => api.get(`/datasets/${id}/schema`),

  updateMapping: (id: string, data: { manual_mapping: Record<string, any>; name?: string; description?: string }) =>
    api.put(`/datasets/${id}/mapping`, data),

  analyze: (id: string, analysisTypes: string[]) =>
    api.post(`/datasets/${id}/analyze`, analysisTypes),

  delete: (id: string) => api.delete(`/datasets/${id}`),
}

// ── Prescriptions ─────────────────────────────────────────────────

export const prescriptionsApi = {
  list: (params?: any) => api.get('/prescriptions', { params }),
  get: (id: string) => api.get(`/prescriptions/${id}`),
  create: (data: any) => api.post('/prescriptions', data),
  update: (id: string, data: any) => api.put(`/prescriptions/${id}`, data),
  finalize: (id: string) => api.post(`/prescriptions/${id}/finalize`),
  cancel: (id: string, reason: string) => api.post(`/prescriptions/${id}/cancel`, { reason }),
}

// ── AI Query ──────────────────────────────────────────────────────

export const aiApi = {
  query: (data: { query: string; patient_id?: string; conversation_id?: string }) =>
    api.post('/ai/query', data),

  queryStream: (data: any): EventSource => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ptai_access_token') : ''
    const url = new URL(`${API_URL}${API_PREFIX}/ai/query/stream`)
    // Note: EventSource doesn't support POST natively — use fetch with SSE
    return new EventSource(url.toString())
  },

  getConversations: () => api.get('/ai/conversations'),
  getConversation: (id: string) => api.get(`/ai/conversations/${id}`),
}

// ── Analytics ─────────────────────────────────────────────────────

export const analyticsApi = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getPrescriptionTrends: (months: number = 6) => api.get('/analytics/prescription-trends', { params: { months } }),
  getDiagnosisDistribution: (limit: number = 10) => api.get('/analytics/diagnosis-distribution', { params: { limit } }),
  getPatientActivity: (days: number = 30) => api.get('/analytics/patient-activity', { params: { days } }),
  getMonthly: () => api.get('/analytics/monthly'),
  getYearly: () => api.get('/analytics/yearly'),
  getTrends: () => api.get('/analytics/trends'),
  getAnomalies: () => api.get('/analytics/anomalies'),
  getPatterns: () => api.get('/analytics/patterns'),
  getCohorts: () => api.get('/analytics/cohorts'),
  runAnalysis: (data: { agents: string[]; period?: string; data_source?: string; dataset_id?: string }) =>
    api.post('/analytics/run', data),
}

// ── Dashboard ─────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => api.get('/analytics/dashboard'),
  getInsights: () => api.get('/dashboard/insights'),
}

// ── Audit ─────────────────────────────────────────────────────────

export const auditApi = {
  list: (params?: any) => api.get('/audit', { params }),
}

// ── Search ────────────────────────────────────────────────────────

export const searchApi = {
  global: (q: string) => api.get('/search', { params: { q } }),
}

export default api
