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
        let x = parseFloat(this.selectedDraggingElement.getAttributeNS(null,'x'));
        this.selectedDraggingElement.setAttributeNS(null,"x",x+1);
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