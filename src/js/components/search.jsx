import React from 'react';
import SideBar from './sidebar';
import _ from 'lodash';

import api from '../api';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      loading: false
    };

    this.changed = this.changed.bind(this);
  }

  changed({ target: { value } }) {
    loadDb(this, value);
  }

  render() {
    return (
      <div className="window">
        <div className="window-content">
          <div className="pane-group">
            <SideBar />
            <div className="pane padded-more">
              <form>
                <div className="form-group">
                  <input type="email" className="form-control" placeholder="Lookup a Show" autoFocus onChange={this.changed}></input>
                </div>
              </form>
              <section className='results'>
                {this.state.loading ? spinner() : renderResults(this.state.results) }
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function renderResults(res) {
  const items = res.map(i => (
    <div className="item" key={i.id}>
      <img src={i.banner} />
      <h3>{ i.name }</h3>
      <p> { i.overview } </p>
    </div>
  ));

  return (
    <ReactCSSTransitionGroup
      transitionName="fade"
      transitionAppear={true}
      transitionAppearTimeout={300}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}>
      { items }
    </ReactCSSTransitionGroup>
  );
}

function spinner() {
  return (
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  );
}

const loadDb = _.debounce((vm, q) => load(vm, q), 500);

function load(vm, q) {
  vm.setState({ loading: true, results: [] });
  api.search(q, (res = []) => {
    vm.setState({ loading: false, results: res });
  });
}
