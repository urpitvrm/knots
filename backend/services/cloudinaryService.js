const { Readable } = require('stream');
const { cloudinary, isConfigured: cloudinaryIsConfigured } = require('../config/cloudinary');

const DEFAULT_FOLDER = 'cozyloops/products';

function folder() {
  return process.env.CLOUDINARY_FOLDER || DEFAULT_FOLDER;
}

/**
 * @param {Buffer} buffer
 * @returns {Promise<{ url: string, publicId: string }>}
 */
function uploadBuffer(buffer) {
  if (!cloudinaryIsConfigured()) {
    const err = new Error('Cloudinary is not configured');
    err.status = 503;
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder(), resource_type: 'image' },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

module.exports = { uploadBuffer, isConfigured: cloudinaryIsConfigured };
