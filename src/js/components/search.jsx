import React from 'react';
import _ from 'lodash';

import api from '../api';
import SideBar from './sidebar';
import Spinner from './spinner';
import Show from './show';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const Search = React.createClass({

  getInitialState () {
    return {
      loading: false,
      results: []
    };
  },

  changed({ target: { value } }) {
    loadDb(this, value);
  },

  render() {
    return (
      <div className="window">
        <div className="window-content">
          <div className="pane-group">
            <SideBar />
            <div className="pane padded-more">
              <form>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Lookup a Show"
                    autoFocus
                    onChange={this.changed}></input>
                </div>
              </form>
              <section className='results'>
                {this.state.loading ? <Spinner /> : renderResults(this, this.state.results) }
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

function renderResults(vm, res) {
  return (
    <ReactCSSTransitionGroup
      transitionName="fade"
      transitionAppear={true}
      transitionAppearTimeout={300}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}>
      { res.map(i => ( <Show show={i} key={i.id} /> )) }
    </ReactCSSTransitionGroup>
  );
}

const loadDb = _.debounce((vm, q) => load(vm, q), 500);

function load(vm, q) {
  vm.setState({ loading: true, results: [] });
  api.search(q, (res = []) => {
    vm.setState({ loading: false, results: res });
  });
}

export default Search;
