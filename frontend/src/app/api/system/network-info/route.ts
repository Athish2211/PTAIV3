import { NextResponse } from 'next/server'
import os from 'os'

export async function GET() {
  const nets = os.networkInterfaces()
  let lanIp = 'localhost'

  // Look for Wi-Fi first, then Ethernet, then any non-internal IPv4
  const priorityInterfaces = ['wi-fi', 'wifi', 'wlan', 'ethernet']
  const candidates: { name: string; ip: string }[] = []

  for (const name of Object.keys(nets)) {
    const netList = nets[name]
    if (!netList) continue

    for (const net of netList) {
      if (net.family === 'IPv4' && !net.internal) {
        candidates.push({ name: name.toLowerCase(), ip: net.address })
      }
    }
  }

  // Prioritize Wi-Fi or active LAN
  const matched = candidates.find((c) =>
    priorityInterfaces.some((pref) => c.name.includes(pref) && !c.ip.startsWith('192.168.56.')) // ignore virtualbox
  ) || candidates[0]

  if (matched) {
    lanIp = matched.ip
  }

  // Check if an explicit environment variable exists
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERIFY_URL

  return NextResponse.json({
    lanIp,
    port: 3000,
    lanUrl: `http://${lanIp}:3000`,
    localhostUrl: 'http://localhost:3000',
    configuredUrl: envUrl || null,
  })
}
