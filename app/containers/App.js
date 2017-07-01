// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import Menu from './Menu';



export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div id="boot-override">
        <Menu></Menu>
        <div className="container">
          {this.props.children}
        </div>

      </div>
    );
  }
}
