
/**
 * @class Bubble handles html interaction - doubleclick, click - and movement via Drag&Drop funcionality.
 */
export default class Bubble {
    _bubble_elm;
    _text_elm;
    _selected;
    
    constructor(bubbleEl) {
        this._bubble_elm = bubbleEl;
        this._selected = false;
        this._text_elm = document.getElementById("text_" + this.id);
        this.calibrateText();
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
        document.getElementById("text_input").classList.remove("hidden");
        document.getElementById("set_text").classList.remove("hidden");
        console.log("selected " + this.id)
        this.element.setAttribute('opacity', 0.45);
        this.setAttribute('fill', 'lightgreen');
    }

    unselect() {
        this._selected = false;
        document.getElementById("text_input").classList.add("hidden");
        document.getElementById("set_text").classList.add("hidden");
        this.element.setAttribute('opacity', 1);
        this.setAttribute('fill', 'transparent');
        document.getElementById("text_input").value = '';    
    }

    setText(text) {
        this._text_elm.textContent = text;
    }

    _handleDoubleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        document.getElementById("text_input").value = this._text_elm.textContent;    
        this.select();
    }
    

    get element() {return this._bubble_elm.firstElementChild;}

    get isSelected() {return this._selected;}

    get id() {return this._bubble_elm.firstElementChild.getAttribute('id');}

    get cx() {return this._bubble_elm.firstElementChild.getAttribute('cx');}

    get rx() {return this._bubble_elm.firstElementChild.getAttribute('rx');}

    get cy() {return this._bubble_elm.firstElementChild.getAttribute('cy');}
    
    get ry() {return this._bubble_elm.firstElementChild.getAttribute('ry');}
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

    getSelectedBubble() {
        return this._bubbles.find(b => b.isSelected);
    }

    unselectAll(e = null) {
        e && e.preventDefault();        
        this._bubbles && this._bubbles.forEach(b => b.unselect());
    }

    removeEventListenerForAllBubbles(evtType, handler) {
        this.unselectAll();
        this._bubbles.forEach(b => {
            b.element.removeEventListener(evtType, handler);
            b.setAttribute('opacity', 1);
            b.setAttribute('fill', 'transparent');
        });
    }
}


export function initBubbleManager() {return new BubbleManager()}