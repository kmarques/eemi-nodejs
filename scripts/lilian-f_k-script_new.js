const fs = require("node:fs/promises");
const process = require("node:process");
const path = require("node:path");

(async function () {
  const listing = await fs.readdir(process.cwd(), {
    recursive: true,
    withFileTypes: true,
  });
  const files = listing.filter((dirent) => dirent.isFile());
  const fstats = await Promise.all(
    files.map(async (fileEnt) => ({
      filepath: path.join(fileEnt.parentPath, fileEnt.name),
      stat: await fs.stat(path.join(fileEnt.parentPath, fileEnt.name)),
    }))
  );
  console.log(fstats);
})();
