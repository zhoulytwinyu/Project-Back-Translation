import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import AminoAcidTextArea from "./components/AminoAcidTextArea";
import GCFilter from "./components/GCFilter";
import NucleotideDisplayBox from "./components/NucleotideDisplayBox";
// CSS
import 'bootstrap-css-only/css/bootstrap.min.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {AminoAcidInput: "",
                  AminoAcidObject: null,
                  NucleotideObjectList: null,
                  GCFilterMin: 0,
                  GCFilterMax: 1,
                  };
  }

  render (){
    let { AminoAcidInput,AminoAcidObject,
          NucleotideObjectList,
          GCFilterMin,GCFilterMax} = this.state;
    let NucleotideDisplay = null;
    if (AminoAcidObject !== null) {
      NucleotideDisplay = (
        <div className="row justify-content-between">
          <div className="col-sm-3 border p-3">
            <h2>Filters</h2>
            <GCFilter AminoAcidObject={AminoAcidObject}
                      GCFilterMin={GCFilterMin} GCFilterMax={GCFilterMax}
                      updateGCFilterMinHandler={this.handleGCFilterMinUpdate}
                      updateGCFilterMaxHandler={this.handleGCFilterMaxUpdate}
                      />
          </div>
          <div className="col-sm-9 border p-3">
            <button type="button" className="btn btn-primary btn-lg btn-block"
                    onClick={this.generateAndFetchBackTranslation}>
              Generate
            </button>
            {NucleotideObjectList.map( ({SEQUENCE,GC_CONTENT},i)=>{
              if (GCFilterMin<=GC_CONTENT && GC_CONTENT<=GCFilterMax){
                return (
                  <NucleotideDisplayBox key={i}
                                        sequence={SEQUENCE}
                                        GCContent={GC_CONTENT}
                                        />
                );
              }
              return null;
              })
              }
          </div>
        </div>
        );
      }
      
    return (
      <>
        <Header/>
        <div className="container" style={{height:"100%"}}>
          <div className="row border p-3">
            <div className="col-12">
              <h2>Amino Acid</h2>
              <AminoAcidTextArea  AminoAcidSequence={AminoAcidInput}
                                  changeHandler={this.handleAminoAcidInputChange}
                                  />
            </div>
            <div className="col-12">
              <button type="button" className="btn btn-primary btn-lg btn-block"
                      onClick={this.fetchAminoAcidObject}>
                Search
              </button>
            </div>
          </div>
          {NucleotideDisplay}
        </div>
        <Footer/>
      </>
    );
  }

  handleAminoAcidInputChange = (AminoAcidInput)=>{
    this.setState({AminoAcidInput});
  }

  handleGCFilterMinUpdate = (GCFilterMin)=>{
    this.setState({GCFilterMin});
  }

  handleGCFilterMaxUpdate = (GCFilterMax)=>{
    this.setState({GCFilterMax});
  }

  fetchAminoAcidObject = ()=>{
    let {AminoAcidInput} = this.state;
    new Promise((resolve,reject)=>{
      setTimeout( ()=>resolve({ AMINO_ACID:{SEQUENCE:"AAA",
                                            GC_MAX: 0.8,
                                            GC_MIN: 0.2,
                                            AA_ID: 0 
                                            },
                                NUCLEOTIDE_LIST:[{SEQUENCE: "ATTATTATT",
                                                  GC_CONTENT: 0.1,
                                                  NT_ID: 0
                                                  },
                                                 {SEQUENCE: "ATTATGATG",
                                                  GC_CONTENT: 0.8,
                                                  NT_ID: 1
                                                  }
                                                  ]
                                }),
                  1000);
      })
      .then( jsonObj=>{
        this.setState({ AminoAcidObject:jsonObj["AMINO_ACID"],
                        NucleotideObjectList:jsonObj["NUCLEOTIDE_LIST"],
                        }
                      );
      })
  }

  generateAndFetchBackTranslation = ()=>{
    let {AminoAcidInput} = this.state;
    new Promise((resolve,reject)=>{
      setTimeout( ()=>resolve({ 
                                NUCLEOTIDE_LIST:[{SEQUENCE: "ATTATTATT",
                                                  GC_CONTENT: 0.1,
                                                  NT_ID: 0
                                                  },
                                                 {SEQUENCE: "ATTATGATG",
                                                  GC_CONTENT: 0.8,
                                                  NT_ID: 1
                                                  },
                                                 {SEQUENCE: "ATTATCATC",
                                                  GC_CONTENT: 0.5,
                                                  NT_ID: 2
                                                  },
                                                 {SEQUENCE: "ATAATCATC",
                                                  GC_CONTENT: 0.45,
                                                  NT_ID: 3
                                                  }
                                                  ]
                                }),
                  1000);
      })
      .then( jsonObj=>{
        this.setState({ NucleotideObjectList:jsonObj["NUCLEOTIDE_LIST"]
                        }
                      );
      })
  }

  setState(obj) {
    if ("AminoAcidObject" in obj) {
      let {GCFilterMin,GCFilterMax} = this.state;
      obj["GCFilterMin"] = Math.max(GCFilterMin,obj["AminoAcidObject"]["GC_MIN"]);
      obj["GCFilterMax"] = Math.min(GCFilterMax,obj["AminoAcidObject"]["GC_MAX"]);
    }
    super.setState(obj);
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
