const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("usps.db");

const LinQuery = `
 SELECT last_zipcode FROM process_status
`;

const inQuery = `INSERT INTO
zipcode_data (
    zipcode,
    res_count,
    country_code,
    bus_count,
    total_count,
    zone_id,
    city,
    state,
    facility
)
VALUES (?,?,?,?,?,?,?,?,?)`;

function getRecord() {
  return new Promise((resolve, reject) => {
    db.all(LinQuery, (err, row) => {
      if (err) {
        console.log("error", err);
        reject(err);
      }
      if (row?.length === 0) {
        resolve(null);
      }
      if (row) {
        resolve(row);
      }
      reject("unhanled error");
    });
  });
}

function insertZipData(payload) {
  return new Promise((resolve, reject) => {
    db.run(
      inQuery,
      [
        payload.zipcode,
        payload.res_count,
        payload.country_code,
        payload.bus_count,
        payload.total_count,
        payload.zone_id,
        payload.city,
        payload.state,
        payload.facility,
      ],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}

module.exports = { getRecord, insertZipData };
