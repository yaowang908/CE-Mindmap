import $ from "jquery";

/**TODO:
 * 1. 
 * 2. instead of making svg super big, we can make it scaling! This is SVG's advantage, after all
 */

function ZoomFunction(e) {
    console.dir(e);
    let deltaY = e.originalEvent.deltaY; 

    console.dir(deltaY);
}

$(document).ready(function(){
    //DOM ready here
    console.log("this is external JS snip, for Zoom function!");

    let wheelEvt = "onwheel" in document.createElement("div") ? "wheel" : //Modern browsers support wheel
                    document.onmousewheel !== undefined ? "mousewheel" : //Webkit and IE support at least "mousewheel"
                    "DOMMouseScroll";// let's assume that remaining browsers are older Firefox
    
    let mainSVG = $("#mind_map");
    mainSVG.on(wheelEvt, ZoomFunction);

});
    


