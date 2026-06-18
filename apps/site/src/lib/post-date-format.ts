/**
 * Relative date formatting for posts.
 *
 * Formats an ISO 8601 date string as a human-readable relative time
 * ("just now", "5 minutes ago", "3 hours ago", "2 days ago") for recent
 * dates, falling back to a short locale-formatted absolute date
 * ("17 Jun 2026") for older dates.
 */

/**
 * Format a date string as a relative time description.
 *
 * Rules:
 * - < 1 minute: "just now"
 * - < 60 minutes: "X minutes ago"
 * - < 24 hours: "X hours ago"
 * - < 7 days: "X days ago"
 * - >= 7 days: locale-formatted date (en-GB short format)
 *
 * @param dateStr - An ISO 8601 date string (or any value `new Date()` can parse).
 * @returns A human-readable relative date string.
 */
export function formatRelativeDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
