import React, { Component } from 'react';
import bitcoinImage from '../../../resources/images/bitcoin.png';
import slackImage from '../../../resources/images/slack.png';
import githubImage from '../../../resources/images/github.png';
import { traduction } from '../../lang/lang';

const shell = require('electron').shell;

const lang = traduction();

class About extends Component {
  openLink(link) {
    shell.openExternal(link);
  }

  render() {
    return (
      <div className={'row about'}>
        <div className="col-md-12">
          <p className="title">{lang.aboutTitle}</p>
          <div className="panel panel-default">
            <div className="panel-body text-center larger-text">
              <div className="col-md-12 col-lg-12 col-xs-12 " style={{ marginBottom: '25px' }}>
                Founded in 2014 by <a style={{ cursor: 'pointer' }} onClick={this.openLink.bind(this, 'https://www.cryptounited.io/')}>CryptoUnited</a>
              </div>
              <div className="col-md-4 col-lg-4 col-xs-4" style={{ cursor: 'pointer' }}>
                <a onClick={this.openLink.bind(this, 'https://bitcointalk.org/index.php?topic=1006830.0')} className="section">
                  <img src={bitcoinImage} style={{ width: '50%' }} alt="" />
                  <br />
                  <span className="sub">{lang.aboutAnnouncementThread}</span>
                </a>
              </div>
              <div className="col-md-4 col-lg-4 col-xs-4" style={{ cursor: 'pointer' }}>
                <a onClick={this.openLink.bind(this, 'https://join.slack.com/t/cryptounited-public/shared_invite/MjM3MjM5NjY1MTA2LTE1MDQ3MzA0NDYtNWE1NmE0OWNmYw')} className="section">
                  <img src={slackImage} alt="" style={{ width: '50%' }} className="slack" />
                  <br />
                  <span className="sub">{lang.aboutJoinUsOnSlack}</span>
                </a>
              </div>
              <div className="col-md-4 col-lg-4 col-xs-4">
                <img src={githubImage} style={{ width: '50%' }} alt="" />
                <div className="section">
                  <a style={{ cursor: 'pointer' }} onClick={this.openLink.bind(this, 'https://github.com/Greg-Griffith/ECCoin')}> {lang.aboutECCSouceCode} </a>
                  <br />
                  <a style={{ cursor: 'pointer' }} onClick={this.openLink.bind(this, 'https://github.com/Greg-Griffith/Electron-Ecc-gui')} > {lang.aboutWalletSourceCode} </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
