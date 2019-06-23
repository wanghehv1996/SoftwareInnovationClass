import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import DocumentTitle from 'react-document-title';
import { enquireScreen } from 'enquire-js';
import Header from './Home/Header';
import Footer from './Home/Footer';
import Home from './Home';
import About from "./About";
import People from './People';

import {
  Nav00DataSource,
} from './Home/data.source.js';

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile,
    };
  }
  componentDidMount() {
    // 适配手机屏幕;
    enquireScreen((b) => {
      this.setState({ isMobile: !!b });
    });
  }
  render() {
    return (
      <DocumentTitle title = "Digital Art Laboratory">
        <Router>
          <div>
            <Header dataSource={Nav00DataSource} isMobile={this.isMobile} />
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/people" component={People} />
            <Footer isMobile={this.isMobile} />
          </div>
        </Router>
      </DocumentTitle>
    );
  }
}

export default App;