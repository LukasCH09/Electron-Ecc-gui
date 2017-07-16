import React, { Component } from 'react';
import {traduction} from '../../lang/lang';

const lang = traduction();

class SettingsDebug extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="row tab_wrapp">
        <div className="col-md-12 tab_body">
          <div className="panel panel-default">
            <div className="panel-body">
              <div className="row">

                <div className="col-md-12">
                  <p className="subtitle">ECCoin</p>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="desc">{lang.settingsDebugClientName}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="desc">...</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="desc">{lang.settingsDebugSslVersion}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="desc">...</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="desc">{lang.settingsDebugBuildDate}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="desc">...</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="desc">{lang.settingsDebugStartupTime}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="desc">...</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <p className="subtitle">{lang.network}</p>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="desc">{lang.settingsDebugNumberOfConnections}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="desc">...</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <p className="subtitle">{lang.settingsDebugBlockChain}</p>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="desc">{lang.settingsDebugCurrentNumberOfBlocks}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="desc">...</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="desc">{lang.settingsDebugEstimatedTotalBlocks}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="desc">...</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="desc">{lang.settingsDebugLastBlockTime}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="desc">...</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <p className="subtitle">{lang.settingsDebugLogFile}</p>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="btn_files_open">{lang.settingsDebugOpen}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <p className="subtitle">{lang.settingsDebugConfigurationFile}</p>
                  <div className="row">
                    <div className="col-md-4">
                      <p className="btn_files_open">{lang.settingsDebugOpen}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsDebug;
