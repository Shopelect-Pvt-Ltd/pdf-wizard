const AWS = require("aws-sdk");

AWS.config.update({
  region: "", // e.g., 'us-east-1'
  accessKeyId: "",
  secretAccessKey: "",
});

function UploadAsset(gstin, filename, bufferData) {
  const s3 = new AWS.S3();
  const params = {
    Bucket: "airline-engine-scraped/irn-invoices/" + gstin,
    Key: filename,
    Body: bufferData,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location); // URL of the uploaded file
      }
    });
  });
}

module.exports = UploadAsset;
