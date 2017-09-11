import fs from 'fs';
import async from 'async';
import path from 'path';
import xml2js from 'xml2js';

export default {
  isFollowed,
  readAll
};

const BASE = `${process.env['HOME']}/.eltv`;
const BASE_STORE = `${BASE}/store`;

function isFollowed(id) {
  return fs.existsSync(`${BASE_STORE}/${id}`);
}

function readAll(cb) {
  if (!fs.existsSync(BASE_STORE)) {
    throw 'BASE_STORE directory doesn not exist';
  }

  return async.map(available(), readSeries, cb);
}

function available() {
  return fs
    .readdirSync(BASE_STORE)
    .filter(f => fs.statSync(path.join(BASE_STORE, f)).isDirectory());
}

function readSeries(id, cb) {
  const xml_file = `${BASE_STORE}/${id}/en.xml`;
  if (!fs.existsSync(xml_file)) throw "Could not find the show in the local store";
  const str = fs.readFileSync(xml_file);
  const parser = new xml2js.Parser();
  parser.parseString(str, function(err, result) {
    if (err) throw err;
    return cb('', result);
  });
}
