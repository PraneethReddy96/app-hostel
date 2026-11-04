// Utility to generate a Print-Ready Official PDF Report (Save as PDF / Print)
// with an optional 1-click Excel (.csv) download inside the preview bar.

export const downloadRawCSV = (filename, headers, rows) => {
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvLines = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(','))
  ];

  const csvContent = '\uFEFF' + csvLines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadCSV = (filename, headers, rows) => {
  // Derive a clean human-readable report title from the filename
  const cleanTitle = String(filename || 'Hostel_Report')
    .replace(/\.(csv|pdf)$/i, '')
    .replace(/_\d{4}-\d{2}-\d{2}$/, '')
    .replace(/_/g, ' ');

  const generatedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  const refNo = `JS-RPT-${Date.now().toString().slice(-6)}`;

  const escapeHtml = (val) => {
    if (val === null || val === undefined) return '-';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const formatCellHtml = (val, headerText) => {
    const text = escapeHtml(val);
    const h = String(headerText || '').toLowerCase();
    const lower = text.toLowerCase();

    // Format currency columns nicely
    if (
      (h.includes('inr') || h.includes('amount') || h.includes('fee') || h.includes('rent') || h.includes('value') || h.includes('spend')) &&
      !isNaN(Number(val)) &&
      val !== '' &&
      val !== null
    ) {
      return `<strong>₹ ${Number(val).toLocaleString('en-IN')}</strong>`;
    }

    // Format status badges
    if (h.includes('status') || h.includes('urgency') || h.includes('priority')) {
      if (lower.includes('paid') || lower.includes('optimal') || lower.includes('resolved') || lower.includes('closed') || lower.includes('success') || lower.includes('occupied')) {
        return `<span class="status-pill pill-green">${text}</span>`;
      }
      if (lower.includes('low') || lower.includes('overdue') || lower.includes('high') || lower.includes('emergency') || lower.includes('danger')) {
        return `<span class="status-pill pill-red">${text}</span>`;
      }
      if (lower.includes('pending') || lower.includes('progress') || lower.includes('medium') || lower.includes('assigned')) {
        return `<span class="status-pill pill-amber">${text}</span>`;
      }
    }

    return text;
  };

  const tableHeadersHtml = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('');
  const tableRowsHtml = rows
    .map(
      (row, idx) =>
        `<tr>
          <td style="color:#64748b;font-weight:600;text-align:center;">${idx + 1}</td>
          ${row.map((cell, cIdx) => `<td>${formatCellHtml(cell, headers[cIdx])}</td>`).join('')}
        </tr>`
    )
    .join('');

  const htmlDocument = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(cleanTitle)} — JoyStay Official PDF Report</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .toolbar-title {
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn {
      border: none;
      border-radius: 6px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-print {
      background: #4f46e5;
      color: #ffffff;
    }
    .btn-close {
      background: #334155;
      color: #f8fafc;
    }
    .sheet {
      max-width: 1120px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 10px;
      padding: 28px 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .letterhead {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 18px;
      gap: 16px;
      flex-wrap: wrap;
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #ffffff;
      font-weight: 800;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hostel-name {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0;
      color: #0f172a;
    }
    .hostel-sub {
      font-size: 12px;
      color: #475569;
      margin: 2px 0 0;
    }
    .meta-box {
      text-align: right;
      font-size: 12px;
      color: #334155;
      line-height: 1.5;
    }
    .report-banner {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #4f46e5;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .report-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .record-count {
      font-size: 12px;
      font-weight: 700;
      background: #e0e7ff;
      color: #3730a3;
      padding: 4px 10px;
      border-radius: 99px;
    }
    .table-wrap {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th {
      background: #1e293b;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10.5px;
      letter-spacing: 0.04em;
      padding: 9px 10px;
      border: 1px solid #1e293b;
      text-align: left;
    }
    td {
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      color: #1e293b;
      vertical-align: middle;
    }
    tbody tr:nth-child(even) td {
      background: #f8fafc;
    }
    .status-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 99px;
      font-size: 10.5px;
      font-weight: 700;
    }
    .pill-green {
      background: #dcfce7;
      color: #166534;
    }
    .pill-red {
      background: #fee2e2;
      color: #991b1b;
    }
    .pill-amber {
      background: #fef3c7;
      color: #92400e;
    }
    .signatures {
      margin-top: 36px;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 12px;
      color: #334155;
      page-break-inside: avoid;
    }
    .sig-block {
      text-align: center;
      min-width: 180px;
    }
    .sig-line {
      border-top: 1px solid #64748b;
      padding-top: 6px;
      font-weight: 700;
      color: #0f172a;
    }
    @media print {
      body {
        background: #ffffff;
      }
      .toolbar {
        display: none !important;
      }
      .sheet {
        margin: 0;
        padding: 0;
        box-shadow: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-title">
      <span>📄 ${escapeHtml(cleanTitle)} — Printable PDF View</span>
    </div>
    <div class="toolbar-actions">
      <button class="btn btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button class="btn btn-close" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="sheet">
    <div class="letterhead">
      <div class="brand-row">
        <div class="logo-box">JS</div>
        <div>
          <h1 class="hostel-name">JOY STAY HOSTEL</h1>
          <p class="hostel-sub">Official Campus Residence & Mess Administration ERP • Knowledge Park Campus</p>
        </div>
      </div>
      <div class="meta-box">
        <div><strong>Document Ref:</strong> ${refNo}</div>
        <div><strong>Generated On:</strong> ${escapeHtml(generatedAt)}</div>
        <div><strong>Status:</strong> Official Verified Record</div>
      </div>
    </div>

    <div class="report-banner">
      <h2 class="report-title">${escapeHtml(cleanTitle)}</h2>
      <span class="record-count">Total Records: ${rows.length}</span>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:42px;text-align:center;">#</th>
            ${tableHeadersHtml}
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </div>

    <div class="signatures">
      <div class="sig-block">
        <div style="height:36px;"></div>
        <div class="sig-line">Prepared By: Hostel Office Desk</div>
        <div style="font-size:11px;color:#64748b;">Accounts & Operations</div>
      </div>
      <div class="sig-block">
        <div style="height:36px;"></div>
        <div class="sig-line">Verified By: Chief Warden</div>
        <div style="font-size:11px;color:#64748b;">Dr. K.V. Rao • Joy Stay Hostel</div>
      </div>
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;

  const printWin = window.open('', '_blank');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(htmlDocument);
    printWin.document.close();
  } else {
    // Fallback if popup blocked: download as standalone printable HTML/PDF sheet
    const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${cleanTitle.replace(/\s+/g, '_')}_Printable_Report.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
