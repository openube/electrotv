import React from 'react';
import SideBar from './sidebar';
import Feed from './feed';

export default () => (
  <div className="window">
    <div className="window-content">
      <div className="pane-group">
        <SideBar />
        <Feed />
      </div>
    </div>
  </div>
);
