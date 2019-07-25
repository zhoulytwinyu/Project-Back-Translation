import React, {PureComponent} from "react";
import PropTypes from "prop-types";
// CSS
import 'bootstrap-css-only/css/bootstrap.min.css';

class NucleotideDisplayBox extends PureComponent {
  render(){
    let {sequence,GCContent} = this.props;
    return (
      <div className="card">
        <div>
          Sequence: {sequence}
        </div>
        <div>
          GC Content: {GCContent.toFixed(2)}
        </div>
      </div>
    );
  }
}

export default NucleotideDisplayBox;
