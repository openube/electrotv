const cmp = require('electron-compile');
const path = require('path');

var appRoot = path.join(__dirname, '');
cmp.init(appRoot, require.resolve('./src/js/electron'));
