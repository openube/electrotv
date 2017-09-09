import React from 'react';
import SideBar from './sidebar';

export default () => (
  <div className="window">
    <div className="window-content">
      <div className="pane-group">
        <SideBar />
        <div className="pane padded-more">Search</div>
      </div>
    </div>
  </div>
);
