const express = require("express");
const GeneratePDF = require("./helpers/pdf-generator");
const multer = require("multer");

const app = express();

const port = 8000;
const logger = require("log4js").getLogger();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer();

app.post("/", upload.none(), async (req, res) => {
  // console.log("req.body", req.body.html);
  res.send(200);
});

app.get("/generate/:irn", async (req, res) => {
  logger.debug("Lets generate PDF together!");
  GeneratePDF(req, res);
});
app.post("/generate/:irn", async (req, res) => {
  logger.debug("Lets generate PDF together!");
  GeneratePDF(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
