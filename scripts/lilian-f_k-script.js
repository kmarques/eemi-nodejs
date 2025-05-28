const fs = require("node:fs/promises");
const process = require("node:process");
const path = require("node:path");

const tresholdDate = new Date();
tresholdDate.setMinutes(tresholdDate.getMinutes() - 6);
const BACKUP_DIR = "./to_delete";

function detectFiles() {
  return fs
    .readdir(process.cwd(), {
      recursive: true,
      withFileTypes: true,
    })
    .then((listing) => listing.filter((dirent) => dirent.isFile()))
    .then((files) =>
      Promise.all(
        files.map(async (fileEnt) => ({
          filepath: path.join(fileEnt.parentPath, fileEnt.name),
          stat: await fs.stat(path.join(fileEnt.parentPath, fileEnt.name)),
        }))
      )
    )
    .then((fstats) =>
      fstats.filter((fstat) => fstat.stat.mtime < tresholdDate)
    );
}

function createBackupFolder() {
  const REAL_BACKUP_DIR = path.resolve(BACKUP_DIR);
  return fs
    .access(REAL_BACKUP_DIR, fs.constants.W_OK | fs.constants.X_OK)
    .catch(() => fs.mkdir(REAL_BACKUP_DIR));
}

Promise.all([detectFiles(), createBackupFolder()])
  .then(([files]) =>
    Promise.all(
      files.map(async (file) => {
        await fs.copyFile(
          file.filepath,
          path.join(path.resolve(BACKUP_DIR), path.basename(file.filepath))
        );
        await fs.unlink(file.filepath);
      })
    )
  )
  .then(() => console.log("Old files backed up"));
