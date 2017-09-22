import React, { Component } from 'react';
import $ from 'jquery';
import Sidebar from './Sidebar';

const event = require('../utils/eventhandler');

let lasttype = 'hide';

event.on('show', (message) => {
  if (lasttype === 'hide') {
    $('#snackMsg').text(message);
    $('.snack').css({ bottom: '-10px' });
    lasttype = 'show';
  }
});

event.on('hide', () => {
  if (lasttype === 'show') {
    $('#snackMsg').text('');
    $('.snack').css({ bottom: '-100px' });
    lasttype = 'hide';
  }
});

event.on('animate', (message) => {
  lasttype = 'animate';
  $('#snackMsg').text(message);

  $('.snack').stop().animate({
    bottom: '-10px'
  }, 500, () => {
    setTimeout(() => {
      $('.snack').stop().animate({
        bottom: '-100px'
      }, 500, () => {
        lasttype = 'hide';
      });
    }, 3500);
  });
});

// process.on('uncaughtException', function (error) => {
//     console.log(error.message);
// });

export default class App extends Component<Props> {
  render() {
    return (
      <div id="boot-override">
        <Sidebar route={this.props.route} />
        <div className="my_wrapper">
          {this.props.children}
        </div>
        <div className="snack">
          <p id="snackMsg" />
        </div>
      </div>
    );
  }
}

