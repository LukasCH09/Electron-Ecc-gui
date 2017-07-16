import React, { Component } from 'react';
import $ from 'jquery';
import Sidebar from './Sidebar';
var event = require('../utils/eventhandler');
var log = require('../utils/log');

var lasttype = "hide";

event.on("show", function(message) {
  if(lasttype == "hide"){
    $('#snackMsg').text(message);
    $('.snack').css({bottom: "-10px"});
    lasttype = "show";
  }
});

event.on("hide", function(message) {
  if(lasttype == "show"){
    $('#snackMsg').text("");
    $('.snack').css({bottom: "-100px"});
    lasttype = "hide";
  }
});

event.on("animate", function(message) {
  lasttype = "animate";
  $('#snackMsg').text(message);
  
  $('.snack').stop().animate({
    bottom: "-10px"
  },500, function(){
    setTimeout(function() {
      $('.snack').stop().animate({
        bottom: "-100px"
      },500, function(){
        lasttype = "hide";
      });
    }, 3500);
  });
});

process.on('uncaughtException', function (error) {
    log.error(error.message);
});

export default class App extends Component {

  constructor(props){
    super(props);
  }
 
  render() {
    return (
      <div id="boot-override">
        <Sidebar route={this.props.route}></Sidebar>
        <div className="my_wrapper">
          {this.props.children}
        </div>
        <div className="snack">
          <p id="snackMsg"></p>
        </div>
      </div>
    );
  }
}


