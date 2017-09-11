import React from 'react';

import { NavLink } from 'react-router-dom';
import store from '../store.js';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      shows: []
    };
  }

  render() {
    return (
      <div className="pane-sm sidebar">
        <nav className="nav-group">
          <h5 className="nav-group-title">Menu</h5>
          <NavLink to='/' className='nav-group-item' exact>
            <span className="icon icon-home"></span>
            Home
          </NavLink>
          <NavLink to='/search' className='nav-group-item' exact>
            <span className="icon icon-search"></span>
            Search
          </NavLink>
          <h5 className="nav-group-title">My Shows</h5>
          { this.state.shows.map(renderShow) }
        </nav>
      </div>
    );
  }

  componentDidMount() {
    store.readAll((err, shows) => {
      this.setState(Object.assign(this.state, {
        shows: shows.map(show => {
          const s = show.Data.Series[0];
          return { id: s.id[0], name: s.SeriesName[0] };
        })
      }));
    });
  }
}

function renderShow({ id, name }) {
  return (
    <NavLink to={`/show/${id}`} key={ id } className='nav-group-item' exact>
      { name }
    </NavLink>
  );
}
