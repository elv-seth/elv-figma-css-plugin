import { extractLinearGradientParamsFromTransform } from "@figma-plugin/helpers";
import { toSolidPaint } from 'figx';


class Color{
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(color,opacity=-1) {
    this.r = Math.round(100*255*color.r)/100;
    this.g = Math.round(100*255*color.g)/100;
    this.b = Math.round(100*255*color.b)/100;
    if(opacity == -1){
      this.a = Math.round(100*color.a)/100;
    } else {
      this.a = Math.round(100*opacity)/100;
    }
  };
}

class ColorFill{
  isGradient: boolean;
  rgb1: Color;
  gradient: LinearGradient;

  constructor(fill) {
    if(fill.type === "SOLID") {
      this.isGradient = false;
      this.rgb1 = new Color(fill.color,fill.opacity);
    } else if(fill.type === "GRADIENT_LINEAR") {
      this.isGradient = true;
      this.gradient = new LinearGradient(fill.gradientStops,fill.gradientTransform);
      
  }
}
}

class LinearGradient {
  direction: string;
  numStops: number;
  colors: (Color)[];

  constructor(stops,transform) {
    console.log(stops);
    console.log(transform);
    const obj = extractLinearGradientParamsFromTransform(10,10,transform);
    let deltaX = Math.round(obj.end[0]-obj.start[0]);
    let deltaY = Math.round(obj.end[1] - obj.start[1]);
    let temp = "";
    if(deltaX>5) {
      temp += "to right";
    } else if(deltaX < -5) {
      temp += "to left";
    }
    if(deltaY >5) {
      if(temp.length == 0) {
        temp += "to bottom";
      } else {
        temp += " bottom";
      }
    } else if(deltaY < -5) {
      if(temp.length == 0) {
        temp += "to top";
      } else {
        temp += " top";
      }
    }
    this.direction=temp;
    this.numStops = stops.length;
    this.colors = [];
    for(let i = 0; i < stops.length; i++) {
      this.colors.push(new Color(stops[i].color));
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
  border_color: string;
  border_width: string;

  constructor() {
    this.bg_page = "";
    this.bg_primary = "";
    this.bg_secondary = "";
    this.bg_page_header ="";
    this.bg_button_primary ="";
    this.text_primary = "";
    this.text_secondary = "";
    this.text_highlight = "";
    this.border_color = "";
    const vec = figma.getNodeById("I403:1634;54:1439") as VectorNode; //this is the card border element we ask users to resize in the template
    this.border_width = `${Math.round(vec.strokeWeight*10)/10}px`;
  }
}

function convertToCss(color: Color) {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
  }



function convertToCssString(color: ColorFill) {
  if(color.isGradient) {
    let temp = `linear-gradient(${color.gradient.direction}`;
    for(let i = 0; i < color.gradient.colors.length; i++) {
      temp += ", ";
      temp += convertToCss(color.gradient.colors[i]);
    }
    temp += ")"
    return temp;
  } else {
  return `rgba(${color.rgb1.r},${color.rgb1.g},${color.rgb1.b},${color.rgb1.a})`;
  }
}

figma.showUI(__html__, { themeColors: true, height: 450, width: 350});
const vec = figma.getNodeById("I403:1634;54:1439") as VectorNode;
console.log(vec.strokeWeight);


function parseStyles() {
  let cssObj = new cssData();

  for (const style of figma.getLocalPaintStyles()) {
    switch(style.name) {
      case "bg-page":
        cssObj.bg_page = convertToCssString(new ColorFill(style.paints[0]));
        console.log("style",style.paints[0]);
        break;
      case "bg-primary":
        cssObj.bg_primary = convertToCssString(new ColorFill(style.paints[0]));
        console.log("style",style.paints[0]);
        break;
      case "bg-secondary":
        cssObj.bg_secondary = convertToCssString(new ColorFill(style.paints[0]));
        console.log("style",style.paints[0]);
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
      case "card-border":
        cssObj.border_color = convertToCssString(new ColorFill(style.paints[0]));
        break;
      default:
        //do nothing, we don't care about these styles
    }
  }
  return cssObj;
}

figma.ui.onmessage = (msg) => {
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
    figma.showUI(__html__, { themeColors: true, height: 450, width: 350});
    figma.ui.postMessage("home");

  }

  if (msg.type === "setToDark") {
    console.log("setToDark")

  } 

  if (msg.type === "setToLight") {
    let defaultLightStyles = {
      bg_page: '#F6F6F6',
      bg_primary: '#D2D2D2',
      card_border:'#D2D2D2'
    }
    console.log("setToLight")
    var paint 
    for (const style of figma.getLocalPaintStyles()) {
      switch(style.name) {
        case "bg-page":
          paint = toSolidPaint(defaultLightStyles.bg_page)
          style.paints = [paint]
          break;
        case "bg-primary":
          paint = toSolidPaint(defaultLightStyles.bg_primary)
          style.paints = [paint]
          break;
        case "bg-secondary":
          paint = toSolidPaint(defaultLightStyles.bg_page)
          style.paints = [paint]
          break;
        case "bg-page-header":
          paint = toSolidPaint(defaultLightStyles.bg_page)
          style.paints = [paint]
          break;
        case "bg-button-primary":
          paint = toSolidPaint(defaultLightStyles.bg_page)
          style.paints = [paint]
            break;
        case "text-primary":
          paint = toSolidPaint(defaultLightStyles.bg_page)
          style.paints = [paint]
          break;
        case "text-secondary":
          paint = toSolidPaint(defaultLightStyles.bg_page)
          style.paints = [paint]
            break;
        case "text-highlight":
          paint = toSolidPaint(defaultLightStyles.bg_page)
          style.paints = [paint]
          break;
        case "card-border":
          paint = toSolidPaint(defaultLightStyles.bg_primary)
          style.paints = [paint]
          break;
        default:
          //do nothing, we don't care about these styles
      }
    }
  }
};
