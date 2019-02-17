
export function startDrag(event) {
    event.stopPropagation();
    event.preventDefault();
    let that = this;
    //startDrag
    if (event.path[1].classList && event.path[1].classList.contains('draggable')) {
        // console.log('draggable');
        that.selectedDraggingElement = event.path[1];
        that.currentMouseDownPosition = [event.clientX,event.clientY];
        if (that.selectedDraggingElement.id !== 'node_1'){
            //node main node 
            that.currentNodePositionX = Number(that.selectedDraggingElement.getAttributeNS(null, 'x'));
            that.currentNodePositionY = Number(that.selectedDraggingElement.getAttributeNS(null, 'y'));
        } else {
            //main node
            let group = document.getElementById('mind_map_node_container');
            that.currentNodePositionX = Number(group.getAttributeNS(null, 'x'));
            that.currentNodePositionY = Number(group.getAttributeNS(null, 'y'));

        }
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
        
        if(that.selectedDraggingElement.id !== 'node_1') {
            if (!(isNaN(deltaX)) && !(isNaN(deltaY))) {
                that.selectedDraggingElement.setAttributeNS(null, "x", that.currentNodePositionX + deltaX);
                that.selectedDraggingElement.setAttributeNS(null, "y", that.currentNodePositionY + deltaY);

                //get selectedDraggingElement x math symbol - or +
                let __currentX = that.selectedDraggingElement.getAttributeNS(null,"x");
                let _symbol = __currentX / Math.abs(__currentX);// -1 or +1

                //update children nodes position if node moved acrossed 0, left to right or right to left
                _updateChildrenNodesX(that.selectedDraggingElement.id);

                function _updateChildrenNodesX(_thisNodeID) {
                    //update children nodes direction
                    let _thisNodeChildren = that.state.SVGChildren.map(x=>{
                            if(x.parent === _thisNodeID) {
                                return x.id
                            }
                        }).filter(x=>x);
                    let ___thisNode = document.getElementById(_thisNodeID);
                    let ___currentX = ___thisNode.getAttributeNS(null, "x");
                    if (_thisNodeChildren.length === 0) {
                        ___thisNode.setAttributeNS(null, 'x', Math.abs(___currentX) * _symbol);
                        return ;//no child
                    } else {
                        if (_thisNodeID !== that.selectedDraggingElement.id) {
                            ___thisNode.setAttributeNS(null, 'x', Math.abs(___currentX) * _symbol);
                        }   
                        _thisNodeChildren.map(x => { return _updateChildrenNodesX(x) });
                    }
                    /**
                     *  suppose to return something like this
                     *  {
                     *      nodes:[],
                     *      children:{
                     *              nodes:'',
                     *              children:{}    
                     *              }
                     *  }
                     *  
                     */
                } // end of getBranchNodes()



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
         *      mainNode moving speed increase 
         *              
         */ 
            if (!(isNaN(deltaX)) && !(isNaN(deltaY))) {

                let group = document.getElementById('mind_map_node_container');
                group.setAttributeNS(null,"x",that.currentNodePositionX + deltaX);
                group.setAttributeNS(null,"y",that.currentNodePositionY + deltaY);

                let connection = document.getElementById('connection');

                connection.setAttributeNS(null, "x", `${-1 * (that.currentNodePositionX + deltaX)}`);
                connection.setAttributeNS(null, "y", `${-1 * (that.currentNodePositionY + deltaY)}`);

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
            that._setStateSVGChildren(_thisSVGChildren);
            that.setCookie('SVGChildren', JSON.stringify(_thisSVGChildren));
        } else {//main node dragged
            //dont store state when main node get dragged
            //reset position to original when refresh

            // that._setStateSVGChildren(that._SVGChildren_draggable);
            // that.setCookie('SVGChildren', JSON.stringify(that._SVGChildren_draggable));
        }
        
        that.selectedDraggingElement = null;
        that.currentMouseDownPosition = [];
        that.currentNodePositionX = 0;
        that.currentNodePositionY = 0;
        that._preDraggingSVGChildren = [];
    }
    
}