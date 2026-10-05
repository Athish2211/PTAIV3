import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Inside the Docker container, the backend is accessible at 'backend:8000', not 'localhost:8000'
    const backendUrl = 'http://backend:8000'
    
    // Proxy the request to the real Python FastAPI Backend Orchestrator
    const response = await fetch(`${backendUrl}/api/v1/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
        'Authorization': req.headers.get('authorization') || '',
      },
      body: JSON.stringify({
        query: body.query,
        patient_id: body.patientId,
        patient: body.patient,
        conversation_id: "web-client",
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend Error:", errorText)
      return NextResponse.json({ error: `Backend error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json({
      response: data.response,
      citations: data.evidence && data.evidence.length > 0 ? data.evidence : [],
      patientFindings: {
        diagnosis: `${body.patient?.chronic_conditions?.[0] || 'Clinical Review'}`,
        suggested_meds: Array.isArray(body.patient?.active_medications) ? body.patient.active_medications : [],
        adverse_warnings: body.patient?.allergies && body.patient.allergies.length > 0 ? [`Allergies: ${Array.isArray(body.patient.allergies) ? body.patient.allergies.join(', ') : body.patient.allergies}`] : [],
      }
    })
  } catch (error: any) {
    console.error("Route Error:", error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
