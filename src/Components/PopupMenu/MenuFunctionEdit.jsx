

export default function MenuFunctionEdit(rect) {
    console.log("Now in edit function");
    let editor = document.getElementById("node_text_editor");
    console.dir(rect);
    editor.setAttribute(
        "style",`
        left: ${rect.left}px;
        top: ${rect.top}px;
        width: ${rect.width}px;
        display: block;
        position: absolute;
        z-index: 1200;
    `);
    editor.focus();//set focus to input editor
    window.addEventListener("mouseup",function(){
        //hide editor when lose focus
        if( editor !== document.activeElement) {
            editor.setAttribute(
                "style", `
                left: 0px;
                top: 0px;
                display: none;
                position: absolute;
                z-index: 1200;
            `);
        }
    });
    
}