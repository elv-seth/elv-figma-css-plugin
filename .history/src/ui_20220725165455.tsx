//import { on } from "events";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {useState, useEffect, useRef } from "react";
import Editor from 'react-simple-code-editor';
import "./ui.css";
import Logo from "./assets/elv-logo.png"
import Copy from "./assets/clipboard.png"
import ExportIcon from "./assets/Download.png"
import BackArrow from "./assets/back_arrow.png"


declare function require(path: string): any;

function App() {
  const [showStylesheet, setShowStylesheet] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [dataRef, setCssData] = useState({    
    bg_page : "",
    bg_primary : "",
    bg_secondary : "",
    bg_page_header :"",
    bg_button_primary :"",
    text_primary : "",
    text_secondary : "",
    text_highlight : ""
  });

  const [codeString,setCodeString] = useState("");


   const saveData = (data) => {
    setCssData(data);
    let temp = ":root { \n";
    temp += "--color-page-bg: " + data.bg_page + ";\n";
    temp += "--color-bg-primary: " + data.bg_primary  + ";\n";
    temp += "--color-bg-secondary: " + data.bg_secondary + ";\n";
    temp += "--background-page-header: " + data.bg_page_header + ";\n";
    temp += "--background-button-primary: " + data.bg_button_primary + ";\n";
    temp += "--color-text-primary: " + data.text_primary + ";\n";
    temp += "--color-text-secondary: " + data.text_secondary+ ";\n";
    temp += "--color-text-highlight: " + data.text_highlight + ";\n";
    temp += " }";
    setCodeString(temp);
   }

  const onStylesheet = () => {
    parent.postMessage({ pluginMessage: { type: "stylesheet" } }, "*");
  };

  const onHelp = () => {
    parent.postMessage({ pluginMessage: { type: "help" } }, "*");
  };


  const onCopy = () => {
        //copy to clipboard

    const area = document.createElement('textarea')
    document.body.appendChild(area)
    area.value = codeString;
   // area.focus()
    area.select()
    const result = document.execCommand('copy')
    document.body.removeChild(area)
    if (!result) {
      throw new Error()
    }
    alert("Styling copied to your clipboard");
  };

  const onExportStylesheet = () => {
    let outputString = "";
    outputString += "--color-page-bg: " + dataRef.bg_page + "\n";
    outputString += "--color-bg-primary: " + dataRef.bg_primary  + "\n";
    outputString += "--color-bg-secondary: " + dataRef.bg_secondary + "\n";
    outputString += "--background-page-header: " + dataRef.bg_page_header + "\n";
    outputString += "--background-button-primary: " + dataRef.bg_button_primary + "\n";
    outputString += "--color-text-primary: " + dataRef.text_primary + "\n";
    outputString += "--color-text-secondary: " + dataRef.text_secondary+ "\n";
    outputString += "--color-text-highlight: " + dataRef.text_highlight + "\n";
    const element = document.createElement("a");
    const file = new Blob([outputString],{
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = "myDesign.scss";
    document.body.appendChild(element);
    element.click(); 
    //create and export to local .scss file
  }

  const onBack = () => {
     parent.postMessage({ pluginMessage: { type: "back" } }, "*");
    }


  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  if(!showStylesheet && !showHelp) {
    return (
      <main>
        <header>
        <script>
         { onmessage = (event) => { 
          if(event.data.pluginMessage === "stylesheet") {
            setShowStylesheet(true);
          } else if(typeof event.data.pluginMessage === 'object') {
            const data = event.data.pluginMessage;
            console.log(data);
            saveData(data);
          } else if(event.data.pluginMessage === "help") {
            setShowHelp(true);
          } else if(event.data.pluginMessage === "home") {
            setShowHelp(false);
            if(showStylesheet)
              setShowStylesheet(false);
          }
        }} 
        </script>
        </header>
          <img src={Logo} />
     
        <div className="spacer" />
        <div className="spacer" />

         <button className="brand" onClick={onStylesheet}>
            Stylesheet
          </button>
          <div className="spacer" />
          <button className="brand" onClick={onHelp}>
            Help
          </button>
  
      </main>
    );
  } else if(showStylesheet) {
    return(
        <div className="stylesheet">
          <div className="toolbar">
            
              <button className="tool" onClick={() => onCopy()}>
                
              <img src={Copy} className = "icon" />
              <div className = "item">
                Copy
              </div>
              </button>
          
              <button className="tool" id="rightbutton" onClick={onExportStylesheet}>

              <img src={ExportIcon} className = "icon"/>
              <div className = "item">
                Save
              </div>
              </button>
          </div>
          <div className = "spacer"/>
          <div className = "spacer"/>
          <div className="text"> 
            <p>FOR SPACING </p>
            <p className="wrap">:root &#123;</p>
            <p>&ensp;--color-page-bg:<b className="afterColon">{dataRef.bg_page};</b></p>
            <p>&ensp;--color-bg-primary:<b className="afterColon">{dataRef.bg_primary};</b></p>
            <p>&ensp;--color-bg-secondary:<b className="afterColon">{dataRef.bg_secondary};</b></p>
            <p>&ensp;--background-page-header:<b className="afterColon">{dataRef.bg_page_header};</b></p>
            <p>&ensp;--background-button-primary<b className="afterColon">{dataRef.bg_button_primary};</b></p>
            <p>&ensp;--color-text-primary:<b className="afterColon">{dataRef.text_primary};</b></p>
            <p>&ensp;--color-text-secondary:<b className="afterColon">{dataRef.text_secondary};</b></p>
            <p>&ensp;--color-text-highlight:<b className="afterColon">{dataRef.text_highlight};</b></p>
            <p className = "wrap">&#125;</p>
          </div>
  
        </div>
    )
} else if(showHelp) {
  return(
    <div className="stylesheet">
      <div className="toolbar">
      <button className="tool" onClick={() => onBack()} id="back">
      <img src={BackArrow} className = "icon" />
      <div className = "item">
                  Back
      </div>
      </button>
        <h1>Help Guide</h1>
      </div>
    <p className="help">
This plugin is designed to work with the <a href="https://www.figma.com/community/file/1131334713553330014" target="_blank">Eluvio Marketplace Template Figma document</a>. First, make a copy of the document and configure the marketplace styling however you’d like. Then, run the plugin and click “Stylesheet” to generate SCSS variables which can be directly plugged into the<a Eluvio fabric browser to style your live marketplace. If you have any further questions, the plugin source code can be found here and you can email us at events@live.eluv.io.
    </p>

    </div>
  )
}

}

ReactDOM.render(<App />, document.getElementById("react-page"));


