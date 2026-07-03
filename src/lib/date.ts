// Utilitários de data — tudo em português do Brasil, fuso America/Sao_Paulo.

const TIMEZONE = "America/Sao_Paulo";

// Retorna a data de "hoje" no fuso do Brasil no formato YYYY-MM-DD.
export function todayISO(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return parts; // en-CA já formata como YYYY-MM-DD
}

// Soma (ou subtrai) dias a uma data ISO (YYYY-MM-DD), retornando ISO.
export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function yesterdayISO(): string {
  return addDaysISO(todayISO(), -1);
}

// Valida formato YYYY-MM-DD e existência da data.
export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

// "1 de julho de 2026"
export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// "quarta-feira, 1 de julho de 2026"
export function formatFullDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// "01/07/2026"
export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

// Rótulo relativo amigável ("Hoje", "Ontem" ou data curta).
export function relativeDateLabel(iso: string): string {
  if (iso === todayISO()) return "Hoje";
  if (iso === yesterdayISO()) return "Ontem";
  return formatShortDate(iso);
}

// Últimos N dias como array de ISO (inclui hoje).
export function lastNDaysISO(n: number): string[] {
  const today = todayISO();
  return Array.from({ length: n }, (_, i) => addDaysISO(today, -i));
}
