import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDFFromElement(elementId: string, filename: string) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error(`Element with id ${elementId} not found`)

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#0f172a',
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const imgWidth = 210
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  let heightLeft = imgHeight

  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pdf.internal.pageSize.getHeight()

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdf.internal.pageSize.getHeight()
  }

  pdf.save(filename)
}

// Sanitize text to prevent XSS
export function sanitizeText(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Normalize URL for comparison
export function normalizeURL(url: string): string {
  try {
    const urlObj = new URL(url.includes('://') ? url : 'https://' + url)
    return urlObj.origin + urlObj.pathname
  } catch {
    return url
  }
}

// Redact email for privacy
export function redactEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  return `${local.substring(0, 2)}***@${domain}`
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Calculate days ago
export function daysAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}
