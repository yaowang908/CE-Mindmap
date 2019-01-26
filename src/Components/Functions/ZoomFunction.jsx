import $ from "jquery";

function ZoomFunction(zoomLevel, offSetIndex) {
    return function(e){
        let deltaY = e.originalEvent.deltaY; 
        let node_container = $("#mind_map_node_container");

        zoomLevel = zoomLevel - (deltaY/100)*0.2;
        offSetIndex = offSetIndex + deltaY ;
        
        if (zoomLevel <= 0.2) {//set max and min scale level
            zoomLevel = 0.2;
        } else if (zoomLevel>=5) {
            zoomLevel = 5;
        }
        node_container.attr("transform", `matrix(${zoomLevel},0,0,${zoomLevel},${offSetIndex},${offSetIndex})`);

    } 
}

$(document).ready(function(){
    //DOM ready here
    // console.log("this is external JS snip, for Zoom function!");

    let zoomLevel = 1;//svg zoom level
    let offSetIndex = 0;

    let wheelEvt = "onwheel" in document.createElement("div") ? "wheel" : //Modern browsers support wheel
                    document.onmousewheel !== undefined ? "mousewheel" : //Webkit and IE support at least "mousewheel"
                    "DOMMouseScroll";// let's assume that remaining browsers are older Firefox
    
    let mainSVG = $("#mind_map");
    mainSVG.on(wheelEvt, ZoomFunction(zoomLevel, offSetIndex));

});
    


