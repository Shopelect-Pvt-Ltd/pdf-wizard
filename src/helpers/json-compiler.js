const moment = require("moment"); // Import the moment library
const _ = require("lodash");
const QRGenerator = require("qrcode");

const STATE_CODES = require("../constants/state_codes.json");
const INVOICE_TYPES = require("../constants/invoice_type.json");

const {
  formatDate,
  formatArrayItem,
  generateQRCode,
  GenerateBarcode,
  formatComboData,
} = require("./functions");

const formattingFunctions = {
  DATE: formatDate,
  POS_CODE: (value) => STATE_CODES[value] || "undefined",
  INV_TYPE: (value) => INVOICE_TYPES[value] || "undefined",
  ARRAY_ITEMS: formatArrayItem,
  QR_CODE: generateQRCode,
  BARCODE: GenerateBarcode,
  DATA_COMBO: formatComboData,
};

function JSON_Compiler(template, jsonData) {
  return new Promise((resolve, reject) => {
    let extractedData = {};
    let promises = [];

    for (let key in template) {
      let value = _.get(
        jsonData,
        template[key].key,
        template[key].default || "undefined"
      );

      if (
        template[key].formatType &&
        formattingFunctions[template[key].formatType]
      ) {
        // Apply the corresponding formatting function to the value
        if (template[key].formatType === "QR_CODE") {
          // If it's a QR code, handle it asynchronously
          let promise = new Promise((resolve, reject) => {
            generateQRCode(value, template[key].FormatData)
              .then((qrCode) => {
                extractedData[key] = qrCode;
                resolve(); // Resolve the promise once QR code is generated
              })
              .catch((error) => {
                console.error(
                  `Error generating QR code for key '${key}':`,
                  error
                );
                extractedData[key] = null; // Handle errors as needed
                resolve(); // Resolve the promise even if there's an error
              });
          });

          promises.push(promise); // Push the promise into the promises array
        } else if (template[key].formatType === "BARCODE") {
          // If it's a QR code, handle it asynchronously
          let promise = new Promise((resolve, reject) => {
            GenerateBarcode(value, template[key].FormatData)
              .then((qrCode) => {
                extractedData[key] = "data:image/png;base64," + qrCode;
                resolve(); // Resolve the promise once QR code is generated
              })
              .catch((error) => {
                console.error(
                  `Error generating QR code for key '${key}':`,
                  error
                );
                extractedData[key] = null; // Handle errors as needed
                resolve(); // Resolve the promise even if there's an error
              });
          });

          promises.push(promise); // Push the promise into the promises array
        } else {
          if (template[key].formatType === "ARRAY_ITEMS")
            console.log("ARRAY_ITEMS", jsonData.SignedInvoiceParsed);
          // For other format types, apply the formatting function synchronously
          extractedData[key] = formattingFunctions[template[key].formatType](
            value,
            template[key].FormatData
          );
        }
      } else {
        extractedData[key] = value;
      }
    }

    Promise.all(promises)
      .then(() => {
        resolve(extractedData); // Resolve with the extractedData object
      })
      .catch(reject); // Reject if any promise fails
  });
}

module.exports = JSON_Compiler;
