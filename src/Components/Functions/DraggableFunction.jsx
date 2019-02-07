export function startDrag(event) {
    //startDrag
    if (event.path[1].classList && event.path[1].classList.contains('draggable')) {
        console.log('draggable');
        this.selectedDraggingElement = event.path[1];

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
        console.dir(event);

        let dragX = event.clientX;
        let dragY = event.clientY;

        //get current node position
        let currentPosition = event.path[1].firstChild.attributes[0].nodeValue.trim().split("\n");
        currentPosition = currentPosition[0].split(' ')[1].split(',');
        let currentX = currentPosition[0];
        let currentY = currentPosition[1];

        let deltaX = parseFloat(dragX - currentX);
        let deltaY = parseFloat(dragY - currentY);

        let x = parseFloat(this.selectedDraggingElement.getAttributeNS(null,'x'));
        let y = parseFloat(this.selectedDraggingElement.getAttributeNS(null,'y'));

        console.log("x: "+x);
        console.log("y: "+y);
        console.log("deltax: "+deltaX);
        console.log("deltay: "+deltaY);
        // this.selectedDraggingElement.setAttributeNS(null,"x",x+deltaX);
        // this.selectedDraggingElement.setAttributeNS(null,"y",y+deltaY);
        //x is relative to current position
    }

}

export function endDrag(event) {
    //endDrag
    if (this.selectedDraggingElement) {
        // selectedElement = null;
        console.log('end drag');
        this.selectedDraggingElement = null;
    }
    
}