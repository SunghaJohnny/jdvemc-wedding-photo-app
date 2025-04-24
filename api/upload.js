// api/upload.js
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST requests allowed' });
  }

  try {
    // Get the image data from request body

    console.log("Cloudinary Config:", {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "exists" : "MISSING",
        api_key: process.env.CLOUDINARY_API_KEY ? "exists" : "MISSING"
      });
      
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: 'wedding_guest_upload',
    });

    // Return the secure URL
    return res.status(200).json({ 
      success: true, 
      url: result.secure_url 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Upload failed',
      error: error.message 
    });
  }
};