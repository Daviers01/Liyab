import jsPDF from 'jspdf'

// ─── Types (mirrored from GA4AuditApp) ──────────────────────────────────────

interface AuditCheckResult {
  id: string
  category: string
  name: string
  status: 'pass' | 'warn' | 'fail' | 'info'
  message: string
  recommendation?: string
}

interface AuditReport {
  propertyName: string
  propertyId: string
  healthScore: number
  timestamp: string
  checks: AuditCheckResult[]
  summary: {
    total: number
    passed: number
    warnings: number
    failures: number
    info: number
  }
}

// ─── Config (update logoPath for whitelabels) ───────────────────────────────

const LOGO_PATH = '/logo-liyab.png'
const BRAND_NAME = 'Liyab Digital'

// ─── Colors ─────────────────────────────────────────────────────────────────

const COLORS = {
  orange: [234, 88, 12] as [number, number, number], // #EA580C
  orangeLight: [255, 237, 213] as [number, number, number], // #FFEDD5
  dark: [23, 23, 23] as [number, number, number],
  text: [38, 38, 38] as [number, number, number],
  muted: [115, 115, 115] as [number, number, number],
  lightMuted: [163, 163, 163] as [number, number, number],
  border: [229, 229, 229] as [number, number, number],
  pageBg: [250, 250, 250] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  pass: [16, 185, 129] as [number, number, number], // emerald-500
  passBg: [209, 250, 229] as [number, number, number],
  warn: [245, 158, 11] as [number, number, number], // amber-500
  warnBg: [254, 243, 199] as [number, number, number],
  fail: [239, 68, 68] as [number, number, number], // red-500
  failBg: [254, 226, 226] as [number, number, number],
  info: [59, 130, 246] as [number, number, number], // blue-500
  infoBg: [219, 234, 254] as [number, number, number],
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function loadImageAsDataURL(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context unavailable'))
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Good'
  if (score >= 50) return 'Needs Attention'
  return 'Critical'
}

function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return COLORS.pass
  if (score >= 50) return COLORS.warn
  return COLORS.fail
}

function statusLabel(s: string) {
  if (s === 'pass') return 'PASS'
  if (s === 'warn') return 'WARNING'
  if (s === 'fail') return 'FAIL'
  return 'INFO'
}

function statusColor(s: string): [number, number, number] {
  if (s === 'pass') return COLORS.pass
  if (s === 'warn') return COLORS.warn
  if (s === 'fail') return COLORS.fail
  return COLORS.info
}

function statusBgColor(s: string): [number, number, number] {
  if (s === 'pass') return COLORS.passBg
  if (s === 'warn') return COLORS.warnBg
  if (s === 'fail') return COLORS.failBg
  return COLORS.infoBg
}

/** Wrap text to a max width, returning array of lines */
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[]
}

// ─── Main Export ────────────────────────────────────────────────────────────

