//import { on } from "events";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {useState, useEffect, useRef } from "react";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; 
import "./ui.css";
import Logo from "./assets/elv-logo.png"
import Copy from "./assets/copy.png"
import ExportIcon from "./assets/export1.png"
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

  useEffect(() => {

    if(isMounted)
    setCodeString(temp);
   },[dataRef])


   const saveData = (data) => {
    setCssData(data);
    let temp = ":root {";
    temp += "--color-page-bg: " + dataRef.bg_page + "\n";
    temp += "--color-bg-primary: " + dataRef.bg_primary  + "\n";
    temp += "--color-bg-secondary: " + dataRef.bg_secondary + "\n";
    temp += "--background-page-header: " + dataRef.bg_page_header + "\n";
    temp += "--background-button-primary: " + dataRef.bg_button_primary + "\n";
    temp += "--color-text-primary: " + dataRef.text_primary + "\n";
    temp += "--color-text-secondary: " + dataRef.text_secondary+ "\n";
    temp += "--color-text-highlight: " + dataRef.text_highlight + "\n";
    temp += " }";
    setCod
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
    let outputString = "";
    outputString += "--color-page-bg: " + dataRef.bg_page + "\n";
    outputString += "--color-bg-primary: " + dataRef.bg_primary  + "\n";
    outputString += "--color-bg-secondary: " + dataRef.bg_secondary + "\n";
    outputString += "--background-page-header: " + dataRef.bg_page_header + "\n";
    outputString += "--background-button-primary: " + dataRef.bg_button_primary + "\n";
    outputString += "--color-text-primary: " + dataRef.text_primary + "\n";
    outputString += "--color-text-secondary: " + dataRef.text_secondary+ "\n";
    outputString += "--color-text-highlight: " + dataRef.text_highlight + "\n";
    console.log(outputString);

    const area = document.createElement('textarea')
    document.body.appendChild(area)
    area.value = outputString
   // area.focus()
    area.select()
    const result = document.execCommand('copy')
    document.body.removeChild(area)
    if (!result) {
      throw new Error()
    }
    console.log('Copied with document.execCommand')
    
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
          <img src={Copy} className = "icon" onClick = {() => onCopy()}/>
          <img src={ExportIcon} className = "icon" onClick = {onExportStylesheet}/>
          </div>
          <div className = "spacer"/>
          <Editor
      value={codeString}
      onValueChange={code => setCodeString(code)}
      highlight={code => highlight(code) }
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
          <div className="text"> 
            <p>FOR SPACING </p>
            <p>--color-page-bg: {dataRef.bg_page}; </p>
            <p>--color-bg-primary: {dataRef.bg_primary};</p>
            <p>--color-bg-secondary: {dataRef.bg_secondary}; </p>
            <p>--background-page-header: {dataRef.bg_page_header}; </p>
            <p>--background-button-primary: {dataRef.bg_button_primary}; </p>
            <p>--color-text-primary:{dataRef.text_primary}; </p>
            <p>--color-text-secondary: {dataRef.text_secondary};</p>
            <p>--color-text-highlight: {dataRef.text_highlight};</p>
          </div>
  
        </div>
    )
  

}

}

ReactDOM.render(<App />, document.getElementById("react-page"));


