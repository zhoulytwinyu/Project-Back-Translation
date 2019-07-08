import React, {PureComponent} from 'react';
import 'bootstrap-css-only/css/bootstrap.min.css';
import "./Header.css";

class Header extends PureComponent {
  render() {
    return (
      <div className="header">
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <h1>Amino Acids Back Translator</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
