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
        
        // Convert to base64 (keep the prefix this time)
        const base64Image = await readFileAsBase64(file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });
  
        // First check if response is JSON
        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch {
          throw new Error(`Server returned: ${text.substring(0, 100)}...`);
        }
  
        if (!response.ok) {
          throw new Error(result.message || `Upload failed (status ${response.status})`);
        }
  
        statusDiv.innerHTML += `
          ✅ Success!<br>
          File: ${file.name}<br>
          URL: <a href="${result.url || result.secure_url}" target="_blank">View Image</a><br><br>
        `;
        
      } catch (error) {
        statusDiv.innerHTML += `
          ❌ Error with ${file.name}:<br>
          ${error.message}<br><br>
        `;
        console.error('Full error:', error);
      }
    }
  });
  
  // Keep the data:image/ prefix this time
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }