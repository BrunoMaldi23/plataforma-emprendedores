/** Escapa un valor para CSV (comillas dobles, comas y saltos de línea). */
function cell(value: string | number): string {
  const text = String(value);
  return /[",\n\r;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Convierte filas a CSV. Incluye BOM para que Excel respete las tildes. */
export function toCsv(headers: string[], rows: Array<Array<string | number>>): string {
  const lines = [headers, ...rows].map((row) => row.map(cell).join(","));
  return `﻿${lines.join("\r\n")}`;
}

/** Inicia la descarga de un archivo de texto generado en el navegador. */
export function downloadText(filename: string, content: string, mime = "text/csv;charset=utf-8"): void {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
