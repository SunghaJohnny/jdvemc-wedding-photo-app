const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Only GET requests allowed' });
  }

  try {
    const result = await cloudinary.search
      .expression('folder:wedding_guest_upload') // or use tag: if you're tagging uploads
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    const images = result.resources.map(img => img.secure_url);
    res.status(200).json({ success: true, images });
  } catch (error) {
    console.error('Fetch images error:', error);
    res.status(500).json({ success: false, message: 'Error fetching images' });
  }
};
