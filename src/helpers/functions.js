const bwipjs = require("bwip-js");
const moment = require("moment"); // Import the moment library
const _ = require("lodash");
const QRGenerator = require("qrcode");

const formattingFunctions = {
  DATE: formatDate,
  POS_CODE: (value) => STATE_CODES[parseInt(value).toString()] || "undefined",
  INV_TYPE: (value) => INVOICE_TYPES[value] || "undefined",
  ARRAY_ITEMS: formatArrayItem,
  QR_CODE: generateQRCode,
  BARCODE: GenerateBarcode,
  DATA_COMBO: formatComboData,
};

async function generateQRCode(value) {
  return new Promise((resolve, reject) => {
    QRGenerator.toDataURL(value, function (err, qrCodeBase64) {
      if (err) {
        reject(err);
      } else {
        console.log("QR code generated successfully!");
        resolve(qrCodeBase64);
      }
    });
  });
}

function formatArrayItem(arrayItems, formatObject) {
  let items = [];
  arrayItems.forEach((itemObject) => {
    let pushableObject = {};
    for (let key in formatObject) {
      let value = _.get(
        itemObject,
        formatObject[key].key,
        formatObject[key].default || "undefined"
      );
      if (
        formatObject[key].formatType &&
        formattingFunctions[formatObject[key].formatType]
      ) {
        // Apply the corresponding formatting function to the value
        value = formattingFunctions[formatObject[key].formatType](
          formatObject[key].formatType === "DATA_COMBO" ? itemObject : value,
          formatObject[key].FormatData
        );
      }

      pushableObject[key] = value;
    }
    items.push(pushableObject);
  });
  return items;
}

function replacePlaceholders(format, dataobj) {
  console.log("placeholder data", dataobj);
  // Regular expression to match placeholders like {{propertyName}}
  const regex = /\{\{([\w.\[\]]+)\}\}/g;

  // Replace placeholders with corresponding values from the data object
  return format.replace(regex, (match, prop) => {
    // Use lodash.get() to access nested properties
    let value = _.get(dataobj, prop);
    // If value is undefined, return the placeholder itself
    return value !== undefined ? value : "0";
  });
}

// Function to format date values
function formatDate(value, dateFormat) {
  const formats = [
    "YYYY-MM-DDTHH:mm:ss.SSSZ", // Format 1: 2024-01-16T00:00:00.000+00:00
    "YYYY-MM-DD HH:mm:ss", // Format 2: 2024-02-08 16:08:00
    "MM/DD/YYYY", // Format 3: 02/21/2024
    "DD/MM/YYYY",
  ];

  // Try parsing the date string with each format
  for (let format of formats) {
    const parsedDate = moment(value.toString(), format, true); // Use strict parsing mode
    if (parsedDate.isValid()) {
      return parsedDate.format(dateFormat);
    }
  }

  return "Invalid date format";
}

async function GenerateBarcode(value) {
  console.log("barcode value:", value);
  const config = {
    bcid: "msi", // Barcode type
    text: value.toString(), // Text or data to encode
    scalex: 5,
    scaley: 2,
    height: 44, // Bar height, in millimeters
    width: 300,
    includetext: false, // Show human-readable text below the barcode
    textxalign: 2, // Center the text horizontally
    textyoffset: 6, // Adjust this value to add vertical space between barcode and text
    textsize: 8,
    // font: "Arial",
  };
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(config, function (err, qrCodeBase64) {
      if (err) {
        reject(err);
      } else {
        console.log(
          "Barcode code generated successfully!",
          qrCodeBase64.toString("base64")
        );
        resolve(qrCodeBase64.toString("base64"));
      }
    });
  });
}

function formatComboData(value, formatData) {
  return replacePlaceholders(formatData, value);
}
module.exports = {
  formatDate: formatDate,
  formatArrayItem: formatArrayItem,
  generateQRCode: generateQRCode,
  GenerateBarcode: GenerateBarcode,
  formatComboData: formatComboData,
};
