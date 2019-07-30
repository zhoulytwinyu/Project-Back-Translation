import React, {PureComponent} from "react";
// CSS
import 'bootstrap-css-only/css/bootstrap.min.css';

class NucleotideDisplayBox extends PureComponent {
  render(){
    let {sequence,gcContent} = this.props;
    return (
      <div className="card">
        <div>
          Sequence: {sequence}
        </div>
        <div>
          GC Content: {gcContent.toFixed(2)}
        </div>
      </div>
    );
  }
}

export default NucleotideDisplayBox;
