import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ShowAndHideDiv from "./components/ShowAndHideDiv";
import AminoAcidTextArea from "./components/AminoAcidTextArea";
import GCFilter from "./components/GCFilter";
import NucleotideDisplayBox from "./components/NucleotideDisplayBox";
// CSS
import 'bootstrap-css-only/css/bootstrap.min.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {aminoAcidInput: "",
                  aminoAcid: null,
                  nucleotideList: [],
                  gcFilterMin: 0,
                  gcFilterMax: 1,
                  };
  }

  render (){
    let { aminoAcidInput,
          aminoAcid,nucleotideList,
          gcFilterMin,gcFilterMax} = this.state;
    return (
      <>
        <Header/>
        <div className="container" style={{height:"100%"}}>
          <div className="row border p-3">
            <div className="col-12">
              <h2>Amino Acid</h2>
              <AminoAcidTextArea  aminoAcidSequence={aminoAcidInput}
                                  changeHandler={this.handleAminoAcidInputChange}
                                  />
            </div>
            <div className="col-12">
              <button type="button" className="btn btn-primary btn-lg btn-block"
                      disabled={aminoAcidInput===""}
                      onClick={this.fetchAminoAcid}>
                Search
              </button>
            </div>
          </div>
          <ShowAndHideDiv show={aminoAcid!==null &&
                                aminoAcid["SEQUENCE"]===aminoAcidInput
                                }>
            <div className="row justify-content-between">
              <div className="col-sm-3 border p-3">
                <h2>Filters</h2>
                <GCFilter gcMin={aminoAcid?aminoAcid["GC_MIN"]:null}
                          gcMax={aminoAcid?aminoAcid["GC_MAX"]:null}
                          gcFilterMin={gcFilterMin}
                          gcFilterMax={gcFilterMax}
                          updateGCFilterMinHandler={this.handleGCFilterMinUpdate}
                          updateGCFilterMaxHandler={this.handleGCFilterMaxUpdate}
                          />
              </div>
              <div className="col-sm-9 border p-3" style={{maxHeight:600}}>
                <button type="button" className="btn btn-primary btn-lg btn-block"
                        onClick={this.fetchBackTranslation}>
                  Generate
                </button>
                {nucleotideList.map( ({SEQUENCE,GC_CONTENT},i)=>{
                    if (gcFilterMin<=GC_CONTENT && GC_CONTENT<=gcFilterMax){
                      return (
                        <NucleotideDisplayBox key={i}
                                              sequence={SEQUENCE}
                                              gcContent={GC_CONTENT}
                                              />
                      );
                    }
                    return null;
                  })
                }
              </div>
            </div>
          </ShowAndHideDiv>
        </div>
        <Footer/>
      </>
    );
  }

  handleAminoAcidInputChange = (aminoAcidInput)=>{
    this.setState({aminoAcidInput});
  }

  handleGCFilterMinUpdate = (gcFilterMin)=>{
    this.setState({gcFilterMin});
  }

  handleGCFilterMaxUpdate = (gcFilterMax)=>{
    this.setState({gcFilterMax});
  }

  fetchAminoAcid = ()=>{
    let {aminoAcidInput} = this.state;
    fetch("/api/aminoacid",
          { method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"AMINO_ACID_SEQUENCE":aminoAcidInput})
          }
      )
      .then( resp=>resp.json() )
      .then( obj=>{
        let {AMINO_ACID, NUCLEOTIDE_LIST} = obj;
        let nucleotideList = NUCLEOTIDE_LIST;
        let aminoAcid = AMINO_ACID;
        this.setState({ aminoAcid,
                        nucleotideList
                        });
      })
  }

  fetchBackTranslation = ()=>{
    let {aminoAcid,gcFilterMin,gcFilterMax} = this.state;
    let sequence = aminoAcid["SEQUENCE"];
    fetch("/api/backtranslate",
          { method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"AMINO_ACID_SEQUENCE":sequence,
                                  "GC_FILTER_MIN":gcFilterMin,
                                  "GC_FILTER_MAX":gcFilterMax
                                  })
          }
      )
      .then( resp=>resp.json() )
      .then( obj=>{
        let nucleotideList = obj["NUCLEOTIDE_LIST"];
        this.setState({ nucleotideList
                        }
                      );
      })
  }

  setState(obj) {
    if ("aminoAcid" in obj) {
      let {gcFilterMin,gcFilterMax} = this.state;
      obj["gcFilterMin"] = Math.max(gcFilterMin,obj["aminoAcid"]["GC_MIN"]);
      obj["gcFilterMax"] = Math.min(gcFilterMax,obj["aminoAcid"]["GC_MAX"]);
    }
    super.setState(obj);
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
