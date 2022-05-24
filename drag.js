
const ns = "http://www.w3.org/2000/svg";

class DragManager {
    _svg_elm;
    _lineGenerator;
    _selectedElement = null;
    _offset = null;

    constructor(lineGenerator, bubbleManager) {
        this._lineGenerator = lineGenerator;
        this._bubbleManager = bubbleManager;
        this._svg_elm = document.getElementById("svg");
        this._svg_elm.addEventListener('load', this._makeDraggable)
    }

    _makeDraggable = e => {        
        this._svg_elm.addEventListener('mousedown', this._startDrag);
        this._svg_elm.addEventListener('mousemove', this._drag);
        this._svg_elm.addEventListener('mouseup', this._endDrag);
        this._svg_elm.addEventListener('mouseleave', this._endDrag);
    }

    _startDrag = e => {       
        if (e.target.classList.contains('draggable')) {
            this._selectedElement = e.target;
            this._offset = this._getMousePosition(e);
            this._offset.x -= parseFloat(this._selectedElement.getAttribute('cx'));
            this._offset.y -= parseFloat(this._selectedElement.getAttribute('cy'));
        }
    }

    _drag = e => {       
        if (this._selectedElement) {
            e.preventDefault();
            const mouseCoordinates = this._getMousePosition(e);
            
            this._selectedElement.setAttribute("cx", mouseCoordinates.x - this._offset.x);
            this._selectedElement.setAttribute("cy", mouseCoordinates.y - this._offset.y);
            this._bubbleManager.find(this._selectedElement.getAttribute('id')).calibrateText();            
            this._lineGenerator.render();
        }
    }

    _endDrag = e => {
        this._selectedElement = null;
    }   

    _getMousePosition = e => {
        // current transformation matrix
        const screenCTM = this._svg_elm.getScreenCTM();
        return {
            x: (e.clientX - screenCTM.e) / screenCTM.a,
            y: (e.clientY - screenCTM.f) / screenCTM.d
        };
    }
}

export function initDragManager(lineGenerator, bubbleManager) {return new DragManager(lineGenerator, bubbleManager)};