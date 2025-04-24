// =====================
// MOCK API MODE (For local testing)
// =====================
if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
  console.warn('Running in mock upload mode - no real API calls will be made');
  
  window.mockUpload = async (base64Image) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      url: base64Image, // Use the base64 as "preview"
      secure_url: base64Image,
      mock: true // For debugging
    };
  };
}

// =====================
// MAIN UPLOAD FUNCTION
// =====================
document.getElementById('fileUpload').addEventListener('change', async function (e) {
  const files = e.target.files;
  const statusDiv = document.getElementById('statusMessage');
  
  if (!files || files.length === 0) {
    statusDiv.innerHTML = "No files selected!";
    return;
  }

  statusDiv.innerHTML = "Uploading...<br>";
  
  for (const file of files) {
    try {
      statusDiv.innerHTML += `Starting upload for: ${file.name}<br>`;
      
      // Convert to base64
      const base64Image = await readFileAsBase64(file);
      
      // =====================
      // UPLOAD LOGIC (Real or Mock)
      // =====================
      let result;
      if (window.mockUpload) {
        // Use mock in local development
        result = await window.mockUpload(base64Image);
      } else {
        // Real API call in production
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });

        const text = await response.text();
        try {
          result = JSON.parse(text);
        } catch {
          throw new Error(`Server returned: ${text.substring(0, 100)}...`);
        }

        if (!response.ok) {
          throw new Error(result.message || `Upload failed (status ${response.status})`);
        }
      }

      // =====================
      // DISPLAY RESULTS
      // =====================
      const isMock = result.mock ? ' (Mock Preview)' : '';

      // Clear status
      statusDiv.innerHTML = '';
      
      statusDiv.innerHTML += `
        ✅ Success!${isMock}<br>
        File: ${file.name}<br>
        ${result.mock ? 
          'Preview:' : 
          'URL:'} 
        <a href="${result.url || result.secure_url}" target="_blank">View Image</a><br><br>
      `;

      showToast();
      
      // For mock mode: Show image preview
      if (result.mock) {
        const img = document.createElement('img');
        img.src = result.url;
        img.style.maxHeight = '100px';
        statusDiv.appendChild(img);
      }
      
    } catch (error) {
      statusDiv.innerHTML += `
        ❌ Error with ${file.name}:<br>
        ${error.message}<br><br>
      `;
      console.error('Upload error:', error);
    }
  }
});

// =====================
// FILE TO BASE64 CONVERTER
// =====================
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// =====================
// THANK YOU TOAST MESSAGE
// =====================
function showToast(message = "Thank you for sharing your memory! 🍂") {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500); // show for 3.5 seconds
}
