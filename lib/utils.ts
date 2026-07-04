export function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffMin) < 60) {
    if (diffMin === 0) return "maintenant";
    return diffMin > 0 ? `dans ${diffMin} min` : `il y a ${Math.abs(diffMin)} min`;
  }
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `dans ${diffHours} h` : `il y a ${Math.abs(diffHours)} h`;
  }
  return diffDays > 0 ? `dans ${diffDays} j` : `il y a ${Math.abs(diffDays)} j`;
}

export function formatDateFr(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

export function formatDayNum(iso: string): number {
  return new Date(iso).getDate();
}
