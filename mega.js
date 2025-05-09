const fs = require('fs');
const { Storage, File } = require('megajs');

// MEGA email සහ password මෙහි සෘජුවම දායි
const MEGA_EMAIL = 'chamaradhanushka55@gmail.com';
const MEGA_PASSWORD = '983033059V';

// MEGA සම්බන්ධ කිරීම
function connectToMega() {
    return new Storage({
        email: MEGA_EMAIL,
        password: MEGA_PASSWORD
    });
}

// MEGA වෙත ගොනුවක් upload කිරීම
async function uploadToMega(filePath, fileName) {
    return new Promise((resolve, reject) => {
        const storage = connectToMega();

        storage.on('ready', () => {
            const upload = storage.upload({ name: fileName }, fs.createReadStream(filePath));
            upload.on('complete', file => {
                console.log('📤 File uploaded:', file.name);
                resolve(file);
            });
            upload.on('error', reject);
        });

        storage.on('error', reject);
        storage.login();
    });
}

// MEGA වෙතින් ගොනුවක් බාගත කිරීම
async function downloadFromMega(fileUrl, outputPath) {
    return new Promise((resolve, reject) => {
        const file = File.fromURL(fileUrl);

        file.loadAttributes((err, file) => {
            if (err) return reject(err);

            const writeStream = fs.createWriteStream(outputPath);
            file.download().pipe(writeStream);

            writeStream.on('finish', () => {
                console.log('📥 File downloaded to:', outputPath);
                resolve(outputPath);
            });

            writeStream.on('error', reject);
        });
    });
}

module.exports = {
    uploadToMega,
    downloadFromMega
};
