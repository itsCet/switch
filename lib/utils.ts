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

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const MONTH_LABEL_FR = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre",
];

export const WEEKDAY_LABEL_FR = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export function getMonthMatrix(year: number, month: number): Date[][] {
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const start = new Date(year, month, 1 - firstWeekday);

  const weeks: Date[][] = [];
  const cursor = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}
