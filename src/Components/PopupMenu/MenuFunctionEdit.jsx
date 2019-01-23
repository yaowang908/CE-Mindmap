

export default function MenuFunctionEdit(callerNode) {
    console.log("Now in edit function");
    let editor = document.getElementById("node_text_editor");
    let rect = callerNode.getBoundingClientRect();//get target element position
    // console.dir(rect);
    let textHolder = callerNode.children[1].children[0];
    let formerText = textHolder.textContent;//get text content of this caller SVG node
    let newText = "";//text holder for users input 

    editor.setAttribute("value",`${formerText}`);
    editor.setAttribute(
        "style",`
        left: ${rect.left}px;
        top: ${rect.top+rect.height/2}px;
        width: ${rect.width}px;
        height: ${rect.height/2}px;
        display: block;
        position: absolute;
        z-index: 1200;
    `);
    editor.focus();//set focus to input editor
    
    let keydown_indicator = false; //prevent keydown fire mutiple times
    window.addEventListener("keydown", function (e) {
        e.stopPropagation();
        //hide editor when user hit enter
        if (!keydown_indicator && (e.code === 'Enter' || e.code ==="NumpadEnter") && editor === document.activeElement) { //editor !== document.activeElement ||
            
            keydown_indicator = true;//prevent keydown fire mutiple times
            
            updateTextContentOfCallerNode(callerNode, editor, newText, textHolder);
            
        }
    },false);//end of event listener for keydown

    let click_indicator = false; //prevent click fire mutiple times
    document.getElementById("mind_map").addEventListener("click",function(e){
    // add click listener to main svg
        e.stopPropagation();
        if(!click_indicator){
            click_indicator = true;
            updateTextContentOfCallerNode(callerNode, editor, newText, textHolder);
        }

    },false);
    
}

function updateTextContentOfCallerNode(_callerNode,_editor,_newText,_textHolder) {
    //hide input editor, and update node text
    _editor.setAttribute(
        "style", `
                left: 0px;
                top: 0px;
                display: none;
                position: absolute;
                z-index: 1200;
            `);//hide editor

    _newText = _editor.value;//user input
    _textHolder.textContent = _newText;
    

    let last_state_domRect_width = _callerNode.getBoundingClientRect().width;
    let last_state_textNode_width = _textHolder.getBoundingClientRect().width;

    /** 
     * Instead of re-centering mainNode by code, let user drag svg to center
    */
    let domRect = _textHolder.getBoundingClientRect();
    let nodePathHolder = _callerNode.children[0];
    let textNodeWidth_new = domRect.width + 5;//make callerNode bigger than text holder
    let formerPathD = nodePathHolder.getAttribute("d").split('\n');
    let newPathD = formerPathD.slice();

    let start_point_x = newPathD[0].split(' ')[1].split(',')[0];//last state, path starting point-x
    let start_point_y = newPathD[0].split(' ')[1].split(',')[1];//last state, path starting point-y
    // let new_start_point_x = Number(start_point_x) + Number((last_state_domRect_width - textNodeWidth_new)/2);
    // re-assemble path d attribute
    let new_start_point_x = start_point_x;
    newPathD[0] = "M " + new_start_point_x + ',' + start_point_y;
    newPathD[1] = "h " + textNodeWidth_new;
    newPathD[5] = "h -" + textNodeWidth_new;

    nodePathHolder.setAttribute('d', newPathD.join('\n'));

    console.log(Number(last_state_domRect_width));
}