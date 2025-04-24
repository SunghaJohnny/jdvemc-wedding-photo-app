// api/upload.js

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'No image data' });
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: 'wedding_guest_upload', // preset from your Cloudinary settings
    });

    return res.status(200).json({ secure_url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload failed', error });
  }
}
