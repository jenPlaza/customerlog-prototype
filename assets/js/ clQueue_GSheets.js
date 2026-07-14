// CONFIGURATION: Points directly to your SPREADSHEET and your LOG tab
const SHEET_NAME = 'Log'; // Pointing explicitly to your Log tab

async function fetchActiveQueue() {
  const queueElement = document.getElementById('primary-queue');
  // Grabbing columns A to G from Log tab (matches your script's 7 columns)
  const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:G?key=${API_KEY}`;

  try {
    const response = await fetch(sheetsUrl);
    if (!response.ok) throw new Error('API Connection Failed');

    const data = await response.json();
    const rows = data.values;

    // Clear out loading message
    queueElement.innerHTML = '';

    if (!rows || rows.length < 2) {
      queueElement.innerHTML = '<li>No records found on the Log tab.</li>';
      return;
    }

    let activeCount = 0;

    // Loop through your Log rows (skipping headers, assuming data starts lower down)
    // Using index 1 to safely check all entries logged
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const id = row[0]; // Column A
      const firstName = row[1] || ''; // Column B
      const lastName = row[2] || ''; // Column C
      const name = `${firstName} ${lastName}`.trim();
      const status = row[3]; // Column D ("Inprogress")

      // ONLY display if status is exactly "Inprogress" on the Log sheet
      if (status && status.toLowerCase().trim() === 'inprogress') {
        activeCount++;

        // Create the list item element
        const li = document.createElement('li');
        li.className = 'queue-card card';

        // Build the clickable link pointing to your pantryorder card file
        li.innerHTML = `
                            <a class="queue-link" href="pantryorder.html?id=${id}" target="_blank">
                                Open Pantry Order #${id} - ${name}
                            </a>
                            <span class="status">(${status})</span>
                        `;

        queueElement.appendChild(li);
      }
    }

    if (activeCount === 0) {
      queueElement.innerHTML =
        '<li>No items are currently "Inprogress" on the Log tab.</li>';
    }
  } catch (error) {
    console.error(error);
    queueElement.innerHTML =
      '<li style="color:red;">Error loading queue from Log tab. Check API key or Sheet layout.</li>';
  }
}

// Run immediately on page load
fetchActiveQueue();

// Auto-refresh every 30 seconds to automatically pull new "Inprogress" Log entries
setInterval(fetchActiveQueue, 30000);
