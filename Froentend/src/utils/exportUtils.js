// CSV export
export function exportToCSV(filename, rows, columns) {
    if (!rows.length) return;
    const header = columns.map(c => `"${c.label}"`).join(',');
    const body   = rows.map(row =>
        columns.map(c => {
            const val = c.value ? c.value(row) : (row[c.key] ?? '');
            return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
    );
    const csv  = [header, ...body].join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Print / PDF export — opens a clean printable window
export function exportToPrint(title, rows, columns) {
    const tableHead = columns.map(c => `<th>${c.label}</th>`).join('');
    const tableBody = rows.map(row => {
        const cells = columns.map(c => {
            const val = c.value ? c.value(row) : (row[c.key] ?? '');
            return `<td>${val}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; color: #1e293b; }
    h2   { font-size: 18px; margin-bottom: 4px; }
    p    { color: #64748b; font-size: 11px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th   { background: #1e3a8a; color: white; padding: 8px 10px; text-align: left; font-size: 11px; }
    td   { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
    tr:nth-child(even) td { background: #f8fafc; }
    @media print { @page { margin: 15mm; } }
  </style>
</head>
<body>
  <h2>${title}</h2>
  <p>Exported on ${new Date().toLocaleString('en-IN')} &nbsp;|&nbsp; Total records: ${rows.length}</p>
  <table>
    <thead><tr>${tableHead}</tr></thead>
    <tbody>${tableBody}</tbody>
  </table>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
</body>
</html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
}
