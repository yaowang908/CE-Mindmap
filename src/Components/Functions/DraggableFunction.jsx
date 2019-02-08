import { yellow } from "ansi-colors";

export function startDrag(event) {
    //startDrag
    if (event.path[1].classList && event.path[1].classList.contains('draggable')) {
        console.log('draggable');
        this.selectedDraggingElement = event.path[1];
        this.currentMouseDownPosition = [event.clientX,event.clientY];
    }
    
}

export function drag(event) {
    //drag
    
    // if (this.selectedDraggingElement) {
    //     event.preventDefault();
    //     let transform = this.selectedDraggingElement.getAttributeNS(null, 'transform').trim().match(/\((.*?)\)/)[1];
    //     let coordinates = transform.split(' ');
    //     let x = parseFloat(coordinates[0]);
    //     let y = parseFloat(coordinates[1]);

    //     x = x + 1;

    //     this.selectedDraggingElement.setAttributeNS(null, 'transform', `translate(${x} ${y})`);
    // }

    if (this.selectedDraggingElement) {
        event.preventDefault();

        let dragX = event.clientX;
        let dragY = event.clientY;

        //get current node position
        let currentNodePosition = event.path[1].firstChild.attributes[0].nodeValue.trim().split("\n");
        currentNodePosition = currentNodePosition[0].split(' ')[1].split(',');
        //get current mousedown position
        let currentX = this.currentMouseDownPosition[0];
        let currentY = this.currentMouseDownPosition[1];

        let deltaX = parseFloat(dragX - currentX);
        let deltaY = parseFloat(dragY - currentY);
        //TODO: current mouse position - mousedown position = delta position

        let x = parseFloat(this.selectedDraggingElement.getAttributeNS(null,'x'));
        let y = parseFloat(this.selectedDraggingElement.getAttributeNS(null,'y'));

        if(!(isNaN(deltaX)) && !(isNaN(deltaY))) {
            this.selectedDraggingElement.setAttributeNS(null, "x", deltaX );
            this.selectedDraggingElement.setAttributeNS(null, "y", deltaY );
        } else {
            //mouse leave node
            return;
        }
        
        //x is relative to current position
    }

}

export function endDrag(event) {
    //endDrag
    if (this.selectedDraggingElement) {
        // selectedElement = null;
        console.log('end drag');
        console.dir(this.selectedDraggingElement);
        let x = parseFloat(this.selectedDraggingElement.getAttributeNS(null, 'x'));
        let y = parseFloat(this.selectedDraggingElement.getAttributeNS(null, 'y'));

        let _thisSVGChildren = this.state.SVGChildren.slice();
        _thisSVGChildren.map(element=>{
            if(this.selectedDraggingElement.id === element.id) {
                element.position = [x,y];
                return element;
            } else {
                return element;
            }
        });
        this.setCookie('SVGChildren', JSON.stringify(_thisSVGChildren));
        console.log("x: "+x+", y: "+y);

        this.selectedDraggingElement = null;
        this.currentMouseDownPosition = [];
    }
    
}