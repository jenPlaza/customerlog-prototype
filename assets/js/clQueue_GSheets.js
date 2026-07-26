const SHEET_NAME = 'Log';
async function fetchActiveQueue() {
  const e = document.getElementById('primary-queue'),
    t = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Log!A:G?key=${API_KEY}`;
  try {
    const n = await fetch(t);
    if (!n.ok) throw new Error('API Connection Failed');
    const r = (await n.json()).values;
    if (((e.innerHTML = ''), !r || r.length < 2))
      return void (e.innerHTML = '<li>No records found on the Log tab.</li>');
    let o = 0;
    for (let t = 1; t < r.length; t++) {
      const n = r[t];
      if (!n || 0 === n.length) continue;
      const a = n[0],
        s = n[1] || '',
        i = `${s} ${n[2] || ''}`.trim(),
        c = n[4];
      if (c && 'inprogress' === c.toLowerCase().trim()) {
        o++;
        const t = document.createElement('li');
        ((t.className = 'queue-card card'),
          (t.innerHTML = `\n                            <a class="queue-link" href="pantryorder.html?id=${a}" target="_blank">\n                                Open Pantry Order #${a} - ${i}\n                            </a>\n                            <span class="status">(${c})</span>\n                        `),
          e.appendChild(t));
      }
    }
    0 === o &&
      (e.innerHTML =
        '<li>No items are currently "Inprogress" on the Log tab.</li>');
  } catch (t) {
    e.innerHTML =
      '<li style="color:red;">Error loading queue from Log tab. Check API key or Sheet layout.</li>';
  }
}
(fetchActiveQueue(), setInterval(fetchActiveQueue, 3e4));
