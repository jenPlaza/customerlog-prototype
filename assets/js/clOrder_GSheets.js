const SHEET_NAME = 'Pantry',
  urlParams = new URLSearchParams(window.location.search),
  targetID = urlParams.get('id');
async function loadStaticProfile() {
  const e = document.getElementById('message'),
    t = document.getElementById('profile-card');
  if (!targetID)
    return void (e.innerText =
      'Error: No Pantry Order ID specified in the link URL.');
  e.innerText = 'Fetching profile details from Pantry...';
  const n = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Pantry!A5:AK?key=${API_KEY}`;
  try {
    const r = await fetch(n);
    if (!r.ok) throw new Error('API Connection Failed');
    const i = (await r.json()).values;
    if (!i || i.length < 2)
      return void (e.innerText = 'Pantry sheet contains no records.');
    const o = i[0];
    let l = !1;
    for (let n = 1; n < i.length; n++) {
      const r = i[n],
        s = r[0];
      if (s && s.toString().trim() === targetID.trim()) {
        const n = r[1] || '',
          i = r[2] || '',
          a = r[3] || 'N/A',
          d = r[4] || '';
        let c = 'Not Specified';
        if (d && d.includes('/')) {
          const e = d.split('/'),
            t = e[0] ? e[0].trim() : '0';
          c = `${t} Adults, ${e[1] ? e[1].trim() : '0'} Children`;
        } else d && (c = d);
        ((document.getElementById('view-id').innerText = `Pantry Order #${s}`),
          (document.getElementById('view-name').innerText = `${n} ${i}`.trim()),
          document.getElementById('status-pill') &&
            (document.getElementById('status-pill').innerText = a),
          document.getElementById('view-household') &&
            (document.getElementById('view-household').innerText = c));
        let m = '<ul style="text-align: left; padding-left: 20px;">',
          g = !1;
        for (let e = 5; e < r.length; e++) {
          const t = r[e];
          if (t && '' !== t.toString().trim()) {
            ((m += `<li style="margin-bottom: 8px;"><strong>${o[e] || `Column ${String.fromCharCode(65 + e)}`}</strong></li>`),
              (g = !0));
          }
        }
        m += '</ul>';
        const u = document.getElementById('view-items');
        (u &&
          (u.innerHTML = g ? m : 'No specific items assigned to this profile.'),
          (e.style.display = 'none'),
          (t.style.display = 'block'),
          (l = !0));
        break;
      }
    }
    l ||
      (e.innerText = `Could not find a pantry record matching ID: "${targetID}"`);
  } catch (t) {
    e.innerText =
      'Could not pull data. Ensure your API Key, Tab spelling, and Sheet ranges are correct.';
  }
}
function closeWorkOrderCard() {
  window.close();
}
loadStaticProfile();
