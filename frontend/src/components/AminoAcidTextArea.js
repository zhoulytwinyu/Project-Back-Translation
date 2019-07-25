import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import "./AminoAcidTextArea.css";

const VALID_AMINO_ACID_CODE = new Set("ARNDCQEGHIMLKFPSTWYV*");
const INVALID_AMINO_ACID_CODE_REGEX = /[^ARNDCQEGHIMLKFPSTWYV*]/g;

class AminoAcidTextArea extends PureComponent {
  render(){
    let {AminoAcidSequence} = this.props;
    return (
      <textarea className="AminoAcidTextArea-textarea"
                value={AminoAcidSequence}
                onChange={this.handleChange}>
      </textarea>
    );
  }

  handleChange = (ev)=>{
    let {changeHandler} = this.props;
    let rawAminoAcidSequence = ev.target.value;
    let validAminoAcidSequence = this.toValidAminoAcidSequence(rawAminoAcidSequence);
    changeHandler(validAminoAcidSequence);
  };

  toValidAminoAcidSequence(rawAminoAcidSequence){
    return rawAminoAcidSequence.toUpperCase().replace(INVALID_AMINO_ACID_CODE_REGEX,'');
  }
}

export default AminoAcidTextArea;
