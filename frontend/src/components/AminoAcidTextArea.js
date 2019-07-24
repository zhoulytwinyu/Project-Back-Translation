import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import "./AminoAcidTextArea.css";

const VALID_AMINO_ACID_CODE = new Set("ARNDCQEGHIMLKFPSTWYV*");
const INVALID_AMINO_ACID_CODE_REGEX = /[^ARNDCQEGHIMLKFPSTWYV*]/g;

class AminoAcidTextArea extends PureComponent {
  render(){
    let {AASeqInput,AASeqInfo} = this.props;
    return (
      <textarea className="AminoAcidTextArea-textarea"
                value={AASeqInput}
                onChange={this.handleUpdateAminoAcidSequence}>
      </textarea>
    );
  }

  handleUpdateAminoAcidSequence = (ev)=>{
    let {updateAminoAcidSequenceHandler} = this.props;
    let rawAminoAcidSequence = ev.target.value;
    let validAminoAcidSequence = this.toValidAminoAcidSequence(rawAminoAcidSequence);
    updateAminoAcidSequenceHandler(validAminoAcidSequence);
  };

  toValidAminoAcidSequence(rawAminoAcidSequence){
    return rawAminoAcidSequence.toUpperCase().replace(INVALID_AMINO_ACID_CODE_REGEX,'');
  }
}

export default AminoAcidTextArea;
