// preset wedding_guest_upload
// cloud name duovsekrd

const cloudName = 'duovsekrd'; 
const uploadPreset = 'wedding_guest_upload'; 

document.getElementById('fileUpload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  document.getElementById('statusMessage').innerText = "Uploading photo... 📤";

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log('Upload success:', data);
    document.getElementById('statusMessage').innerHTML = `
      ✅ Photo uploaded! Thank you!<br>
      <a href="${data.secure_url}" target="_blank">View Your Photo</a>
    `;
  })
  .catch(err => {
    console.error('Upload error:', err);
    document.getElementById('statusMessage').innerText = "Oops! Upload failed.";
  });
});
