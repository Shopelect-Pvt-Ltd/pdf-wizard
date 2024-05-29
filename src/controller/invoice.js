const DBOperation = require("../config/database");

async function CheckInvoice(req, res) {
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
    console.log("something went wrong");
  }
}

module.exports = {
  CheckInvoice,
};
