import React, { Component } from 'react';
import bitcoinImage from '../../media/bitcoin.png';
import slackImage from '../../media/slack.png';
import githubImage from '../../media/github.png';

// import styles from './About.css';
let larger_text = {
  fontSize: '120%'
}

class About extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div>

        <div className="col-md-12">
          <h1>About</h1>
          <div className="panel panel-default" style={larger_text}>
            <div className="panel-body text-center larger-text">
              <div className="col-md-12 col-lg-12 col-xs-12 ">
                Founded in 2014 by <a href="https://www.cryptounited.io/">CryptoUnited</a>
              </div>
              <div className="col-md-4 col-lg-4 col-xs-4">
                <a href="https://bitcointalk.org/index.php?topic=1006830.0" className="section">
                  <img src={bitcoinImage} style={{ width: '100%' }} alt="" />
                  <br />
                  <span className="sub">Announcement Thread</span>
                </a>
              </div>
              <div className="col-md-4 col-lg-4 col-xs-4">
                <a href="https://join.slack.com/cryptounited-public/shared_invite/MTk2ODEyMTUxODQ2LTE0OTcyMDg2NTQtNmJjNmZjZGFjMw" class="section">
                  <img src={slackImage} alt="" style={{ width: '100%' }} className="slack" />
                  <br />
                  <span className="sub">Join us on slack!</span>
                </a>
              </div>
              <div className="col-md-4 col-lg-4 col-xs-4">
                <img src={githubImage} style={{ width: '100%' }} alt="" />
                <div className="section">
                  <a href="https://github.com/Greg-Griffith/ECCoin"> ECCoin Source Code </a>
                  <br/>
                  <a href=" https://github.com/Greg-Griffith/Electron-Ecc-gui"> Wallet Source Code </a>
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
