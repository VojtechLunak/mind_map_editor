const bubbleHeight = 120;
const bubbleWidth = 160;

/**
 * @class Line generates svg <path> tag that connects two bubbles and computes its movement based on bubble dragging and dropping.
 */
class Line {
    _bubble1;
    _bubble2;
    _line_html;
    _line_id;

    constructor(bubble1, bubble2) {
        this._bubble1 = bubble1;
        this._bubble2 = bubble2;
        this._line_id = (this._bubble1.getAttribute('id') + "-" + this._bubble2.getAttribute('id') + "-line").toString();
        this._renderLine();
    }

    _renderLine() {
        let x1, x2, y1, y2;

        const b1x = parseInt(this._bubble1.getAttribute('cx'));
        const b1y = parseInt(this._bubble1.getAttribute('cy'));
        const b1rx = parseInt(this._bubble1.getAttribute('rx'));
        const b1ry = parseInt(this._bubble1.getAttribute('ry'));

        const b2x = parseInt(this._bubble2.getAttribute('cx'));
        const b2y = parseInt(this._bubble2.getAttribute('cy'));
        const b2rx = parseInt(this._bubble2.getAttribute('rx'));
        const b2ry = parseInt(this._bubble2.getAttribute('ry'));

        const line = document.getElementById(this._line_id);
        if (line)
            line.remove();

        if (Math.abs(b1x - b2x) <= bubbleWidth && Math.abs(b1y - b2y) <= bubbleHeight) {
            console.error(`Invalid bubble possitions to draw line: ${this._bubble1.getAttribute('id')} {x:${b1x}, y:${b1y}},
                ${this._bubble2.getAttribute('id')} { x:${b2x}, y:${b2y}}!`);
            return;
        }

        //bubble1 is on left
        if (b1x <= b2x) {
            //bubble1 is on left up
            if (b1y < b2y) {
                if (Math.abs(b1x - b2x) > 200) {
                    if (Math.abs(b1y - b2y) > bubbleHeight*2) {
                        x1 = b1x;
                        y1 = b1y + b1ry;
                        x2 = b2x;
                        y2 = b2y - b2ry;
                    } else {
                        x1 = b1x + b1rx;
                        y1 = b1y;
                        x2 = b2x - b2rx;
                        y2 = b2y;
                    }
                } else {
                    if (Math.abs(b1y - b2y) <= bubbleHeight) {
                        x1 = b1x + b1rx;
                        y1 = b1y;
                        x2 = b2x - b2rx;
                        y2 = b2y;
                    } else {
                        x1 = b1x;
                        y1 = b1y + b1ry;
                        x2 = b2x;
                        y2 = b2y - b2ry;
                    }
                }                
            } else { //bubble1 is left down
                if (Math.abs(b1x - b2x) > 200) {
                    if (Math.abs(b1y - b2y) > bubbleHeight*2) {
                        x1 = b1x;
                        y1 = b1y - b1ry;
                        x2 = b2x;
                        y2 = b2y + b2ry;
                    } else {
                        x1 = b1x + b1rx;
                        y1 = b1y;
                        x2 = b2x - b2rx;
                        y2 = b2y;
                    }
                } else {
                    if (Math.abs(b1y - b2y) <= bubbleHeight) {
                        x1 = b1x + b1rx;
                        y1 = b1y;
                        x2 = b2x - b2rx;
                        y2 = b2y;
                    } else {
                        x1 = b1x;
                        y1 = b1y - b1ry;
                        x2 = b2x;
                        y2 = b2y + b2ry;
                    }
                }
            }
        } else {//bubble is on right
            //bubble1 is on right up
            if (b1y < b2y) {
                if (Math.abs(b1x - b2x) > 200) {
                    if (Math.abs(b1y - b2y) > bubbleHeight*2) {
                        x1 = b1x;
                        y1 = b1y + b1ry;
                        x2 = b2x;
                        y2 = b2y - b2ry;
                    } else {
                        x1 = b1x - b1rx;
                        y1 = b1y;
                        x2 = b2x + b2rx;
                        y2 = b2y;
                    }
                } else {
                    if (Math.abs(b1y - b2y) <= bubbleHeight) {
                        x1 = b1x - b1rx;
                        y1 = b1y;
                        x2 = b2x + b2rx;
                        y2 = b2y;
                    } else {
                        x1 = b1x;
                        y1 = b1y + b1ry;
                        x2 = b2x;
                        y2 = b2y - b2ry;
                    }
                }                
            } else { //bubble1 is on right down
                if (Math.abs(b1x - b2x) >= 200) {
                    if (Math.abs(b1y - b2y) > bubbleHeight*2) {
                        x1 = b1x;
                        y1 = b1y - b1ry;
                        x2 = b2x;
                        y2 = b2y + b2ry;
                    } else {
                        x1 = b1x - b1rx;
                        y1 = b1y;
                        x2 = b2x + b2rx;
                        y2 = b2y;
                    }
                } else {
                    if (Math.abs(b1y - b2y) < bubbleHeight) {
                        x1 = b1x - b1rx;
                        y1 = b1y;
                        x2 = b2x + b2rx;
                        y2 = b2y;
                    } else {
                        x1 = b1x;
                        y1 = b1y - b1ry;
                        x2 = b2x;
                        y2 = b2y + b2ry;
                    }
                }
            }
        }      

        this._line_html = `<line id="${this._line_id}" x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}"
             stroke="black" stroke-width="3"/>`;
        //this._bubble2.element.insertAdjacentHTML('afterend', this._line_html);
        document.getElementById(this._bubble2.id).insertAdjacentHTML('afterend', this._line_html);
    }

