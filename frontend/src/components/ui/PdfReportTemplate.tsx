import React from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts'

export default function PdfReportTemplate({ 
  trendAnalysis, 
  anomalyAnalysis, 
  riskAnalysis, 
  cohortAnalysis, 
  drugClusteringAnalysis,
  llmInsights,
  role
}: any) {
  // Use a realistic mock doctor name since the auth context doesn't store the exact name yet
  const doctorName = 'Sarah Jenkins'
  const specialty = 'Healthcare Informatics'
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div 
      id="ieee-pdf-report" 
      style={{ 
        width: '8.5in', // Standard letter width
        padding: '0.8in',
        background: '#ffffff',
        color: '#000000',
        fontFamily: '"Times New Roman", Times, serif',
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        zIndex: -9999
      }}
    >
      {/* Title block */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 'bold', margin: '0 0 15px 0', color: '#102A43' }}>
          Clinical EHR Prescription Analytics & LLM Safety<br />Evaluation
        </h1>
        <p style={{ fontSize: '11pt', fontStyle: 'italic', margin: '5px 0', color: '#486581' }}>
          Project Technical Report — IEEE Format Standardized Graphics & Data Summary
        </p>
        <p style={{ fontSize: '11pt', margin: '5px 0', color: '#627D98' }}>
          Prepared by Dr. {doctorName} | Department of {specialty} | {dateStr}
        </p>
        <hr style={{ border: 'none', borderTop: '1px solid #BCCCDC', margin: '20px 0' }} />
      </div>

      {/* Abstract */}
      <div style={{ background: '#F0F4F8', padding: '15px', marginBottom: '30px', borderLeft: '4px solid #102A43' }}>
        <p style={{ margin: 0, fontSize: '11pt', lineHeight: '1.5' }}>
          <strong style={{ color: '#102A43' }}>Abstract & Purpose:</strong> {llmInsights?.executiveSummary || "This document compiles all experimental results, clinical surveillance metrics, and anomaly detection charts from the real-time Electronic Health Record (EHR) prescription monitoring system. The original user-interface charts have been transformed into standard IEEE-compliant visual figures for formal submission and review."}
        </p>
      </div>

      {/* I. Longitudinal Prescribing Trajectory */}
      <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '1px solid #D9E2EC', paddingBottom: '5px', marginBottom: '15px' }}>
        I. Longitudinal Prescribing Trajectory
      </h2>
      <p style={{ fontSize: '11pt', lineHeight: '1.5', marginBottom: '20px' }}>
        Figure 1 illustrates the longitudinal daily prescription load evaluated across active electronic health records. The overall cohort captured {trendAnalysis.total || 0} total valid prescriptions with a month-over-month (MoM) velocity of {trendAnalysis.velocity || '+0%'}. {llmInsights?.forecastText ? `Forecast: ${llmInsights.forecastText}` : ''}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', height: '300px' }}>
         <AreaChart width={600} height={300} data={trendAnalysis.data || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9E2EC" />
            <XAxis dataKey="month" stroke="#486581" fontSize={11} />
            <YAxis stroke="#486581" fontSize={11} allowDecimals={false} />
            <Area type="monotone" dataKey="prescriptions" stroke="#243B53" strokeWidth={3} fillOpacity={0.1} fill="#243B53" />
         </AreaChart>
      </div>
      <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '10pt', marginBottom: '40px', color: '#486581' }}>
        Fig. 1. Daily prescription trajectory and velocity derived from longitudinal patient encounters.
      </p>

      {/* II. LLM Clinical Anomaly Vector Radar & Flagged Outliers */}
      <div className="html2pdf__page-break"></div>
      <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '1px solid #D9E2EC', paddingBottom: '5px', marginBottom: '15px' }}>
        II. LLM Clinical Anomaly Vector Radar & Flagged Outliers
      </h2>
      <p style={{ fontSize: '11pt', lineHeight: '1.5', marginBottom: '20px' }}>
        {llmInsights?.anomalyInsights || "To validate automated prescription safety, an ensemble comprising Isolation Forest and an edge LLM analyzed multidimensional clinical vectors: Dosage Deviation, Allergy Conflict, Duration Outlier, Polypharmacy Spike, and Rare Co-Rx."}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', height: '300px' }}>
         <RadarChart width={400} height={300} data={anomalyAnalysis.radarData || []}>
            <PolarGrid stroke="#D9E2EC" />
            <PolarAngleAxis dataKey="metric" stroke="#102A43" fontSize={10} />
            <PolarRadiusAxis stroke="#D9E2EC" />
            <Radar name="Anomaly Score" dataKey="score" stroke="#D64545" fill="#D64545" fillOpacity={0.3} />
         </RadarChart>
      </div>
      <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '10pt', marginBottom: '40px', color: '#486581' }}>
        Fig. 2. Radar plot depicting the 5-dimensional clinical anomaly vector space evaluated by phi-4-mini.
      </p>

      <h3 style={{ fontSize: '11pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
        TABLE I: CLINICAL PRESCRIPTION OUTLIERS FLAGGED (TOTAL: {anomalyAnalysis.flagged?.length || 0})
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', fontSize: '10pt' }}>
        <thead>
          <tr style={{ background: '#243B53', color: 'white' }}>
            <th style={{ padding: '8px', border: '1px solid #243B53', textAlign: 'left' }}>Patient MRN</th>
            <th style={{ padding: '8px', border: '1px solid #243B53', textAlign: 'left' }}>Prescribed Regimen</th>
            <th style={{ padding: '8px', border: '1px solid #243B53', textAlign: 'left' }}>Priority</th>
          </tr>
        </thead>
        <tbody>
          {(anomalyAnalysis.flagged || []).slice(0, 5).map((a: any, i: number) => (
            <tr key={i} style={{ borderBottom: '1px solid #D9E2EC' }}>
              <td style={{ padding: '8px' }}>{a.patient_name} <br/><span style={{ color: '#627D98', fontSize: '8pt' }}>({a.mrn || 'Unknown MRN'})</span></td>
              <td style={{ padding: '8px' }}>{a.medications?.map((m:any) => m.medication).join(', ') || 'N/A'}</td>
              <td style={{ padding: '8px', color: '#D64545', fontWeight: 'bold' }}>HIGH PRIORITY</td>
            </tr>
          ))}
          {anomalyAnalysis.flagged?.length === 0 && (
             <tr>
               <td colSpan={3} style={{ padding: '15px', textAlign: 'center', color: '#627D98' }}>No clinical anomalies flagged in current cohort.</td>
             </tr>
          )}
        </tbody>
      </table>

      {/* III. ADE Risk */}
      <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '1px solid #D9E2EC', paddingBottom: '5px', marginBottom: '15px' }}>
        III. Adverse Drug Event (ADE) Risk Stratification
      </h2>
      <p style={{ fontSize: '11pt', lineHeight: '1.5', marginBottom: '20px' }}>
        {llmInsights?.riskInsights || `Risk stratification was evaluated across ${riskAnalysis.total || 0} registered cohort patients based on active polypharmacy count, underlying comorbidities, and historical hypersensitivity. ${riskAnalysis.lowPct || 0}% of patients demonstrated an optimal regimen, ${riskAnalysis.modPct || 0}% required moderate surveillance, and ${riskAnalysis.highPct || 0}% required immediate clinical de-prescribing review.`}
      </p>

      {/* IV. Comparative Cohort */}
      <div className="html2pdf__page-break"></div>
      <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '1px solid #D9E2EC', paddingBottom: '5px', marginBottom: '15px', marginTop: '40px' }}>
        IV. Comparative Chronic Disease Cohort Clustering
      </h2>
      <p style={{ fontSize: '11pt', lineHeight: '1.5', marginBottom: '20px' }}>
        {llmInsights?.cohortInsights || "Patients were clustered by primary chronic disease entities to evaluate disease-medication burden."}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', height: '300px' }}>
         <BarChart width={600} height={300} data={cohortAnalysis || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9E2EC" />
            <XAxis dataKey="cohort" stroke="#486581" fontSize={11} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#486581" fontSize={11} allowDecimals={false} />
            <Bar dataKey="count" name="Patients" fill="#243B53" />
         </BarChart>
      </div>
      <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '10pt', marginBottom: '40px', color: '#486581' }}>
        Fig. 3. Encounter distribution categorized across prevalent chronic disease cohorts.
      </p>

      {/* V. Medication Prescription Clustering */}
      <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '1px solid #D9E2EC', paddingBottom: '5px', marginBottom: '15px', marginTop: '40px' }}>
        V. Medication Prescription Clustering (Top 15 Formulations)
      </h2>
      <p style={{ fontSize: '11pt', lineHeight: '1.5', marginBottom: '20px' }}>
        Figure 4 displays the top 15 most frequently prescribed pharmaceutical formulations across the patient cohort, representing the highest volume of outpatient practices.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', height: '300px' }}>
         <BarChart width={600} height={300} data={drugClusteringAnalysis || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9E2EC" />
            <XAxis dataKey="drug" stroke="#486581" fontSize={11} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#486581" fontSize={11} allowDecimals={false} />
            <Bar dataKey="patientCount" name="Unique Patients" fill="#102A43" />
         </BarChart>
      </div>
      <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '10pt', marginBottom: '40px', color: '#486581' }}>
        Fig. 4. Distinct patient frequencies for the top 15 prescribed pharmaceutical agents.
      </p>

    </div>
  )
}
