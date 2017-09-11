import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import Spinner from './spinner';
import store from '../store';

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
    store.readAll((err, shows) => {
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
      title: 'Released Last Week',
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
  return withinPeriod(eps, moment().add(-2, 'week'), moment());
}

function thisMonth(eps) {
  return withinPeriod(eps, moment(), moment().endOf('month'));
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
