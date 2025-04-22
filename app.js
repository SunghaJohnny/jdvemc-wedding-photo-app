// preset wedding_guest_upload
// cloud name duovsekrd

const cloudName = 'duovsekrd'; 
const uploadPreset = 'wedding_guest_upload'; 

document.getElementById('fileUpload').addEventListener('change', function(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const statusDiv = document.getElementById('statusMessage');
  statusDiv.innerHTML = "Uploading photo(s)... 📤<br>";

  Array.from(files).forEach(file => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    fetch(url, {
      method: 'POST',
      body: formData
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
  });
});

