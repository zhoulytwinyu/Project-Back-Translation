import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackTranslator from "./components/BackTranslator";

function App(props) {
  return (
    <>
      <Header/>
      <div style={{height:"100%"}}>
        <BackTranslator/>
      </div>
      <Footer/>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
