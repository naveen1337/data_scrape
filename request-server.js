import fetch from "node-fetch";

export const requestServer = function (method, url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  return new Promise((resolve, reject) => {
    const options = {
      signal: controller.signal,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (method === "POST") {
      options.body = JSON.stringify(payload);
    }

    fetch(url, options)
      .then((serverResponse) => {
        clearTimeout(timeoutId);
        if (serverResponse.ok) {
          logRequest(url, payload);
          if (serverResponse.headers.get("content-length") === "0") {
            resolve({ status: serverResponse.status });
          } else {
            serverResponse
              .json()
              .then((data) => {
                resolve({ status: serverResponse.status, data });
              })
              .catch((err) => {
                logErrorRequest(url, payload, err);
                reject("Parse Failed on Success response");
              });
          }
        } else {
          console.log(">>> Error Status Code: ", serverResponse.status);
          logErrorRequest(url, payload, "not ok response");
          serverResponse
            .json()
            .then((data) => {
              resolve({ status: serverResponse.status, data });
            })
            .catch((err) => {
              console.log(err);

              reject("Parse Failed On failed request");
            });
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        logErrorRequest(url, payload, err);
        reject("Request Failed");
      });
  });
};



const logRequest = (url) => {
  console.log(`\x1b[32m  Request ${url} \x1b[0m`);
};
const logErrorRequest = (url, err) => {
  console.log(`\x1b[33m [*ERROR*] Request ${url} \x1b[0m`);
};
