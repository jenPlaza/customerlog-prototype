// CONFIGURATION: Points to your Google Sheet and explicitly targets the Pantry tab out to AJ
const SHEET_NAME = 'Pantry';

// 1. Automatically grab the ID out of the browser address bar (?id=XXXX)
const urlParams = new URLSearchParams(window.location.search);
const targetID = urlParams.get('id');

async function loadStaticProfile() {
  const messageElement = document.getElementById('message');
  const cardElement = document.getElementById('profile-card');

  if (!targetID) {
    messageElement.innerText =
      'Error: No Pantry Order ID specified in the link URL.';
    return;
  }

  messageElement.innerText = 'Fetching profile details from Pantry...';

  // Fetching columns A through AJ, starting at Row 5 for headers
  const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A5:AJ?key=${API_KEY}`;

  try {
    const response = await fetch(sheetsUrl);
    if (!response.ok) throw new Error('API Connection Failed');

    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length < 2) {
      messageElement.innerText = 'Pantry sheet contains no records.';
      return;
    }

    // Extract headers from row 5
    const headers = rows[0];
    let matchFound = false;

    // 2. Loop through the data rows to find a matching ID
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const currentId = row[0]; // ID is in Column A

      if (currentId && currentId.toString().trim() === targetID.trim()) {
        const firstName = row[1] || ''; // Column B
        const lastName = row[2] || ''; // Column C
        const rosterStatus = row[3] || 'N/A'; // Column D
        const householdRaw = row[4] || ''; // Column E (e.g., "2/2")

        // 3. Process the Column E Household metric (Format: Adults/Children)
        let householdDisplay = 'Not Specified';
        if (householdRaw && householdRaw.includes('/')) {
          const parts = householdRaw.split('/');
          const adults = parts[0] ? parts[0].trim() : '0';
          const children = parts[1] ? parts[1].trim() : '0';
          householdDisplay = `${adults} Adults, ${children} Children`;
        } else if (householdRaw) {
          householdDisplay = householdRaw; // Fallback if it's not formatted with a slash
        }

        // 4. Inject core identity and household metrics into your card headers
        document.getElementById('view-id').innerText =
          `Pantry Order #${currentId}`;
        document.getElementById('view-name').innerText =
          `${firstName} ${lastName}`.trim();

        if (document.getElementById('status-pill')) {
          document.getElementById('status-pill').innerText = rosterStatus;
        }

        // Custom target for your household info display block
        if (document.getElementById('view-household')) {
          document.getElementById('view-household').innerText =
            householdDisplay;
        }

        // 5. DYNAMIC SECTION: Loop remaining items starting at Column F (index 5) out to AJ
        let itemsHTML = '<ul style="text-align: left; padding-left: 20px;">';
        let customDataFound = false;

        for (let j = 5; j < row.length; j++) {
          const cellValue = row[j];

          // Only list items that aren't empty
          if (cellValue && cellValue.toString().trim() !== '') {
            const columnName =
              headers[j] || `Column ${String.fromCharCode(65 + j)}`;
            // itemsHTML += `<li style="margin-bottom: 8px;"><strong>${columnName}:</strong> ${cellValue}</li>`;
            itemsHTML += `<li style="margin-bottom: 8px;"><strong>${columnName}</strong></li>`;
            customDataFound = true;
          }
        }
        itemsHTML += '</ul>';

        const viewItemsContainer = document.getElementById('view-items');
        if (viewItemsContainer) {
          viewItemsContainer.innerHTML = customDataFound
            ? itemsHTML
            : 'No specific items assigned to this profile.';
        }

        // 6. Reveal layout view
        messageElement.style.display = 'none';
        cardElement.style.display = 'block';
        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      messageElement.innerText = `Could not find a pantry record matching ID: "${targetID}"`;
    }
  } catch (error) {
    console.error(error);
    messageElement.innerText =
      'Could not pull data. Ensure your API Key, Tab spelling, and Sheet ranges are correct.';
  }
}

// Run immediately when page loads
loadStaticProfile();

function closeWorkOrderCard() {
  // Closes the current browser tab/window
  window.close();
}
