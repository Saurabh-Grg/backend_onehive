// config/esewaConfig.js
const crypto = require("crypto");

function generateEsewaHash({ amount, transaction_uuid }) {
  const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
  const secretKey = process.env.ESEWA_SECRET_KEY;

  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(data)
    .digest("base64");

  return {
    signature: hash,
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };
}

module.exports = { generateEsewaHash };
