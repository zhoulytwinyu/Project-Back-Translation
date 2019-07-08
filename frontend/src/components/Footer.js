import React, {PureComponent} from 'react';
import 'bootstrap-css-only/css/bootstrap.min.css';
import "./Footer.css";

class Footer extends PureComponent {
  render() {
    return (
      <div className="footer">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-auto">
              <p>&copy; 2019 Lingyu Zhou</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
}

export default Footer;
