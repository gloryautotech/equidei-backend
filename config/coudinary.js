const cloudinary = require("cloudinary");
// const _ = require('underscore');

const Q = require("q");

function upload(file) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    return new Q.Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file, { resource_type: "auto", flags: "attachment" }, (err, res) => {
            if (err) {
                console.log('cloudinary err:', err);
                reject(err);
            } else {
                console.log('cloudinary res:', res);
                return resolve(res.secure_url);
            }
        });
    });
};
function downloadZip(files) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    let ids = [];
    for (let file of files) {
        let part1 = file.split('/');
        let fileName = part1[part1.length - 1];
        let fileId = fileName.split('.');
        fileId.splice(-1);
        ids.push(fileId.join('.'));
    }
    let url = cloudinary.v2.utils.download_zip_url({ public_ids: ids, use_original_filename: true, flatten_folders: true, skip_transformation_name: true });
    return url;
};


module.exports = { upload, downloadZip }