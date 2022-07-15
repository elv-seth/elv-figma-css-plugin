//import { on } from "events";
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

  return(
    <div >
      <ImageIcon icon={Logo} title="Eluvio" className="navigation-logo" />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("react-page"));


