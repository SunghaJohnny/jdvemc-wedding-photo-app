document.getElementById('fileUpload').addEventListener('change', async function (e) {
    const files = e.target.files;
    const statusDiv = document.getElementById('statusMessage');
    
    if (!files || files.length === 0) {
      statusDiv.innerHTML = "No files selected!";
      return;
    }
  
    // Clear previous messages
    statusDiv.innerHTML = "Uploading...<br>";
    
    // Process each file one by one
    for (const file of files) {
      try {
        // Show upload started
        statusDiv.innerHTML += `Starting upload for: ${file.name}<br>`;
        
        // Convert to base64
        const base64Image = await readFileAsBase64(file);
        
        // Upload to your API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Image }),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || 'Upload failed');
        }
  
        // Show success
        statusDiv.innerHTML += `
          ✅ Success!<br>
          File: ${file.name}<br>
          URL: <a href="${result.url}" target="_blank">View Image</a><br><br>
        `;
        
      } catch (error) {
        // Show error
        statusDiv.innerHTML += `
          ❌ Error with ${file.name}:<br>
          ${error.message}<br><br>
        `;
        console.error('Upload error:', error);
      }
    }
  });
  
  // Helper function to convert file to base64
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:image/... prefix
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }