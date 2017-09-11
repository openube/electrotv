import React from 'react';
import fs from 'fs';
import async from 'async';
import path from 'path';
import xml2js from 'xml2js';
import moment from 'moment';
import _ from 'lodash';
import Spinner from './spinner';

const BASE = `${process.env['HOME']}/.eltv`;
const BASE_STORE = `${BASE}/store`;

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      groups: []
    };

    this.renderFeed = this.renderFeed.bind(this);
  }

  renderFeed() {
    return (this.state.groups || []).map(renderGroup);
  }

  render() {
    return (
      <div className="pane padded-more">
        <h1>Today is <span className="firm">{ moment().format("DD of MMMM") }</span>, { moment().format("dddd") }</h1>
        { this.state.loading ? <Spinner /> : this.renderFeed() }
      </div>
    );
  }

  componentDidMount() {
    this.setState({ loading: true, groups: [] });
    readAll((err, shows) => {
      shows.forEach(s => {
        const title = s['Data']['Series'][0]['SeriesName'][0];
        s['Data']['Episode'].forEach(e => {
          e.show = title;
        });
      });
      const eps = _.flatten(shows.map(s => s['Data']['Episode']));
      this.setState({ loading: false, groups: group(eps) });
    });
  }
}

function group(eps) {
  return [
    {
      title: 'Available To Watch',
      episodes: ready(eps)
    },
    {
      title: 'Coming Up Later This Month',
      episodes: thisMonth(eps)
    },
    {
      title: 'Next Month',
      episodes: nextMonth(eps)
    }
  ];
}

function renderGroup({ title, episodes }) {
  return (
    <section key={ title }>
      <h3> { title } </h3>
      <div className='episodes'>
        { episodes.map(renderEpisode) }
      </div>
    </section>
  );
}

function renderEpisode(ep) {
  const id = ep['id'][0];
  const name = ep.EpisodeName[0];
  const code = `S${ep['SeasonNumber'][0]}E${ep['EpisodeNumber'][0]}`;
  const ovw = ep['Overview'][0] || 'No overview / TBA';

  let banner = ep['filename'][0];
  if (banner) {
    banner = `http://thetvdb.com/banners/${banner}`;
  }

  return (
    <div className='card item' key={id}>
      <h3 className='show'>{ ep.show }</h3>
      { banner ? <img src={banner} /> : '' }
      <h3><span className='firm'>{ code }</span> { name }</h3>
      <p>{ ovw }</p>
    </div>
  );
}

function ready(eps) {
  const start = moment().add(-1, 'M').startOf('month');
  const end = moment().add(-1, 'M').endOf('month');
  return withinPeriod(eps, start, end);
}

function thisMonth(eps) {
  const start = moment().startOf('month');
  const end = moment().endOf('month');
  return withinPeriod(eps, start, end);
}

function nextMonth(eps) {
  const start = moment().add(1, 'M').startOf('month');
  const end = moment().add(1, 'M').endOf('month');
  return withinPeriod(eps, start, end);
}

function withinPeriod(eps, start, end) {
  return eps.filter(e => {
    const d = moment(e['FirstAired'][0]);
    return d.isSameOrAfter(start) && d.isBefore(end);
  });
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
