(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(e,t,a){},16:function(e,t,a){},17:function(e,t,a){},18:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(6),c=a.n(l),o=a(1),i=a(2),s=a(4),u=a(3),h=a(5),m=(a(8),a(15),function(e){function t(){return Object(o.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"header"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-auto"},r.a.createElement("h1",null,"Amino Acids Back Translator")))))}}]),t}(n.PureComponent)),d=(a(16),function(e){function t(){return Object(o.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"footer"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row justify-content-center"},r.a.createElement("div",{className:"col-auto"},r.a.createElement("p",null,"\xa9 2019 Lingyu Zhou")))))}}]),t}(n.PureComponent));a(17);var p=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).handleGCLowerThresholdChange=function(e){var t=a.state.GCUpperThreshold,n=Number.parseFloat(e.target.value);n=Math.min(Math.max(n,0),1);var r=Math.min(n,t),l=Math.max(n,t);a.setState({GCLowerThreshold:r,GCUpperThreshold:l})},a.handleGCUpperThresholdChange=function(e){var t=a.state.GCLowerThreshold,n=Number.parseFloat(e.target.value);n=Math.min(Math.max(n,0),1);var r=Math.min(t,n),l=Math.max(t,n);a.setState({GCLowerThreshold:r,GCUpperThreshold:l})},a.handleAminoAcidSequenceSubmission=function(){var e,t,n,r=a.state,l=r.aminoAcidSequence,c=r.GCLowerThreshold,o=r.GCUpperThreshold;(e=l,t=c,n=o,void fetch("/api/backtranslate",{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({SEQUENCE:e,GC_LOWER_BOUND:t,GC_UPPER_BOUND:n})}).then(function(e){return e.json()})).then(function(e){return a.setState({codonSequence:e})})},a.state={aminoAcidSequence:"",GCLowerThreshold:0,GCUpperThreshold:1,codonSequence:null},a}return Object(h.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this.state,t=e.aminoAcidSequence,a=e.GCLowerThreshold,n=e.GCUpperThreshold,l=e.NTSeq;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"back-translator"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"d-flex justify-content-around"},r.a.createElement("div",{className:"col-5"},r.a.createElement("h2",null,"Amino Acid Sequence"),r.a.createElement("textarea",null,t),r.a.createElement("div",null,r.a.createElement("div",null,"GC lower bound:",r.a.createElement("input",{type:"number",step:.01,value:a,onChange:this.handleGCLowerThresholdChange})),r.a.createElement("div",null,"GC upper bound:",r.a.createElement("input",{type:"number",step:.01,value:n,onChange:this.handleGCUpperThresholdChange})))),r.a.createElement("div",{className:"col-5"},r.a.createElement("h2",null,"Nucleotide Sequence"),r.a.createElement("div",{className:"back-translator-output"},l))),r.a.createElement("div",{className:"d-flex justify-content-end p-3"},r.a.createElement("button",{onClick:this.handleAminoAcidSequenceSubmission},"Submit")))))}}]),t}(n.Component);c.a.render(r.a.createElement(function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement(m,null),r.a.createElement("div",{style:{height:"100%"}},r.a.createElement(p,null)),r.a.createElement(d,null))},null),document.getElementById("root"))},9:function(e,t,a){e.exports=a(18)}},[[9,1,2]]]);
//# sourceMappingURL=main.7660f56f.chunk.js.map