const DBOperation = require("../config/database");
const JSON_Compiler = require("../helpers/json-compiler");
const templateData = require("../templates/irn_invoice/dataset-map");
var handlebars = require("handlebars");
const fs = require("fs");
const _ = require("lodash");

async function CheckInvoice(req, res) {
  console.log("got rquest");
  const IRN_NO = req.params.irn_no;
  try {
    let dataFromDatabase = await DBOperation.fetchDBCollection({
      collection: "irn",
      payload: { Irn: IRN_NO },
    });
    console.log("irn data", dataFromDatabase);
    if (dataFromDatabase.length === 0) {
      res.send({ status: false, message: "IRN number does not exist" });
      return;
    } else if (!dataFromDatabase[0]?.s3_url) {
      res.send({
        status: false,
        message: "Invoice not available, please generate",
      });
      return;
    } else {
      res.send({ status: true, message: "Invoice found" });
    }
  } catch (error) {
    console.log("something went wrong", error);
  }
}

async function getInvoiceData(req, res) {
  const IRN_NO = req.params.irn_no;
  try {
    let dataFromDatabase = await DBOperation.fetchDBCollection({
      collection: "irn",
      payload: { Irn: IRN_NO },
    });
    if (dataFromDatabase.length === 0) {
      res.send({ status: false, message: "IRN number does not exist" });
      return;
    } else if (!dataFromDatabase[0]?.s3_url) {
      res.send({
        status: false,
        message: "Invoice not available, please generate",
      });
      return;
    } else {
      let data = dataFromDatabase[0];
      let parsedData = {};
      let templateMap = templateData.IRN_TEMPLATE_MAP;
      for (let key in templateMap) {
        let template = templateMap[key];
        if (typeof template === "object" && template.key) {
          let keys = template.key.split(".");
          let value = data;
          for (let k of keys) {
            value = value ? _.get(value, k, null) : null;
          }
          parsedData[key] = value || template.default || null;
        }
      }

      res.send({
        status: true,
        message: "Invoice found",
        data: parsedData,
      });
    }
  } catch (error) {
    console.log("something went wrong", error);
  }
}

async function getInvoiceHTML(req, res) {
  const IRN_NO = req.params.irn_no;
  try {
    let dataFromDatabase = await DBOperation.fetchDBCollection({
      collection: "irn",
      payload: { Irn: IRN_NO },
    });
    if (dataFromDatabase.length === 0) {
      res.send({ status: false, message: "IRN number does not exist" });
      return;
    } else if (!dataFromDatabase[0]?.s3_url) {
      res.send({
        status: false,
        message: "Invoice not available, please generate",
      });
      return;
    } else {
      let compiledJSON = await JSON_Compiler(
        templateData.IRN_TEMPLATE_MAP,
        dataFromDatabase[0]
      );
      let htmlContent = "";
      try {
        // Set the HTML content you want to convert to PDF
        htmlContent = fs.readFileSync(
          //   "src/templates/irn_invoice/irn_invoice.html",
          "../src/templates/irn_invoice/irn_invoice.html",
          "utf8"
        );
      } catch (error) {
        console.error("Error reading HTML file:", error);
      }

      // console.log("compiled json", compiledJSON);
      const template = handlebars.compile(htmlContent);
      //map json data to template
      const html = template(compiledJSON);

      res.send({
        status: true,
        message: "Invoice found",
        data: html,
      });
    }
  } catch (error) {
    console.log("something went wrong", error);
  }
}

module.exports = {
  CheckInvoice,
  getInvoiceData,
  getInvoiceHTML,
};
