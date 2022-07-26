import { extractLinearGradientParamsFromTransform } from "@figma-plugin/helpers";

//export const num = 2;

class Color{
  r: number;
  g: number;
  b: number;
  constructor(r,g,b) {
    this.r = Math.round(100*255*r)/100;
    this.g = Math.round(100*255*g)/100;
    this.b = Math.round(100*255*b)/100;
  }
}

class BoundingBox{
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x,y,width,height) { 
        this.x = x;
        this.y= y;
        this.width = width;
        this.height = height;
    }
}


class ColorFill{
  opacity: number;
  isGradient: boolean;
  rgb1: Color;
  rgb2: Color;

  constructor(fill) {
    if(fill.type === "SOLID") {
      console.log(fill);
      this.isGradient = false;
      this.opacity = Math.round(100*fill.opacity)/100;
      this.rgb1 = new Color(fill.color.r,fill.color.g,fill.color.b);
      this.rgb2 = new Color(0,0,0);
    } else {
      console.log(fill);
    }
  }
}

class cssData{
  bg_page: string;
  bg_primary: string;
  bg_secondary: string;
  bg_page_header: string;
  bg_button_primary: string;
  text_primary: string;
  text_secondary: string;
  text_highlight: string;

  constructor() {
    this.bg_page = "";
    this.bg_primary = "";
    this.bg_secondary = "";
    this.bg_page_header ="";
    this.bg_button_primary ="";
    this.text_primary = "";
    this.text_secondary = "";
    this.text_highlight = "";
  }
}

function convertToCssString(color: ColorFill) {
  return "onit";
  //return `rgba(${color.rgb1.r},${color.rgb1.g},${color.rgb1.b},${color.opacity})`;
}




//RECTANGLE
/*
class Rectangle {
    id: string;
    cornerRadius: number;
    cornerSmoothing: number;
    fill: ColorFill;
    background: ColorFill;
    bounds: BoundingBox
    constructor(rect: RectangleNode) {
        this.id = rect.id;
        this.cornerRadius = rect.cornerRadius as number;
        this.cornerSmoothing = rect.cornerSmoothing;
        this.bounds = new BoundingBox(rect.x,rect.y,rect.width,rect.height);
        if(rect.fills[0].type === "GRADIENT_LINEAR") {
          this.fill = new ColorFill(rect.opacity,true,rect.fills[0].gradientStops[0].color.r,rect.fills[0].gradientStops[0].color.g,rect.fills[0].gradientStops[0].color.b,
            rect.fills[0].gradientStops[1].color.r,rect.fills[0].gradientStops[1].color.g,rect.fills[0].gradientStops[1].color.b);
        } else if(rect.fills[0].type === "SOLID") {
          this.fill = new ColorFill(rect.opacity,false,rect.fills[0].color.r,rect.fills[0].color.g,rect.fills[0].color.b,0,0,0);
        } else {
          throw new Error("only fill types of 'SOLID' and 'GRADIENT_LINEAR' are supported");
        }
    }
}

*/
figma.showUI(__html__, { themeColors: true, height: 350, width: 350});

function parseStyles() {
  let cssObj = new cssData();

  for (const style of figma.getLocalPaintStyles()) {
    switch(style.name) {
      case "bg-page":
        cssObj.bg_page = convertToCssString(new ColorFill(style.paints[0]));
        break;
      case "bg-primary":
        cssObj.bg_primary = convertToCssString(new ColorFill(style.paints[0]));
        break;
      case "bg-secondary":
        cssObj.bg_secondary = convertToCssString(new ColorFill(style.paints[0]));
        break;
      case "bg-page-header":
        cssObj.bg_page_header = convertToCssString(new ColorFill(style.paints[0]));
        break;
      case "bg-button-primary":
          cssObj.bg_button_primary = convertToCssString(new ColorFill(style.paints[0]));  
          break;
      case "text-primary":
        cssObj.text_primary = convertToCssString(new ColorFill(style.paints[0]));
        break;
      case "text-secondary":
        cssObj.text_secondary = convertToCssString(new ColorFill(style.paints[0]));
          break;
      case "text-highlight":
        cssObj.text_highlight = convertToCssString(new ColorFill(style.paints[0]));
        break;
      default:
        //do nothing, we don't care about these styles
    }
  }

  //figma.ui.postMessage(cssObj);
  return cssObj;
}

figma.ui.onmessage = (msg) => {
  if (msg.type === "create-rectangles") {
    const nodes = [];

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === "preview") {
    console.log("preview message received in plugin code")
  }

  if (msg.type === "stylesheet") {
    figma.ui.close();
    figma.showUI(__html__, { themeColors: true, height: 575, width: 710});
    figma.ui.postMessage(parseStyles());
    figma.ui.postMessage("stylesheet");
  }

  if (msg.type === "help") {
    figma.ui.close();
    figma.showUI(__html__, { themeColors: true, height: 575, width: 710});
    figma.ui.postMessage("help");
  }

  if (msg.type === "back") {
    figma.ui.close();
    figma.showUI(__html__, { themeColors: true, height: 350, width: 350});
    figma.ui.postMessage("home");

  }

  if (msg.type === "test") {
    console.log("hello world2")
    figma.ui.postMessage({value: 42});

  }

 // figma.closePlugin();
};
