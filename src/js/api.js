import req from 'request';
import { parseString } from 'xml2js';

export default { search };

// const API_KEY = process.env.THETVDB_API_KEY;

function search(q, cb) {
  const url = `http://thetvdb.com/api/GetSeries.php?seriesname=${q}`;

  get(url, (res) => {
    cb((res['Data']['Series'] || []).map(i => {
      return {
        id: i.id[0],
        name: i.SeriesName[0],
        banner: `http://thetvdb.com/banners/${i.banner[0]}` ,
        overview: (i.Overview || [])[0] || 'No Overview'
      };
    }));
  });
}

function get(url, cb) {
  req(url, (err, resp, body) => {
    if (err) throw `Error while req ${url}: ${err}`;
    if (resp.statusCode != 200) throw `Error while req ${url}: code — ${resp.statusCode}`;

    parseString(body, (err, res) => {
      if (err) throw `Error parsing response from ${url}: ${err}`;
      cb(res);
    });
  });
}
