const express = require("express");
const GeneratePDF = require("./helpers/pdf-generator");
const multer = require("multer");
const {
  CheckInvoice,
  getInvoiceData,
  getInvoiceHTML,
} = require("./controller/invoice");
const cors = require("cors");

const app = express();
app.use(cors());

const port = process.argv[2] || process.env.PORT || 8000;
console.log("port is", port, process.argv);
const logger = require("log4js").getLogger();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer();

app.post("/", upload.none(), async (req, res) => {
  // console.log("req.body", req.body.html);
  res.send(200);
});

// app.get("/generate/:irn", async (req, res) => {
//   logger.debug("Generating single pdf");
//   GeneratePDF(req, res);
// });

app.post("/generate_single/:irn", async (req, res) => {
  GeneratePDF(req, res);
});

//Endpoint for checking and validating invoice data
app.get("/check_invoice/:irn_no", async (req, res) => {
  CheckInvoice(req, res);
});

app.get("/get_invoice_data/:irn_no", async (req, res) => {
  getInvoiceData(req, res);
});

app.get("/get_invoice_html/:irn_no", async (req, res) => {
  getInvoiceHTML(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
