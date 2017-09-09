import React from 'react';

import { NavLink } from 'react-router-dom'

export default () => (
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
  </nav>
</div>
);
