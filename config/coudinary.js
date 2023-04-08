const cloudinary = require("cloudinary");
// const _ = require('underscore');

const Q = require("q");

function upload(file) {
    cloudinary.config({
        cloud_name: 'dbd8wog43',
        api_key: '227366481328175',
        api_secret: 'fseZMdhQ_0DmcxWbXpSzEx9KMrI'
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
        cloud_name: 'dbd8wog43',
        api_key: '227366481328175',
        api_secret: 'fseZMdhQ_0DmcxWbXpSzEx9KMrI'
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