import React, {PureComponent} from "react";
import "./AminoAcidTextArea.css";

const INVALID_AMINO_ACID_CODE_REGEX = /[^ARNDCQEGHIMLKFPSTWYV*]/g;

class AminoAcidTextArea extends PureComponent {
  render(){
    let {aminoAcidSequence} = this.props;
    return (
      <textarea className="AminoAcidTextArea-textarea"
                value={aminoAcidSequence}
                onChange={this.handleChange}>
      </textarea>
    );
  }

  handleChange = (ev)=>{
    let {changeHandler} = this.props;
    let rawaminoAcidSequence = ev.target.value;
    let validaminoAcidSequence = this.toValidaminoAcidSequence(rawaminoAcidSequence);
    changeHandler(validaminoAcidSequence);
  };

  toValidaminoAcidSequence(rawaminoAcidSequence){
    return rawaminoAcidSequence.toUpperCase().replace(INVALID_AMINO_ACID_CODE_REGEX,'');
  }
}

export default AminoAcidTextArea;
