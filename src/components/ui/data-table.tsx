import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  /** Contenido de la celda. */
  cell: (row: T) => ReactNode;
  /** Si es true, la columna es el título de la tarjeta en pantallas pequeñas. */
  primary?: boolean;
}

/**
 * Tabla en pantallas medianas y grandes; lista de tarjetas con etiqueta/valor en móvil.
 * Misma información en ambos modos, sin desplazamiento horizontal.
 */
export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
}: {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}) {
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const secondary = columns.filter((c) => c !== primary);

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-line bg-surface md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-canvas text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.header} scope="col" className="px-4 py-3 font-semibold">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((c) => (
                  <td key={c.header} className="px-4 py-3 align-middle">
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={rowKey(row)} className="rounded-lg border border-line bg-surface p-4">
            <div className="font-semibold">{primary.cell(row)}</div>
            <dl className="mt-3 space-y-2 text-sm">
              {secondary.map((c) => (
                <div key={c.header} className="flex items-center justify-between gap-4">
                  <dt className="text-muted">{c.header}</dt>
                  <dd className="text-right">{c.cell(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
