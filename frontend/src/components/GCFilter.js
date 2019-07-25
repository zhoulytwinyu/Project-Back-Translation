import React, {PureComponent} from "react";
import PropTypes from "prop-types";
// CSS
import 'bootstrap-css-only/css/bootstrap.min.css';

class GCFilter extends PureComponent {
  render(){
    let {AminoAcidObject,GCFilterMin,GCFilterMax} = this.props;
    return (
      <>
        GC Filter Min: {GCFilterMin}
        <input  className="d-block w-100"
                type="range" min={AminoAcidObject["GC_MIN"]} max={AminoAcidObject["GC_MAX"]} step={0.01}
                value={GCFilterMin}
                onChange={ this.handleGCFilterMinUpdate }
                />
        GC Filter Max: {GCFilterMax}
        <input  className="d-block w-100"
                type="range" min={AminoAcidObject["GC_MIN"]} max={AminoAcidObject["GC_MAX"]} step={0.01}
                value={GCFilterMax}
                onChange={ this.handleGCFilterMaxUpdate }
                />
      </>
    );
  }
  
  handleGCFilterMinUpdate = (ev)=>{
    let {updateGCFilterMinHandler} = this.props;
    updateGCFilterMinHandler(Number.parseFloat(ev.target.value))
  }
  
  handleGCFilterMaxUpdate = (ev)=>{
    let {updateGCFilterMaxHandler} = this.props;
    updateGCFilterMaxHandler(Number.parseFloat(ev.target.value))
  }
}

export default GCFilter;
