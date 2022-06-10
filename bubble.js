
/**
 * @class Bubble handles html interaction - doubleclick, click - and movement via Drag&Drop funcionality.
 */
export default class Bubble {
    //is the group containing ellipse and text svg
    _bubble_elm;
    _text_elm;
    _selected;
    _color;
    
    constructor(bubbleEl) {
        this._bubble_elm = bubbleEl;
        this._selected = false;
        this._text_elm = document.getElementById("text_" + this.id);
        this.calibrateText();
        this._color = this.getAttribute("fill");
        if (this._color === "transparent") this._color = "none";
        //firstElementChild is the ellipse
        this._bubble_elm.addEventListener('dblclick', this._handleDoubleClick);
        this._bubble_elm.addEventListener('click', e => e.stopPropagation());
    }

    calibrateText() {
        this.setTextAttribute('x', this.getAttribute("cx")-60);
        this.setTextAttribute('y', this.getAttribute("cy"));
    }


    setTextAttribute(attr, value) {
        this._text_elm.setAttribute(attr, value);
    }

    getTextAttribute(attr, value) {
        return this._text_elm.getAttribute(attr, value);
    }
    

    setAttribute(attr, value) {        
        this._bubble_elm.firstElementChild.setAttribute(attr, value);
    }

    getAttribute(attr) {
        return this._bubble_elm.firstElementChild.getAttribute(attr);
    }

    remove() {
        this._bubble_elm.remove();
    }

    select() {
        this._selected = true;
        document.getElementById("selected_container").classList.remove("hidden");
        console.log("selected " + this.id)
        this.element.setAttribute('opacity', 0.45);
        this.setAttribute('fill', 'lightgreen');
        switch (this._color) {
            case "none": document.getElementById("none").checked = true;
                break;            
            case "blue": document.getElementById("blue").checked = true;
                break;
            case "yellow": document.getElementById("yellow").checked = true;
                break;
            case "green": document.getElementById("green").checked = true;
                break;        
        }
    }

    unselect(bubbleId = "") {
        this._selected = false;
        document.getElementById("selected_container").classList.add("hidden");
        document.getElementById("text_input").value = '';
        if (this._color === "none") {
            this.element.setAttribute('opacity', 1);
            this.setAttribute('fill', 'transparent');            
        }
       
        if (bubbleId === this.id)  {   
            if (document.getElementById("none").checked)
                this._color = "none";
            if (document.getElementById("blue").checked) {
                this._color = "blue";
                this.setAttribute('fill', 'blue');
                this.setAttribute("opacity", 0.5);
            }
            if (document.getElementById("yellow").checked) {
                this._color = "yellow";
                this.setAttribute("fill", "yellow");
                this.setAttribute("opacity", 0.5);
            }
            if (document.getElementById("green").checked) {
                this._color = "green";
                this.setAttribute("fill", "green");
                this.setAttribute("opacity", 0.5);
            }
        }
    }

    setText(text) {
        this._text_elm.textContent = text;
    }

    recolorize = () => {
        switch (this._color) {
            case "none":
                this.element.setAttribute('opacity', 1);
                this.setAttribute('fill', 'transparent');           
                break;            
            case "blue":
                this.setAttribute('fill', 'blue');
                this.setAttribute("opacity", 0.5);
                break;
            case "yellow":
                this.setAttribute("fill", "yellow");
                this.setAttribute("opacity", 0.5);
                break;
            case "green":
                this.setAttribute("fill", "green");
                this.setAttribute("opacity", 0.5);
                break;        
        }
    }

    _handleDoubleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        document.getElementById("text_input").value = this._text_elm.textContent;    
        this.select();
    }
    

    /**
     *  Returns the ellipse element
     */
    get element() {return this._bubble_elm.firstElementChild;}

    get isSelected() {return this._selected;}

    get id() {return this._bubble_elm.firstElementChild.getAttribute('id');}

    get cx() {return this._bubble_elm.firstElementChild.getAttribute('cx');}

    get rx() {return this._bubble_elm.firstElementChild.getAttribute('rx');}

    get cy() {return this._bubble_elm.firstElementChild.getAttribute('cy');}
    
    get ry() {return this._bubble_elm.firstElementChild.getAttribute('ry');}
    
    get color() {return this._color;}
}


/**
 * @class BubbleManager is the main database of all bubbles with only little logic.
 * @property _bubbles is an array of all bubbles present in application.
 */
class BubbleManager {
    _bubbles;

    constructor() {
        this._bubbles = new Array();
    }

    add(...bubble) {
        bubble.forEach(b => b != null && !this.find(b.getAttribute('id')) && this._bubbles.push(new Bubble(b)));
    }

    remove(id) {
        this.find(id).remove();
        this._bubbles = this._bubbles.filter(b => b.id != id);
    }

    find(bubbleId) {
        return this._bubbles.find(b => b.getAttribute('id') == bubbleId);
    }

    get() {
        return this._bubbles;
    }

    getFirstAvailableId() {
        let tempMax = 1;
        this._bubbles.forEach(bubble => {
            if (parseInt(bubble.id.substring(3)) > tempMax)
                tempMax = parseInt(bubble.id.substring(3));
        })
        return tempMax + 1;
    }

    getSelectedBubble = () => {
        return this._bubbles.find(b => b.isSelected);
    }

    unselectAll = (e = null) => {
        e && e.preventDefault();
        const selected = this._bubbles.find(b => b.isSelected == true);
        let id = "";
        if (selected) id = selected.id; 
        this._bubbles && this._bubbles.forEach(b => b.unselect(id));
        this.recolorize();
    }

    recolorize = () => {
        this._bubbles.forEach(b => b.recolorize());
    }

    removeEventListenerForAllBubbles(evtType, handler) {
        this.unselectAll();
        this._bubbles.forEach(b => {
            b.element.removeEventListener(evtType, handler);
            if (b._color === "none") {
                b.setAttribute('opacity', 1);
                b.setAttribute('fill', 'transparent');
            }
        });
    }
}


export function initBubbleManager() {return new BubbleManager()}