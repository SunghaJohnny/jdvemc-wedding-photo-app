// preset wedding_guest_upload
// cloud name duovsekrd

document.getElementById('fileUpload').addEventListener('change', function (e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.innerHTML = "Uploading photo(s)... 📤<br>";
  
    Array.from(files).forEach(file => {
      const reader = new FileReader();
  
      reader.onloadend = function () {
        fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: reader.result }),
        })
          .then(res => res.json())
          .then(data => {
            console.log('Upload success:', data);
            statusDiv.innerHTML += `
              ✅ Uploaded: <a href="${data.secure_url}" target="_blank">${file.name}</a><br>
            `;
          })
          .catch(err => {
            console.error('Upload error:', err);
            statusDiv.innerHTML += `❌ Failed to upload ${file.name}<br>`;
          });
      };
  
      reader.readAsDataURL(file); // Convert image to base64
    });
  });
  