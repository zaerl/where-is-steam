# Where is steam

**where-is-steam** is a simple module that helps you finding your Steam's games
installation directories. It supports macOS/Linux/Windows.

## Install

Install through npm

    npm install where-is-steam

## Usage

Require the module

    var whereIsSteam = require('where-is-steam');

Get a list of your games installation directories. There can be more than one.
**where-is-steam** return a promise that resolve in a list of directories.

    var directory = whereIsSteam().then((dir) => {
      // Do whatever you want with 'dir'
    });

Example output on macOS:

    [
      '/Users/your-user/Library/Application Support/Steam/steamapps/common',
      '/Users/your-user/a-directory/steamapps/common'
    ]

Example output on windows:

    [
      'C:\\Program Files\\Steam\\steamapps\\common',
      'C:\\a-directory\\steamapps\\common'
    ]

Example output on linux:

    [
      '~/Steam/SteamApps/common',
      '~/a-directory/SteamApps/common'
    ]

## License

MIT
