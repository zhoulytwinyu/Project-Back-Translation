import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import "./BackTranslator.css";
import {fetchBackTranslate} from "../api";

class BackTranslator extends Component {
  constructor(props){
    super(props);
    this.state={aminoAcidSequence:"",
                GCLowerThreshold:0.0,
                GCUpperThreshold:1.0,
                codonSequence: []
                };
  }
  
  render() {
    let {aminoAcidSequence,GCLowerThreshold,GCUpperThreshold,codonSequence} = this.state;
    return (
      <>
        <div className="back-translator">
          <div className="container">
            <div className="d-flex justify-content-around">
              <div className="col-5">
                <h2>Amino Acid Sequence</h2>
                <textarea value={aminoAcidSequence} onChange={this.handleAminoAcidSequenceChange} />
                <div>
                  <div >
                    GC lower bound:
                    <input  type="number" step={0.01} value={GCLowerThreshold}
                            onChange={this.handleGCLowerThresholdChange}/>
                  </div>
                  <div>
                    GC upper bound:
                    <input  type="number" step={0.01} value={GCUpperThreshold}
                            onChange={this.handleGCUpperThresholdChange}/>
                  </div>
                </div>
              </div>
              <div className="col-5">
                <h2>Nucleotide Sequence</h2>
                <div className="back-translator-output">
                  {this.displayCodonSequence(codonSequence)}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end p-3">
              <button onClick={this.handleAminoAcidSequenceSubmission}>Submit</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  handleAminoAcidSequenceChange = (ev)=>{
    this.setState({aminoAcidSequence:ev.target.value});
  }

  handleGCLowerThresholdChange = (ev)=>{
    let {GCUpperThreshold} = this.state;
    let GCLowerThreshold = Number.parseFloat(ev.target.value)
    GCLowerThreshold = Math.min(Math.max(GCLowerThreshold,0),1)
    let newGCLowerThreshold = Math.min(GCLowerThreshold,GCUpperThreshold);
    let newGCUpperThreshold = Math.max(GCLowerThreshold,GCUpperThreshold);
    this.setState({GCLowerThreshold:newGCLowerThreshold,GCUpperThreshold:newGCUpperThreshold})
  }

  handleGCUpperThresholdChange = (ev)=>{
    let {GCLowerThreshold} = this.state;
    let GCUpperThreshold = Number.parseFloat(ev.target.value)
    GCUpperThreshold = Math.min(Math.max(GCUpperThreshold,0),1)
    let newGCLowerThreshold = Math.min(GCLowerThreshold,GCUpperThreshold);
    let newGCUpperThreshold = Math.max(GCLowerThreshold,GCUpperThreshold);
    this.setState({GCLowerThreshold:newGCLowerThreshold,GCUpperThreshold:newGCUpperThreshold})
  }

  handleAminoAcidSequenceSubmission = ()=>{
    let {aminoAcidSequence,GCLowerThreshold,GCUpperThreshold} = this.state;
    console.log(aminoAcidSequence)
    fetchBackTranslate(aminoAcidSequence,GCLowerThreshold,GCUpperThreshold)
      .then( ({CODON_SEQUENCE})=>this.setState({codonSequence:CODON_SEQUENCE}) );
  }

  displayCodonSequence(codonSequence) {
    return codonSequence.join(' ');
  }
}

export default BackTranslator;
