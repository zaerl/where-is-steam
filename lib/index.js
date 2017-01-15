'use strict';

const fs = require('fs');
const registry = require('winreg');

function directoryExists(dir) {
  return new Promise((resolve, reject) => {
    fs.access(dir, fs.constants.R_OK, (err) => {
      err ? reject(err) : resolve(dir);
    });
  });
}

function readRegistry() {
  // We can't find Steam. Let's try with the registry
  let i;
  let prefix = '\\Software';

  let regKey = new registry({
    hive: registry.HKLM,
    key: prefix + '\\Valve\\Steam\\'
  });

  return new Promise((resolve, reject) => {
    regKey.values(function(err, items) {
      if(err) {
        reject(err);
      } else {
        for(i = 0; i < items.length; ++i) {
          if(items[i].name === 'InstallPath') {
            resolve(directoryExists(items[i].value));
          }
        }

        reject();
      }
    });
  });
}

function findSteamMacOS() {
  const dir = process.env.HOME + '/Library/Application Support/Steam';

  return directoryExists(dir);
}

function findSteamLinux() {
  // On linux Steam usually is installed on user's home directory
  const dir1 = process.env.HOME + '/Steam';
  const dir2 = process.env.HOME + '.local/share/Steam';

  return Promise.race([directoryExists(dir1), directoryExists(dir2)]);
}

function findSteamWin32() {
  let dir = process.env.ProgramFiles + '\\Steam';

  return directoryExists(dir).catch(() => {
    return readRegistry();
  });
}

function findSteam() {
  let finder;
  let config = '/config/config.vdf';
  let steamAppsDirectory;

  const win32 = process.platform === 'win32';

  if(process.platform === 'darwin') {
    // HFS+ can be case sensitive
    steamAppsDirectory = '/steamapps/common';
    finder = findSteamMacOS();
  } else if(process.platform === 'linux') {
    steamAppsDirectory = '/SteamApps/common';
    finder = findSteamLinux();
  } else if(win32) {
    steamAppsDirectory = '\\SteamApps\\common';
    finder = findSteamWin32();
  }

  return finder.then(dir => {
    let directories = [dir + steamAppsDirectory];

    try {
      // Scan the main config.vdf file. We search strings matching:
      // "BaseInstallFolder_([1-9]+)"\s+".+"
      // without performing fancy parse
      let file = fs.readFileSync(dir + config, 'utf-8');
      let i;

      if(file) {
        file = file.split('\n');
        let re = /"BaseInstallFolder_[1-9]+"\s+"([^"]+)"/;

        for(i = 0; i < file.length; ++i) {
          let match = re.exec(file[i]);

          if(match) {
            if(win32) match[1] = match[1].replace(/\\\\/g, '\\');

            directories.push(match[1] + steamAppsDirectory);
          }
        }
      }
    } catch(err) {

    }

    return directories;
  }).catch(() => {

  });
}

module.exports = findSteam;
