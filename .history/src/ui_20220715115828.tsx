import { on } from "events";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {useState, useEffect, useRef } from "react";
import "./ui.css";
import Logo from "./assets/elv-logo.png"
import Copy from "./assets/copy.png"
import ExportIcon from "./assets/export1.png"
import {ImageIcon} from "elv-components-js";


declare function require(path: string): any;

function App() {

  let data = {    
    bg_page : "",
    bg_primary : "",
    bg_secondary : "",
    bg_page_header :"",
    bg_button_primary :"",
    text_primary : "",
    text_secondary : "",
    text_highlight : ""
  }

   const [showStylesheet, setShowStylesheet] = useState(false);
   const [dataRef, setCssData] = useState(data);
   /*
   const dataRef= useRef(data);
   dataRef.current = cssData;



  useEffect(() => {

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = 'onmessage = (event) => { console.log(event.data.pluginMessage);}';
    document.body.append(inlineScript);
  
    // componentWillUnmount() {}
    return () => {
      inlineScript.remove();
    };
  }, []);
*/

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onCreate = () => {
  

    parent.postMessage({ pluginMessage: { type: "test" } }, "*");

    const count = Number(inputRef.current?.value || 0);
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", count } },
      "*"
    );
  };

  const onPreview = () => {
    console.log("onPreview function called in UI window");
    parent.postMessage({ pluginMessage: { type: "preview" } }, "*");
  };

  const onStylesheet = () => {
    console.log("onStylesheet function called in UI window");
    parent.postMessage({ pluginMessage: { type: "stylesheet" } }, "*");
    setShowStylesheet(true);
  };

  const onExport = () => {
    console.log("onExport function called in UI window");
    parent.postMessage({ pluginMessage: { type: "export" } }, "*");
  }

  const onCopy = () => {
    console.log("user wants to copy styling to their clipboard");
    //copy to clipboard
  };

  const onExportStylesheet = () => {
    console.log("user wants to export this stylesheet to a .scss file");
    //create and export to local .scss file
  }


  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

/*
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
          setCssData(data);
        }
      }} 
      </script>
      {/*  <ImageIcon icon={Logo} title="Eluvio" className="navigation-logo" useLoadingIndicator={false} />/}
        <img src={Logo} /> 
      </header>
        <button className="brand" onClick={onPreview}>
          Preview
        </button>
        <div className="spacer" />
        <button className="brand" onClick={onStylesheet}>
          Stylesheet
        </button>
        <div className="spacer" />
        <button className="brand" onClick={onExport}>
          Export Code
        </button>

    </main>
  );
} else {
  return(
      <div className="stylesheet">
        <div className="toolbar">
        <img src={Copy} className = "icon" onClick = {onCopy}/>
        <img src={ExportIcon} className = "icon" onClick = {onExportStylesheet}/>
        </div>
        <div className = "spacer"/>
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
  
}*/
}

ReactDOM.render(<App />, document.getElementById("react-page"));