export async function generateAuditPDF(report: AuditReport): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentW = pageW - margin * 2
  let y = 0

  // Load logo
  let logoDataURL: string | null = null
  try {
    logoDataURL = await loadImageAsDataURL(LOGO_PATH)
  } catch {
    // Logo optional — proceed without
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  function ensureSpace(needed: number) {
    if (y + needed > pageH - 20) {
      addFooter()
      doc.addPage()
      y = 15
    }
  }

  function addFooter() {
    const pageNum = doc.getNumberOfPages()
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.lightMuted)
    doc.text(
      `${BRAND_NAME} · GA4 Audit Report · Page ${pageNum}`,
      pageW / 2,
      pageH - 8,
      { align: 'center' },
    )
  }

  function drawRoundedRect(
    x: number,
    rY: number,
    w: number,
    h: number,
    r: number,
    fill: [number, number, number],
    stroke?: [number, number, number],
  ) {
    doc.setFillColor(...fill)
    if (stroke) {
      doc.setDrawColor(...stroke)
      doc.setLineWidth(0.3)
      doc.roundedRect(x, rY, w, h, r, r, 'FD')
    } else {
      doc.roundedRect(x, rY, w, h, r, r, 'F')
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PAGE 1: COVER / HEADER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Full-width orange header bar
  doc.setFillColor(...COLORS.orange)
  doc.rect(0, 0, pageW, 48, 'F')

  // Logo in header
  y = 10
  if (logoDataURL) {
    // Scale logo proportionally, max height 14mm
    const logoMaxH = 14
    const logoRatio = 866 / 288 // original aspect
    const logoH = logoMaxH
    const logoW = logoH * logoRatio
    doc.addImage(logoDataURL, 'PNG', margin, y, logoW, logoH)
  } else {
    doc.setFontSize(16)
    doc.setTextColor(...COLORS.white)
    doc.setFont('helvetica', 'bold')
    doc.text(BRAND_NAME, margin, y + 10)
  }

  // Right side: report date
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(255, 255, 255)
  doc.text(formatDate(report.timestamp), pageW - margin, y + 5, { align: 'right' })
  doc.setFontSize(8)
  doc.text('GA4 Audit Report', pageW - margin, y + 10, { align: 'right' })

  // Title section
  y = 60
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('GA4 Configuration', margin, y)
  y += 9
  doc.text('Audit Report', margin, y)

  y += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.muted)
  doc.text(`Property: ${report.propertyName}`, margin, y)
  y += 5
  doc.text(`ID: ${report.propertyId}`, margin, y)

  // ── Health Score Card ──────────────────────────────────────────────────

  y += 14
  const scoreCardH = 52
  drawRoundedRect(margin, y, contentW, scoreCardH, 4, COLORS.white, COLORS.border)

  // Score circle
  const circleCx = margin + 30
  const circleCy = y + scoreCardH / 2
  const circleR = 18
  const scoreCol = getScoreColor(report.healthScore)

  // Background circle
  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(3)
  doc.circle(circleCx, circleCy, circleR, 'S')

  // Score arc — draw colored circle on top
  doc.setDrawColor(...scoreCol)
  doc.setLineWidth(3)
  // Approximate arc by drawing a thicker colored circle
  doc.circle(circleCx, circleCy, circleR, 'S')

  // Score text
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...scoreCol)
  doc.text(String(report.healthScore), circleCx, circleCy + 1, { align: 'center' })
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.muted)
  doc.text('/ 100', circleCx, circleCy + 6, { align: 'center' })

  // Score label
  const labelX = margin + 65
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text(`Health Score: ${getScoreLabel(report.healthScore)}`, labelX, y + 18)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.muted)
  const scoreDesc =
    report.healthScore >= 80
      ? 'Your GA4 setup is solid. A few optimizations could improve data quality further.'
      : report.healthScore >= 50
        ? 'Your setup has gaps. Addressing the issues below will significantly improve your data quality.'
        : 'Multiple critical issues found. Address these immediately to avoid unreliable reporting.'
  const descLines = wrapText(doc, scoreDesc, contentW - 55)
  doc.text(descLines, labelX, y + 25)

  // Summary stats row
  const statsY = y + scoreCardH - 11
  const statItems = [
    { label: 'Passed', count: report.summary.passed, color: COLORS.pass },
    { label: 'Warnings', count: report.summary.warnings, color: COLORS.warn },
    { label: 'Failures', count: report.summary.failures, color: COLORS.fail },
    { label: 'Info', count: report.summary.info, color: COLORS.info },
  ]
  let statX = labelX
  statItems.forEach((stat) => {
    // Colored dot
    doc.setFillColor(...stat.color)
    doc.circle(statX, statsY - 1, 1.5, 'F')
    // Value
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.dark)
    doc.text(String(stat.count), statX + 4, statsY)
    // Label
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLORS.muted)
    doc.text(stat.label, statX + 4 + doc.getTextWidth(String(stat.count)) + 1, statsY)
    statX += 30
  })

  y += scoreCardH + 10

  // ── Executive Summary ─────────────────────────────────────────────────

  ensureSpace(40)

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('Executive Summary', margin, y)
  y += 3

  // Orange underline
  doc.setDrawColor(...COLORS.orange)
  doc.setLineWidth(0.8)
  doc.line(margin, y, margin + 35, y)
  y += 8

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.text)

  const summaryText = `This automated audit analyzed ${report.summary.total} configuration checks across your GA4 property "${report.propertyName}" (${report.propertyId}). The overall health score is ${report.healthScore}/100 (${getScoreLabel(report.healthScore)}).`
  const summaryLines = wrapText(doc, summaryText, contentW)
  doc.text(summaryLines, margin, y)
  y += summaryLines.length * 4.5 + 4

  // Priority items
  const failures = report.checks.filter((c) => c.status === 'fail')
  const warnings = report.checks.filter((c) => c.status === 'warn')

  if (failures.length > 0) {
    ensureSpace(12 + failures.length * 5)
    drawRoundedRect(margin, y, contentW, 6 + failures.length * 5.5 + 3, 3, COLORS.failBg)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.fail)
    doc.text(`⚠ ${failures.length} Critical Issue${failures.length > 1 ? 's' : ''} Requiring Immediate Action`, margin + 5, y + 5)
    failures.forEach((f, i) => {
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...COLORS.text)
      doc.text(`•  ${f.name}: ${f.message}`, margin + 7, y + 11 + i * 5.5)
    })
    y += 6 + failures.length * 5.5 + 7
  }

  if (warnings.length > 0) {
    ensureSpace(12 + warnings.length * 5)
    drawRoundedRect(margin, y, contentW, 6 + warnings.length * 5.5 + 3, 3, COLORS.warnBg)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.warn)
    doc.text(`${warnings.length} Warning${warnings.length > 1 ? 's' : ''} to Review`, margin + 5, y + 5)
    warnings.forEach((w, i) => {
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...COLORS.text)
      doc.text(`•  ${w.name}: ${w.message}`, margin + 7, y + 11 + i * 5.5)
    })
    y += 6 + warnings.length * 5.5 + 7
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DETAILED RESULTS BY CATEGORY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Group checks by category
  const grouped: Record<string, AuditCheckResult[]> = {}
  report.checks.forEach((check) => {
    if (!grouped[check.category]) grouped[check.category] = []
    grouped[check.category].push(check)
  })

  Object.entries(grouped).forEach(([category, checks]) => {
    const failCount = checks.filter((c) => c.status === 'fail').length
    const warnCount = checks.filter((c) => c.status === 'warn').length
    const passCount = checks.filter((c) => c.status === 'pass').length

    // Category header
    ensureSpace(25)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.dark)
    doc.text(category, margin, y)

    // Category stats badges
    let badgeX = margin + doc.getTextWidth(category) + 4
    const badgeY = y - 3.5

    if (failCount > 0) {
      const badge = `${failCount} failed`
      const bw = doc.getTextWidth(badge) + 5
      drawRoundedRect(badgeX, badgeY, bw + 1, 5, 1.5, COLORS.failBg)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...COLORS.fail)
      doc.text(badge, badgeX + 2.5, badgeY + 3.5)
      badgeX += bw + 3
    }

    if (warnCount > 0) {
      const badge = `${warnCount} warning${warnCount > 1 ? 's' : ''}`
      const bw = doc.getTextWidth(badge) + 5
      drawRoundedRect(badgeX, badgeY, bw + 1, 5, 1.5, COLORS.warnBg)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...COLORS.warn)
      doc.text(badge, badgeX + 2.5, badgeY + 3.5)
      badgeX += bw + 3
    }

    if (failCount === 0 && warnCount === 0 && passCount === checks.length) {
      const badge = 'All passed'
      const bw = doc.getTextWidth(badge) + 5
      drawRoundedRect(badgeX, badgeY, bw + 1, 5, 1.5, COLORS.passBg)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...COLORS.pass)
      doc.text(badge, badgeX + 2.5, badgeY + 3.5)
    }

    y += 5

    // Thin separator
    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.2)
    doc.line(margin, y, margin + contentW, y)
    y += 4

    // Individual checks
    checks.forEach((check) => {
      // Estimate height needed
      const msgLines = wrapText(doc, check.message, contentW - 20)
      const recLines = check.recommendation
        ? wrapText(doc, `Fix: ${check.recommendation}`, contentW - 20)
        : []
      const itemH = 8 + msgLines.length * 4 + (recLines.length > 0 ? recLines.length * 3.5 + 3 : 0)

      ensureSpace(itemH + 4)

      // Status badge
      const sColor = statusColor(check.status)
      const sBgColor = statusBgColor(check.status)
      const sLabel = statusLabel(check.status)
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'bold')
      const sLabelW = doc.getTextWidth(sLabel) + 4
      drawRoundedRect(margin, y - 2.8, sLabelW + 1, 4.2, 1, sBgColor)
      doc.setTextColor(...sColor)
      doc.text(sLabel, margin + 2, y)

      // Check name
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...COLORS.dark)
      doc.text(check.name, margin + sLabelW + 4, y)
      y += 5

      // Check message
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...COLORS.muted)
      doc.text(msgLines, margin + 4, y)
      y += msgLines.length * 3.8

      // Recommendation
      if (recLines.length > 0) {
        y += 2
        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(...COLORS.orange)
        doc.text(recLines, margin + 4, y)
        y += recLines.length * 3.3
      }

      y += 4
    })

    y += 4
  })

  // ── Final Page Footer ─────────────────────────────────────────────────

  // Disclaimer
  ensureSpace(25)
  y += 4
  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(0.2)
  doc.line(margin, y, margin + contentW, y)
  y += 6

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.lightMuted)
  const disclaimer = `This report was generated automatically by ${BRAND_NAME}'s GA4 Audit Tool on ${formatDate(report.timestamp)}. It reflects GA4 configuration at the time of the audit. Actual tracking accuracy may differ based on implementation details not visible through the GA4 Admin API. For a comprehensive audit, consider pairing this with a manual review.`
  const disclaimerLines = wrapText(doc, disclaimer, contentW)
  doc.text(disclaimerLines, margin, y)

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addFooter()
  }

  // ── Save ──────────────────────────────────────────────────────────────

  const filename = `GA4-Audit-${report.propertyName.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}
