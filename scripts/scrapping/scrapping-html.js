/**
 * Scrapper une page Web
 *      https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP
 *
 * V0 : récupérer les codes http + leur message sous la forme
 *  [ { code: 200, message: "OK" } ]
 * V1 : Sauvegarder dans un fichier CSV
 * code;message
 * 200;OK
 */

const URL = "https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP";

const https = require("node:https");
const fs = require("node:fs/promises");
const { JSDOM } = require("jsdom");

const request = https.request(URL, {}, function (response) {
  if (response.statusCode !== 200) {
    throw new Error("Invalid request = " + response.statusCode);
  }

  const data = [];
  response.on("data", function (chunk) {
    data.push(chunk);
  });

  response.on("end", function () {
    // Aggregation
    const aggregatedData = Buffer.concat(data);

    // Parsing
    let parsedData;
    if (response.headers["content-type"].match(/(application|text)\/json/i)) {
      parsedData = JSON.parse(aggregatedData);
    } else if (
      response.headers["content-type"].match(/(application|text)\/html/i)
    ) {
      parsedData = new JSDOM(aggregatedData).window.document;
    } else {
      parsedData = aggregatedData;
    }

    // processing
    const cells = parsedData.querySelectorAll(
      "table tr:not(:first-child) th, table tr:not(:first-child) td:first-of-type"
    );
    const processedData = [];
    for (let i = 0; i < cells.length; i += 2) {
      processedData.push({
        code: parseInt(cells[i].textContent.trim()),
        message: cells[i + 1].textContent.trim(),
      });
    }

    // save
    const result =
      Object.keys(processedData[0])
        .map((key) => `"${key}"`)
        .join(";") +
      "\n" +
      processedData
        .map((item) =>
          Object.values(item)
            .map((val) => (typeof val === "string" ? `"${val}"` : val))
            .join(";")
        )
        .join("\n");
    fs.writeFile("codes.csv", result);
  });
});

request.end();
