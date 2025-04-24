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
          .then(async res => {
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(errorText);
            }
            return res.json();
          })
      };
  
      reader.readAsDataURL(file); // Convert image to base64
    });
  });
  