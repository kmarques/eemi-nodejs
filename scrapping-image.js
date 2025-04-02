const URL =
  "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/sprites/895.png";

const https = require("node:https");
const fs = require("node:fs/promises");

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
    } else {
      parsedData = aggregatedData;
    }

    // processing
    const processedData = {
      mimeType: parsedData.includes("89504E470D0A1A0A", 0, "hex")
        ? "image/png"
        : "unknown",
      data: parsedData,
    };

    // save
    console.log(processedData.mimeType);
    fs.writeFile("./test.png", processedData.data);
  });
});

request.end();
