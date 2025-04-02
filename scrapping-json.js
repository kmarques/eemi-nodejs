const URL = "https://mhw-db.com/monsters";

const https = require("node:https");

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
    }

    // processing
    const processedData = parsedData.map((item) => ({
      id: item.id,
      name: item.name,
      weakness_elements: item.weaknesses
        .map((weakness) => weakness.element)
        .join(", "),
    }));

    // save
    console.log(processedData);
  });
});

request.end();
