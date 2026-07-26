const SHEET_NAME = 'Pantry',
  urlParams = new URLSearchParams(window.location.search),
  targetID = urlParams.get('id');
async function loadStaticProfile() {
  const e = document.getElementById('message'),
    t = document.getElementById('profile-card');
  if (targetID) {
    e.innerText = 'Fetching profile details from Pantry...';
    try {
      const n = await fetch(
        'https://sheets.googleapis.com/v4/spreadsheets/1SfUYg8KdcuCuAi_0_iHN0CjtIHTw12tHyMnPJYyAdO8/values/Pantry!A5:AK?key=AIzaSyAuqC9lXq4t3cZKv_m8aNTA5HjoCQsTFYw',
      );
      if (!n.ok) throw new Error('API Connection Failed');
      const r = (await n.json()).values;
      if (!r || r.length < 2)
        return void (e.innerText = 'Pantry sheet contains no records.');
      const i = r[0];
      let o = !1;
      for (let n = 1; n < r.length; n++) {
        const l = r[n],
          s = l[0];
        if (s && s.toString().trim() === targetID.trim()) {
          const n = l[1] || '',
            r = l[2] || '',
            a = l[3] || 'N/A',
            d = l[4] || '';
          let c = 'Not Specified';
          if (d && d.includes('/')) {
            const e = d.split('/');
            c = `${e[0] ? e[0].trim() : '0'} Adults, ${e[1] ? e[1].trim() : '0'} Children`;
          } else d && (c = d);
          ((document.getElementById('view-id').innerText =
            `Pantry Order #${s}`),
            (document.getElementById('view-name').innerText =
              `${n} ${r}`.trim()),
            document.getElementById('status-pill') &&
              (document.getElementById('status-pill').innerText = a),
            document.getElementById('view-household') &&
              (document.getElementById('view-household').innerText = c));
          let m = '<ul style="text-align: left; padding-left: 20px;">',
            g = !1;
          for (let e = 5; e < l.length; e++) {
            const t = l[e];
            t &&
              '' !== t.toString().trim() &&
              ((m += `<li style="margin-bottom: 8px;"><strong>${i[e] || `Column ${String.fromCharCode(65 + e)}`}</strong></li>`),
              (g = !0));
          }
          m += '</ul>';
          const u = document.getElementById('view-items');
          (u &&
            (u.innerHTML = g
              ? m
              : 'No specific items assigned to this profile.'),
            (e.style.display = 'none'),
            (t.style.display = 'block'),
            (o = !0));
          break;
        }
      }
      o ||
        (e.innerText = `Could not find a pantry record matching ID: "${targetID}"`);
    } catch (t) {
      e.innerText =
        'Could not pull data. Ensure your API Key, Tab spelling, and Sheet ranges are correct.';
    }
  } else e.innerText = 'Error: No Pantry Order ID specified in the link URL.';
}
function closeWorkOrderCard() {
  window.close();
}
loadStaticProfile();
