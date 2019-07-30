import React, {PureComponent} from 'react';
import 'bootstrap-css-only/css/bootstrap.min.css';

class ShowAndHideDiv extends PureComponent {
  render() {
    let {show,children} = this.props;
    if (show) {
      return (
        <div>
          {children}
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export default ShowAndHideDiv;
