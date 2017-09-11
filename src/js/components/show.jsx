import React from 'react';

import api from '../api';


export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
      loading: false
    };
  }

  render() {
    const i = this.state.show;
    const ovw = i.overview.length > 128 ? i.overview.substring(0, 128) + "..." : i.overview;
    return (
      <div className="series card">
        <img src={i.banner} />
        <h3>{ i.name }</h3>
        <p> { ovw } </p>
        <div className='action'>
          <button
            className={ cl(this.state.downloading) }
            disabled={this.state.downloading}
            onClick={e => follow(this, i)}>
            <span className="icon icon-star"></span> FOLLOW
          </button>
        </div>
      </div>
    );
  }
}

function cl(downloading) {
  const out = ['btn', 'btn-large', 'btn-primary'];
  downloading && out.push('downloading');
  return out.join(' ');
}

function follow(vm, i) {
  vm.setState({ downloading: true, show: i });
  api.add(i.id, () => {
    vm.setState({ downloading: false, show: i });
  });
}
