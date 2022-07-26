const zipCode = require("./us_zipcode.json");
const { getRecord, insertZipData } = require("./query");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("usps.db");
const axios = require("axios").default;

const inSQuery = `INSERT INTO process_status (last_zipcode) VALUES (?)`;

(async () => {
  let data;
  const lastInset = await getRecord();
  if (lastInset === null) {
    data = zipCode;
  } else {
    const index = zipCode.findIndex((item) => item === zipCode);
    data = zipCode.splice(index, zipCode.length);
  }
  for (let item of data) {
    await query(item);
  }
})();

async function query(zipCode) {
  try {
    console.log("PROCESSING:", zipCode);
    const URL = `https://gis.usps.com/arcgis/rest/services/EDDM/selectZIP/GPServer/boxes/execute?f=json&ZIP=${zipCode}&Rte_Box=R&UserName=EDDM`;
    const response = await axios.get(URL);
    const field = response.data.results[0].value.features;
    if (field) {
      const houses = field.reduce(
        (prev, c) => (c.attributes.RES_CNT += prev),
        0
      );
      const business = field.reduce(
        (prev, c) => (c.attributes.BUS_CNT += prev),
        0
      );
      const total = field.reduce(
        (prev, c) => (c.attributes.TOT_CNT += prev),
        0
      );
      const payload = {
        zipcode: zipCode,
        res_count: houses,
        country_code: "USA",
        bus_count: business,
        total_count: total,
        zone_id: field.ZIP_CRID,
        city: "N/A",
        state: "N/A",
        facility: field.FAC_NAME,
      };
      const dbTxn  = insertZipData(payload)

      if (dbTxn && statusTxn) {
        console.log("['FATAL'] Error on", zipCode);
        return;
      }
      return;
    }
    throw new Error("unhandled");
  } catch (err) {
    console.log("error", err);
  }
}
