const SHEET_NAME = 'Log';
async function fetchActiveQueue() {
  const e = document.getElementById('primary-queue');
  try {
    const t = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/1SfUYg8KdcuCuAi_0_iHN0CjtIHTw12tHyMnPJYyAdO8/values/Log!A:G?key=AIzaSyAuqC9lXq4t3cZKv_m8aNTA5HjoCQsTFYw',
    );
    if (!t.ok) throw new Error('API Connection Failed');
    const n = (await t.json()).values;
    if (((e.innerHTML = ''), !n || n.length < 2))
      return void (e.innerHTML = '<li>No records found on the Log tab.</li>');
    let r = 0;
    for (let t = 1; t < n.length; t++) {
      const o = n[t];
      if (!o || 0 === o.length) continue;
      const a = o[0],
        i = `${o[1] || ''} ${o[2] || ''}`.trim(),
        s = o[4];
      if (s && 'inprogress' === s.toLowerCase().trim()) {
        r++;
        const t = document.createElement('li');
        ((t.className = 'queue-card card'),
          (t.innerHTML = `\n                            <a class="queue-link" href="pantryorder.html?id=${a}" target="_blank">\n                                Open Pantry Order #${a} - ${i}\n                            </a>\n                            <span class="status">(${s})</span>\n                        `),
          e.appendChild(t));
      }
    }
    0 === r &&
      (e.innerHTML =
        '<li>No items are currently "Inprogress" on the Log tab.</li>');
  } catch (t) {
    e.innerHTML =
      '<li style="color:red;">Error loading queue from Log tab. Check API key or Sheet layout.</li>';
  }
}
(fetchActiveQueue(), setInterval(fetchActiveQueue, 3e4));
