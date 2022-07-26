//import { on } from "events";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {useState, useEffect, useRef } from "react";
import Editor from 'react-simple-code-editor';

import "./ui.css";
import Logo from "./assets/elv-logo.png"
import Copy from "./assets/clipboard.png"
import ExportIcon from "./assets/Download.png"
//import {ImageIcon} from "elv-components-js";


declare function require(path: string): any;

function App() {
  const [showStylesheet, setShowStylesheet] = useState(false);
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
    temp += "--color-page-bg: " + data.bg_page + "\n";
    temp += "--color-bg-primary: " + data.bg_primary  + "\n";
    temp += "--color-bg-secondary: " + data.bg_secondary + "\n";
    temp += "--background-page-header: " + data.bg_page_header + "\n";
    temp += "--background-button-primary: " + data.bg_button_primary + "\n";
    temp += "--color-text-primary: " + data.text_primary + "\n";
    temp += "--color-text-secondary: " + data.text_secondary+ "\n";
    temp += "--color-text-highlight: " + data.text_highlight + "\n";
    temp += " }";
    setCodeString(temp);
    console.log(temp);
   }

  const onStylesheet = () => {
    console.log("onStylesheet function called in UI window");
    parent.postMessage({ pluginMessage: { type: "stylesheet" } }, "*");
    setShowStylesheet(true);
  };

  const onHelp = () => {
    console.log("onHelp function called in UI window");
    parent.postMessage({ pluginMessage: { type: "preview" } }, "*");
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
    console.log('Copied with document.execCommand')
    alert("Styling copied to your clipboard");
  };

  const onExportStylesheet = () => {
    console.log("user wants to export this stylesheet to a .scss file");
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


  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  if(!showStylesheet) {
    return (
      <main>
        <header>
        <script>
         { onmessage = (event) => { 
          if(event.data.pluginMessage === "stylesheet") {
            setShowStylesheet(true);
          } else if(typeof event.data.pluginMessage === 'object') {
            const data = event.data.pluginMessage;
            console.log("data received in UI");
            console.log(data);
            saveData(data);
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
  } else {
    return(
        <div className="stylesheet">
          <div className="toolbar">
            <div className="item">
              <button className="tool" onClick={onHelp}>
              <img src={Copy} className = "icon" onClick = {} />
              <span className="caption"><p></p></span>
              </button>
           </div>
           <div className="item">
              <button className="tool" id="rightbutton" onClick={onHelp}>
              <img src={ExportIcon} className = "icon" onClick = {onExportStylesheet}/>
              <span className="caption"><p></p></span>
              </button>
            </div>
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
  /*          <img src={Copy} className = "icon" onClick = {() => onCopy()}/>
          <img src={ExportIcon} className = "icon" onClick = {onExportStylesheet}/> */

}

}

ReactDOM.render(<App />, document.getElementById("react-page"));


