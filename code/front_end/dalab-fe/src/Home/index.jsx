import React from 'react';
import { enquireScreen } from 'enquire-js';
import Banner from './Banner';
import './static/style';

let isMobile;

enquireScreen((b) => {
  isMobile = b;
});

class Home extends React.PureComponent {
  state = {
    isMobile,
  }
  componentDidMount() {
    enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      });
    });
  }
  render() {
    return (
      <div className="home-wrapper">
        <Banner isMobile={this.state.isMobile || false} />
      </div>
    );
  }
}

export default Home;
