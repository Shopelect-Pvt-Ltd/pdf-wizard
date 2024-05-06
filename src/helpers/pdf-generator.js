const puppeteer = require("puppeteer");
const fs = require("fs");
const jsonData = require("./data.json");
var handlebars = require("handlebars");
const templateData = require("../templates/irn_invoice/dataset-map");
const JSON_Compiler = require("./json-compiler");
const DBOperation = require("../config/database");
const UploadAsset = require("./uploader");
//required if you are using handle bar helper functions
require("handlebars-helpers")();
async function GeneratePDF(req, res) {
  // Launch a headless Chromium browser
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();
  let htmlContent = "";
  try {
    // Set the HTML content you want to convert to PDF
    htmlContent = fs.readFileSync(
      "src/templates/irn_invoice/irn_invoice.html",
      "utf8"
    );
    // console.log("htmlContent", htmlContent);
  } catch (error) {
    console.error("Error reading HTML file:", error);
  }

  var options = {
    headerTemplate: "<span></span>",
    displayHeaderFooter: false,
    path: "generated-pdf.pdf",
    format: "A4",

    printBackground: true,
  };
  let dataFromDatabase = await DBOperation.fetchDBCollection({
    collection: "irn",
    payload: { Irn: req.params.irn },
  });
  if (dataFromDatabase.length === 0) {
    res.send({ status: false, message: "No Data Found" });
    return;
  }
  let compiledJSON = await JSON_Compiler(
    templateData.IRN_TEMPLATE_MAP,
    dataFromDatabase[0]
  );

  // console.log("compiled json", compiledJSON);
  const template = handlebars.compile(htmlContent);
  //map json data to template
  const html = template(compiledJSON);
  // console.log("compiled json", compiledJSON);
  console.log("compiled json", html);

  // Set the HTML content of the page
  await page.setContent(html, {
    waitUntil: ["domcontentloaded", "load", "networkidle0"],
  });
  await page.addStyleTag({
    content: `
    @media print {
      .page-content {
        position: relative;
        z-index: 1; /* Ensure content is above the border */
      }
      .page-border {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid #000; /* Border on all four sides */
        box-sizing: border-box; /* Include border in body size */
      }
      /* Ensure page break after each page */
      @page {
        size: auto;
        margin: 26px;
      }
    }
    `,
  });
  // Generate the PDF
  // await page.pdf(options);

  await page.evaluate(() => {
    const content = document.body.innerHTML;
    document.body.innerHTML = `<div class="page-content">${content}</div><div class="page-border"></div>`;
  });

  page.pdf(options).then(function (buffer) {
    browser.close().then(async function () {
      UploadAsset(
        dataFromDatabase[0]?.BuyerGstin,
        dataFromDatabase[0]?.Irn + ".pdf",
        buffer
      )
        .then(async (url) => {
          console.log("PDF uploaded to S3 successfully. URL:", url);
          await DBOperation.updateDBCollection({
            irn: req.params.irn,
            url: url,
          });
          res.send({
            status: true,
            message: "PDF uploaded to S3 successfully. URL:",
          });
        })
        .catch((error) => {
          console.error("Error uploading PDF to S3:", error);
        });
      //set the pdf and send it back as API response
      // res
      //   .set({
      //     "Content-Type": "application/pdf",
      //     "Content-Length": buffer.length,
      //     "Content-Disposition":
      //       "attachment; filename=" + req.params.irn + ".pdf",
      //   })
      //   .send(buffer);
    });
  });

  // Close the browser
  // await browser.close();

  console.log("PDF generated successfully!");
}

// Call the function to generate the PDF
module.exports = GeneratePDF;
