import Node from '../Node.jsx';

export default function MenuFunctionAddLower(callerID) {
    console.log("Add Lower Node function got called!");
    let _callerNode = document.getElementById(callerID);
    let _callerNodeSpecs = _callerNode.getClientRects()[0];

    console.log("_callerNodeSpecs: ");
    console.dir(_callerNodeSpecs);


    /**TODO: 
     * 1. add child node
     * 2. move to right position
     * 3. make a curve line connect parent node and child node
     *  
     * */
}