import React, {PureComponent} from "react";
// CSS
import 'bootstrap-css-only/css/bootstrap.min.css';

class GCFilter extends PureComponent {
  render(){
    let {gcMax,gcMin,gcFilterMin,gcFilterMax} = this.props;
    gcMax = Math.ceil(gcMax*100)/100
    gcMin = Math.floor(gcMin*100)/100
    gcFilterMin = Math.ceil(gcFilterMin*100)/100
    gcFilterMax = Math.floor(gcFilterMax*100)/100
    return (
      <>
        GC Filter Min: {gcFilterMin}
        <input  className="d-block w-100"
                type="range" min={gcMin} max={gcFilterMax} step={0.01}
                value={gcFilterMin}
                onChange={ this.handleGCFilterMinUpdate }
                />
        GC Filter Max: {gcFilterMax}
        <input  className="d-block w-100"
                type="range" min={gcFilterMin} max={gcMax} step={0.01}
                value={gcFilterMax}
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