    getHTML() {
        return this._line_html;
    }

    getId() {return this._line_id}

    get id() {return this._line_id}    
    get bubble1() {return this._bubble1}
    get bubble2() {return this._bubble2}
}

import { setCounter } from './buttons.js';

/**
 * @class LineGenerator handles all logic regarding line management.
 * @property _bubbleManager for its information about all bubbles.
 */
class LineGenerator {
    _lines;
    _bubbleManager;
    
    constructor(bubbleManager) {
        this._lines = new Array();
        this._bubbleManager = bubbleManager;
    }

    addLineBetween(bubble1Id, bubble2Id) {
        const b1 = this._bubbleManager.find(bubble1Id);
        const b2 = this._bubbleManager.find(bubble2Id);

        if (b1 == null || b2 == null || b1 == b2) {
            console.error(`Invalid bubbles to connect with line. Bubble's IDs: ${bubble1Id}, ${bubble2Id}`);
            return;
        }           

        if (!this._lines.find(ln => {
            //if bubbles already connected with line
            if ((ln.bubble1.id == bubble1Id && ln.bubble2.id == bubble2Id)
                || (ln.bubble1.id == bubble2Id && ln.bubble2.id == bubble1Id)) {
                return true;
            }
            return false;
        })) {
            const line = new Line(b1, b2);
            this._lines.push(line);
        }
    }

    loadSave() {        
        const bubbleGroups = document.querySelectorAll('g');

        bubbleGroups.forEach(group => {
            this._bubbleManager.add(group);            
        });

        setCounter(this._bubbleManager.getFirstAvailableId());

        bubbleGroups.forEach(group => {
            if (group.querySelector('line')) {
                const line = group.querySelector('line');
                const id1 = line.getAttribute('id').split('-')[0];
                const id2 = line.getAttribute('id').split('-')[1];                
                this.addLineBetween(id1, id2);
            }            
        });
    }

    render() {
        this._lines.forEach(line => line._renderLine());
    }

    findAllLinesForBubble(bubbleId) {
        return this._lines.filter(ln => ln.bubble1.id == bubbleId || ln.bubble2.id == bubbleId);
    }

    removeLineBetween(bubble1Id, bubble2Id) {
        let line = this._lines.find(ln => ((ln.bubble1.id == bubble1Id && ln.bubble2.id == bubble2Id) || (ln.bubble2.id == bubble1Id && ln.bubble1.id == bubble2Id)));
        document.getElementById(line.id).remove();
        this._lines = this._lines.filter(ln => ln.id != line.id);        
    }

    removeLinesForBubble(bubbleId) {
        this.findAllLinesForBubble(bubbleId).forEach(line => document.getElementById(line.id).remove());               
        this._lines = this._lines.filter(ln => ln.bubble1.id != bubbleId && ln.bubble2.id != bubbleId);
    }

    get lines() {
        return this._lines;
    }

}

export function initLineGenerator(bubbleManager) {return new LineGenerator(bubbleManager)};