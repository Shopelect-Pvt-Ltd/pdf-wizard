let IRN_TEMPLATE_MAP = {
  header_gstin: { key: "SignedInvoiceParsed.SellerDtls.Gstin" },
  header_qr_code: {
    key: "SignedQRCode",
    formatType: "QR_CODE",
  },
  bottom_barcode: {
    key: "SignedInvoiceParsed.AckNo",
    formatType: "BARCODE",
  },
  header_gstin_name: { key: "SignedInvoiceParsed.SellerDtls.LglNm" },
  irn_no: { key: "SignedInvoiceParsed.Irn" },
  ack_no: { key: "SignedInvoiceParsed.AckNo" },
  ack_date: {
    key: "SignedInvoiceParsed.AckDt",
    formatType: "DATE",
    FormatData: "DD-MM-YYYY hh:mm:ss",
  },
  sup_type_code: { key: "SignedInvoiceParsed.TranDtls.SupTyp" },
  doc_no: { key: "SignedQRCodeParsed.DocNo" },
  igst_applicable: "SignedInvoiceParsed.ItemList.TranDtls.IgstOnIntra",
  pos: {
    key: "SignedInvoiceParsed.BuyerDtls.Pos",
    formatType: "POS_CODE",
    FormatData: "",
    default: " ",
  },
  doc_type: {
    key: "SignedQRCodeParsed.DocTyp",
    formatType: "INV_TYPE",
    FormatData: "",
  },
  doc_date: {
    key: "SignedQRCodeParsed.DocDt",
    formatType: "DATE",
    FormatData: "DD-MM-YYYY",
  },
  ecom_gstin: { key: "SignedInvoiceParsed.BuyerDtls.Gstin" },
  //supplierinfo
  supplier_gstin: { key: "SignedInvoiceParsed.SellerDtls.Gstin" },
  supplier_legal_name: { key: "SignedInvoiceParsed.SellerDtls.LglNm" },
  supplier_trade_name: { key: "SignedInvoiceParsed.SellerDtls.TrdNm" },
  supplier_address1: { key: "SignedInvoiceParsed.SellerDtls.Addr1" },
  supplier_address2: { key: "SignedInvoiceParsed.SellerDtls.Addr2" },
  supplier_location: { key: "SignedInvoiceParsed.SellerDtls.Loc" },
  supplier_pin: { key: "SignedInvoiceParsed.SellerDtls.Pin" },
  supplier_state_code: { key: "SignedInvoiceParsed.SellerDtls.Stcd" },

  //recipientinfo
  recipient_gstin: { key: "SignedInvoiceParsed.BuyerDtls.Gstin" },
  recipient_legal_name: { key: "SignedInvoiceParsed.BuyerDtls.LglNm" },
  recipient_trade_name: { key: "SignedInvoiceParsed.BuyerDtls.TrdNm" },
  recipient_pos: { key: "SignedInvoiceParsed.BuyerDtls.Pos" },
  recipient_address1: { key: "SignedInvoiceParsed.BuyerDtls.Addr1" },
  recipient_address2: { key: "SignedInvoiceParsed.BuyerDtls.Addr2" },
  recipient_location: { key: "SignedInvoiceParsed.BuyerDtls.Loc" },
  recipient_pin: { key: "SignedInvoiceParsed.BuyerDtls.Pin" },
  recipient_state_code: { key: "SignedInvoiceParsed.BuyerDtls.Stcd" },

  //despatchinfo
  despatch_legal_name: { key: "SignedInvoiceParsed.DispDtls.Nm" },
  despatch_address1: { key: "SignedInvoiceParsed.DispDtls.Addr1" },
  despatch_address2: { key: "SignedInvoiceParsed.DispDtls.Addr2" },
  despatch_location: { key: "SignedInvoiceParsed.DispDtls.Loc" },
  despatch_pin: { key: "SignedInvoiceParsed.DispDtls.Pin" },
  despatch_state_code: { key: "SignedInvoiceParsed.DispDtls.Stcd" },
  // despatch_pos: { key: "SignedInvoiceParsed.BuyerDtls.Pos" },

  //shiptoinfo
  shipto_gstin: { key: "SignedInvoiceParsed.ShipDtls.Gstin" },
  shipto_legal_name: { key: "SignedInvoiceParsed.ShipDtls.LglNm" },
  shipto_trade_name: { key: "SignedInvoiceParsed.ShipDtls.TrdNm" },
  shipto_address_1: { key: "SignedInvoiceParsed.ShipDtls.Addr1" },
  shipto_location: { key: "SignedInvoiceParsed.ShipDtls.Loc" },
  //  shipto_state_code: { key: "SignedInvoiceParsed.DispDtls.Stcd" },
  // despatch_pos: { key: "SignedInvoiceParsed.BuyerDtls.Pos" },

  //despatch and ship info  to will be null since it's service invoice

  //itemlist json map
  itemlist: {
    formatType: "ARRAY_ITEMS",
    FormatData: {
      sr_no: { key: "SlNo", default: "0" },
      description: { key: "PrdDesc", default: "0" },
      hsn_code: { key: "HsnCd", default: "0" },
      qty: { key: "Qty", default: "0" },
      unit_type: { key: "Unit", default: "0" },
      unit_price: { key: "UnitPrice", default: "0" },
      discount: { key: "Discount", default: "0" },
      tax_amount: { key: "AssAmt", default: "0" },
      other_charge: { key: "OthChrg", default: "0" },
      total: { key: "TotItemVal", default: "0" },
      tax_rate_sum: {
        formatType: "DATA_COMBO",
        FormatData: "{{GstRt}}+{{CesRt}}|{{StateCesRt}}+{{StateCesNonAdvlAmt}}",
        key: "",
      },
    },
    key: "SignedInvoiceParsed.ItemList",
  },

  //summary of tax info
  summary_tax_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.AssVal",
    default: "0",
  },
  summary_cgst_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.CgstVal",
    default: "0",
  },
  summary_sgst_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.SgstVal",
    default: "0",
  },
  summary_igst_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.IgstVal",
    default: "0",
  },
  summary_cess_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.CesVal",
    default: "0",
  },
  summary_stcess_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.StCesVal",
    default: "0",
  },
  summary_discount_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.Discount",
    default: "0",
  },
  summary_other_charge_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.OthChrg",
    default: "0",
  },
  summary_roundoff_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.RndOffAmt",
    default: "0",
  },
  summary_total_inv_amt: {
    key: "SignedInvoiceParsed.ItemList[0].ValDtls.TotInvVal",
    default: "0",
  },

  generated_by: {
    key: "SignedQRCodeParsed.SellerGstin",
  },
  print_date: {
    key: "SignedInvoiceParsed.AckDt",
  },
  digital_sign_on: {
    key: "SignedInvoiceParsed.AckDt",
    formatType: "DATE",
    FormatData: "DD-MM-YYYY hh:mm:ss",
  },
  print_date: {
    key: "SignedInvoiceParsed.AckDt",
    formatType: "DATE",
    FormatData: "DD-MM-YYYY hh:mm:ss",
  },
};

module.exports = {
  IRN_TEMPLATE_MAP: IRN_TEMPLATE_MAP,
};
