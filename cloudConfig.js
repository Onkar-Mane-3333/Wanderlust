const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({  //it is to attach the backend with cloudinary account
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV', //it is the foldr name in the cloudinary where our images will be stored.
    allowedformats:['png','jpg','jpeg'], // supports promises as well
  },
});

module.exports = {
    cloudinary,
    storage,
};