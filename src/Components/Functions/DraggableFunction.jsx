
export function startDrag(event) {
    event.stopPropagation();
    event.preventDefault();
    let that = this;
    //startDrag
    if (event.path[1].classList && event.path[1].classList.contains('draggable')) {
        console.log('draggable');
        that.selectedDraggingElement = event.path[1];
        that.currentMouseDownPosition = [event.clientX,event.clientY];

        that.currentNodePositionX = Number(that.selectedDraggingElement.getAttributeNS(null, 'x'));
        that.currentNodePositionY = Number(that.selectedDraggingElement.getAttributeNS(null, 'y'));

        that.state.SVGChildren.map(node=>{
            that._preDraggingSVGChildren[node.id] = node.position;
        });//store all node position base on id of node
    }
    
}

export function drag(event) {
    event.stopPropagation();
    event.preventDefault();
    let that = this;
    //drag
    if (that.selectedDraggingElement) {

        let dragX = event.clientX;
        let dragY = event.clientY;

        //get current mousedown position
        let currentX = that.currentMouseDownPosition[0];
        let currentY = that.currentMouseDownPosition[1];

        let deltaX = Number(dragX - currentX);
        let deltaY = Number(dragY - currentY);

        //TODO: if mainNode get dragged, every node should move together

        if(that.selectedDraggingElement.id !== 'node_1') {
            if (!(isNaN(deltaX)) && !(isNaN(deltaY))) {
                that.selectedDraggingElement.setAttributeNS(null, "x", that.currentNodePositionX + deltaX);
                that.selectedDraggingElement.setAttributeNS(null, "y", that.currentNodePositionY + deltaY);

            } else {
                //mouse leave node
                return;
            }
        } else {
        /**
         *  if(mainNode get dragged)
         *      get deltaX and deltaY as usual
         *      change all nodes position at once
         *      stored data in cookie
         *      FIXME: mainNode moving speed increase 
         *              
         */ 
            if (!(isNaN(deltaX)) && !(isNaN(deltaY))) {
                that._SVGChildren_draggable = that.state.SVGChildren.map(node => {
                    
                    let _thisNode = document.getElementById(node.id);
                    
                    // let _currentNodePositionX = Number(node.position[0] ? node.position[0] : 0); // init value, node.position = '' sometimes
                    // let _currentNodePositionY = Number(node.position[1] ? node.position[1] : 0);
                    let _thisItem = this._preDraggingSVGChildren[node.id]
                    let _currentNodePositionX = Number(_thisItem[0]);
                    let _currentNodePositionY = Number(_thisItem[1]);
                    
                    // console.log(_currentNodePositionX);

                    _thisNode.setAttributeNS(null, "x", _currentNodePositionX + deltaX);
                    _thisNode.setAttributeNS(null, "y", _currentNodePositionY + deltaY);
                    node.position = [_currentNodePositionX + deltaX, _currentNodePositionY + deltaY];

                    // if (node.id === 'node_1') { console.log(node.position) }

                    return node;
                });
                // console.log('drag');
            } else {
                //mouse leave node
                return;
            }
            
        }

        //x is relative to current position
    }//end of if
}

export function endDrag(event) {
    event.stopPropagation();
    event.preventDefault();
    let that = this;
    //endDrag
    if (that.selectedDraggingElement) {
        // selectedElement = null;
        // console.log('end drag');
        // console.dir(that.selectedDraggingElement);

        if (that.selectedDraggingElement.id !== 'node_1') {//not main node
            let x = Number(that.selectedDraggingElement.getAttributeNS(null, 'x'));
            let y = Number(that.selectedDraggingElement.getAttributeNS(null, 'y'));
            //have to get attribute again, otherwise node would jump back to original position


            let _thisSVGChildren = that.state.SVGChildren.slice();
            _thisSVGChildren.map(element => {
                if (that.selectedDraggingElement.id === element.id) {
                    element.position = [x, y];
                    return element;
                } else {
                    return element;
                }
            });
            that.setCookie('SVGChildren', JSON.stringify(_thisSVGChildren));
        } else {//main node dragged
            // that._setStateSVGChildren(that._SVGChildren_draggable);
            that.setCookie('SVGChildren', JSON.stringify(that._SVGChildren_draggable));
        }
        
        // console.log("x: "+x+", y: "+y);

        that.selectedDraggingElement = null;
        that.currentMouseDownPosition = [];
        that.currentNodePositionX = 0;
        that.currentNodePositionY = 0;
        that._preDraggingSVGChildren = [];
    }
    
}