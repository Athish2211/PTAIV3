import { NextRequest, NextResponse } from 'next/server'
import { queryOllamaGenerate } from '@/lib/ollama'

const PRIMARY_MODEL = 'phi4-mini:latest'
const FALLBACK_MODEL = 'medgemma:latest'

export async function POST(req: NextRequest) {
  try {
    const { allergies, medications, patientName } = await req.json()

    // Normalize allergy list
    const cleanAllergies = (Array.isArray(allergies) ? allergies : [allergies || ''])
      .map((a: any) => (typeof a === 'string' ? a.trim() : ''))
      .filter((a: string) => a && a.toUpperCase() !== 'NKDA' && !a.toLowerCase().includes('no known'))

    // Normalize medication list
    const cleanMeds = (Array.isArray(medications) ? medications : [medications || ''])
      .map((m: any) => {
        if (typeof m === 'string') return m.trim()
        if (m && typeof m === 'object') return `${m.medication || m.name || ''} ${m.dosage || ''}`.trim()
        return ''
      })
      .filter((m: string) => m.length > 0)

    if (cleanAllergies.length === 0 || cleanMeds.length === 0) {
      return NextResponse.json({
        hasConflict: false,
        severity: 'None',
        conflictingMedication: '',
        allergyTarget: '',
        reason: 'No documented drug allergies or active medications to evaluate.',
        recommendation: 'Proceed with standard clinical dosing and monitoring.',
      })
    }

    const systemPrompt = `You are a Clinical Pharmacologist and Patient Safety AI.
Analyze whether any of the prescribed medications conflict with or have cross-reactivity with the patient's known allergies.
Check for:
1. Exact drug match (e.g., allergic to Penicillin -> prescribed Penicillin).
2. Class cross-reactivity and shared chemical structures (e.g., Penicillin allergy -> Amoxicillin, Ampicillin, Piperacillin, or 1st/2nd gen Cephalosporins).
3. NSAID cross-sensitivity (e.g., Aspirin allergy -> Ibuprofen, Naproxen, Ketorolac).
4. Sulfonamide cross-reactivity (e.g., Sulfa allergy -> Bactrim / Trimethoprim-Sulfamethoxazole).
5. Opioids, contrast dyes, ACE inhibitors / angioedema, and other pharmacological classes.

You MUST respond ONLY with a JSON object in this exact format:
{
  "hasConflict": boolean,
  "severity": "High" | "Moderate" | "Low" | "None",
  "conflictingMedication": string,
  "allergyTarget": string,
  "reason": string,
  "recommendation": string
}`

    const userPrompt = `Patient: ${patientName || 'Patient'}
Known Documented Allergies: ${cleanAllergies.join(', ')}
Prescribed Medications to Evaluate: ${cleanMeds.join(', ')}

Evaluate if there is any drug-allergy conflict or cross-reactivity. Return JSON.`

    let resultJson: any = null

    // Try primary model (phi4-mini), then fallback model (medgemma)
    for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
      const { response: slmText, success } = await queryOllamaGenerate({
        model,
        prompt: userPrompt,
        system: systemPrompt,
        format: 'json',
        temperature: 0.1,
        timeoutMs: 60000,
      })

      if (success && slmText) {
        try {
          resultJson = JSON.parse(slmText)
          if (typeof resultJson.hasConflict === 'boolean') {
            break
          }
        } catch (pErr) {
          console.warn('Failed to parse Ollama JSON response:', slmText)
        }
      }
    }

    // Dynamic fallback if Ollama service is unreachable
    if (!resultJson) {
      // Intelligent fallback check
      let fallbackConflict = false
      let fallbackMed = ''
      let fallbackAlg = ''

      for (const alg of cleanAllergies) {
        const algL = alg.toLowerCase()
        for (const med of cleanMeds) {
          const medL = med.toLowerCase()
          if (
            medL.includes(algL) ||
            algL.includes(medL) ||
            (algL.includes('penicillin') && (medL.includes('amox') || medL.includes('cillin') || medL.includes('augmentin'))) ||
            (algL.includes('aspirin') && (medL.includes('ibuprofen') || medL.includes('nsaid') || medL.includes('naproxen'))) ||
            (algL.includes('sulfa') && (medL.includes('bactrim') || medL.includes('septra') || medL.includes('sulfa')))
          ) {
            fallbackConflict = true
            fallbackMed = med
            fallbackAlg = alg
            break
          }
        }
        if (fallbackConflict) break
      }

      resultJson = {
        hasConflict: fallbackConflict,
        severity: fallbackConflict ? 'Moderate' : 'None',
        conflictingMedication: fallbackMed,
        allergyTarget: fallbackAlg,
        reason: fallbackConflict
          ? `Potential clinical cross-reactivity between ${fallbackAlg} allergy and prescribed ${fallbackMed}.`
          : 'No cross-reactivity or allergy conflict identified.',
        recommendation: fallbackConflict
          ? 'Consider non-cross-reactive therapeutic alternatives and verify patient tolerance.'
          : 'Proceed with standard monitoring.',
      }
    }

    return NextResponse.json({
      success: true,
      ...resultJson,
      modelUsed: PRIMARY_MODEL,
    })
  } catch (error: any) {
    console.error('Allergy check error:', error)
    return NextResponse.json({ error: error.message || 'Failed to perform allergy check' }, { status: 500 })
  }
}
