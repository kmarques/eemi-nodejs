/**
 * Scrapper une page Web
 *      https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP
 *
 * V0 : récupérer les codes http + leur message sous la forme
 *  [ { code: 200, message: "OK" } ]
 * V1 : Sauvegarder dans un fichier CSV
 */

const URL =
  "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/sprites/895.png";

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
      //
    } else {
      parsedData = aggregatedData;
    }

    // processing
    /* insert here algo */

    // save
    /* insert here algo */
  });
});

request.end();
