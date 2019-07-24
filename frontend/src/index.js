import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackTranslator from "./components/BackTranslator";
import AminoAcidTextArea from "./components/AminoAcidTextArea";
// API
import {fetchAminoAcidInfoFromAPI} from "./api";
// CSS
import 'bootstrap-css-only/css/bootstrap.min.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {AASeqInput: "",
                  AASeqInfo: null,
                  NTSeqInfo: null,
                  GCThresholdMin: 0,
                  GCThresholdMax: 1,
                  };
  }

  render (){
    console.log("app render");
    let { AASeqInput,AASeqInfo,
          NTSeqInfo,
          GCThresholdMin,GCThresholdMax} = this.state;
    return (
      <>
        <Header/>
        <div className="container" style={{height:"100%"}}>
          <div className="row border p-3">
            <div className="col-12">
              <fieldset>
                <legend>Amino Acid</legend>
                <AminoAcidTextArea  AASeqInput={AASeqInput} AASeqInfo={AASeqInfo}
                                    updateAminoAcidSequenceHandler={(AASeq)=>this.setState({AASeqInput:AASeq})}
                                    />
              </fieldset>
            </div>
            <div className="col-12">
              <button type="button" className="btn btn-primary btn-lg btn-block"
                      onClick={this.fetchAminoAcidInfo}>
                Search
              </button>
            </div>
          </div>
          <div className="row justify-content-between">
            <div className="col-sm-3 border p-3">
              <fieldset>
                <legend>Filters</legend>
                GC Threshold Min: {GCThresholdMin}
                <input  className="d-block w-100"
                        type="range" min={0} max={1} step={0.01}
                        value={GCThresholdMin}
                        onChange={ ev=>this.setState({GCThresholdMin:Number.parseFloat(ev.target.value)}) }
                        />
                GC Threshold Max: {GCThresholdMax}
                <input  className="d-block w-100"
                        type="range" min={0} max={1} step={0.01}
                        value={GCThresholdMax}
                        onChange={ ev=>this.setState({GCThresholdMax:Number.parseFloat(ev.target.value)}) }
                        />
              </fieldset>
            </div>
            <div className="col-sm-9 border p-3">
              <button type="button" className="btn btn-primary btn-lg btn-block"
                      onClick={this.fetchAminoAcidInfo}>
                Generate
              </button>
              <div className="card">
                <div>
                  Sequence: ATGACCACGTAGTCAGTTAGTCCACAGT
                </div>
                <div>
                  GC Content: 0.42
                </div>
              </div>
              <div className="card">
                <div>
                  Sequence: ATGACCACGTAGTCAGTTAGTCCACAGT
                </div>
                <div>
                  GC Content: 0.42
                </div>
              </div>
              <div className="card">
                <div>
                  Sequence: ATGACCACGTAGTCAGTTAGTCCACAGT
                </div>
                <div>
                  GC Content: 0.42
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  

  fetchAminoAcidInfo = ()=>{
    console.log('123');
    let {AASeqInput} = this.state;
    fetchAminoAcidInfoFromAPI(AASeqInput)
      .then( jsonObj=>{
        this.setState({ AASeqInfo:jsonObj["AMINO_ACID_SEQUENCE_INFO"],
                        NTSeqInfo:jsonObj["NUCLEOTIDE_SEQUENCES"]
                        }
                      );
      })
  }

  generateAndFetchBackTranslation = ()=>{
    console.log('123');
    let {AASeqInput} = this.state;
    fetchAminoAcidInfoFromAPI(AASeqInput)
      .then( jsonObj=>{
        this.setState({ AASeqInfo:jsonObj["AMINO_ACID_SEQUENCE_INFO"],
                        NTSeqInfo:jsonObj["NUCLEOTIDE_SEQUENCES"]
                        }
                      );
      })
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
