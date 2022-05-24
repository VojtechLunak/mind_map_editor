import { Canvg } from 'https://cdn.skypack.dev/canvg';

let idCounter = 1;
let actionInProgress = false;
let infoSelected = false;
let exportSelected = false;

/**
 * @class Button has button property and _onClick base method.
 * @property _btn_elm is the html button element. 
 */
class Button {
    _btn_elm;

    constructor(buttonId) {
        this._btn_elm = document.getElementById(buttonId);
    }

    _onClick(e) {
        e.preventDefault();
    }
}

/**
 * @class ExportButton handles download and its setting. 
 * @extends Button for its base setting and preventingDefault.
 */
class ExportButton extends Button {
    _export_hmtl_text = `
    <section id="export_section">
    <select id="export_type" name="export">
        <option value="png">png</option>
        <option value="jpg">jpg</option>
    </select> <button id="download_btn">Download</button>
    <section>`;
    
    constructor(buttonId) {
        super(buttonId);
        this._btn_elm.addEventListener('click', this._onClick);
    }

    _onClick = e => {
        super._onClick(e);

        let popup = document.getElementById("placeholder");
        if (popup.innerHTML === "") {       
            this._btn_elm.style.backgroundColor = "lightgreen";
            exportSelected = true;
            popup.innerHTML = this._export_hmtl_text;
        } else {
            if (infoSelected) {
                document.getElementById("info_btn").style.backgroundColor = "";
            }
            this._btn_elm.style.backgroundColor = "";
            popup.innerHTML = "";
            exportSelected = false;
        }       
       
        const button = document.getElementById("download_btn");

        if (button)
            button.addEventListener('click', this._handleDownloadButtonClick);        
    }

    _handleDownloadButtonClick = (e) => {
        //using library canvg to create canvas from svg and then export it to png/jpg.
        const canvas = document.createElement('canvas');
        canvas.style.visibility = "hidden";
        const ctx = canvas.getContext('2d');

        let v = Canvg.fromString(ctx, document.getElementById('svg').outerHTML); 
        v.start();

        const now = new Date();
        const offsetMs = now.getTimezoneOffset() * 60 * 1000;
        const dateLocal = new Date(now.getTime() - offsetMs);
        const str = dateLocal.toISOString().slice(0, 16).replace(/-/g, "/").replace("T", "_");     

        let img;
        let link = document.createElement('a');

        if (document.getElementById("export_type").value == "png") {
            img = canvas.toDataURL('image/png');
            link.download = 'export' + str + '.png';
        } else {
            img = canvas.toDataURL('image/jpg');
            link.download = 'export' + str + '.jpg';
        }

        const i = document.createElement('img');
        i.classList.add("hidden");
        i.setAttribute('src', img );
        document.querySelector("body").appendChild(i);          
       
        link.href = document.querySelector("img").src;
        link.click();
        document.querySelector('img').remove();
    }
}

export function initExportButton(buttonId) {return new ExportButton(buttonId)}

/**
 * @class InfoButton shows info paragraph when clicked and hides it when clicked again. 
 * @extends Button for its base setting and preventingDefault.
 */
class InfoButton extends Button {
    _info_hmtl_text = `<p id="info">Mind map editor - KAJ is a client javascript application that is
    used for mind map modelling by adding, naming and connecting 'bubbles'. This project was
    created by Vojtěch Luňák for KAJ.<br><br>
    <i><u>usage:</u> click button with given funcionality, then select base bubble and then final bubble (if possible), or click somewhere else in the editor to reset;
    <br>
    to add text to bubble, double click it to show input field in the left menu; there you write your text and submit it with the Set text button
    </i></p>`;

    constructor(buttonId) {
        super(buttonId);
        this._btn_elm.addEventListener('click', this._onClick);
    }

    _onClick = e => {
        super._onClick(e);

        let popup = document.getElementById("placeholder");
        if (popup.innerHTML === "") {
            this._btn_elm.style.backgroundColor = "lightgreen";

            infoSelected = true;
            popup.innerHTML = this._info_hmtl_text;
        } else {
            this._btn_elm.style.backgroundColor = "";
            if (exportSelected) {
                document.getElementById("export").style.backgroundColor = "";
            }
            popup.innerHTML = "";
            infoSelected = false;
        }
    }
}

export function initInfoButton(buttonId) {return new InfoButton(buttonId)};

/**
 * @class BubbleManagingButton has basic funcionalities and properties for working with bubbles. 
 * @extends Button for its base setting and preventingDefault.
 */
class BubbleManagingButton extends Button {
    _svg_elm;
    _bubbleManager;

    constructor(buttonId, bubbleManager) {
        super(buttonId);
        this._bubbleManager = bubbleManager;
        this._svg_elm = document.getElementById("svg");
    }
    
    _onClick = e => {
        e.preventDefault();
        this._bubbleManager.unselectAll();
    }
}

/**
 * @class AddBubbleButton handles bubble adding, generating html into svg tag. 
 * @extends BubbleManagingButton because it needs the access to bubble "database".
 */
class AddBubbleButton extends BubbleManagingButton {

    constructor(buttonId, bubbleManager) {
        super(buttonId, bubbleManager);
        this._btn_elm.addEventListener('click', this._onClick);
    }

    _onClick = e => {
        super._onClick(e);

        const nextBubble =  this._getNextBubbleHTML();
        this._svg_elm.insertAdjacentHTML('beforeend', nextBubble);
        this._bubbleManager.add(this._svg_elm.lastChild);
        idCounter++;
    }

    _getNextBubbleHTML() {
        return `
        <g>
        <ellipse id="bub${idCounter}" class="draggable" cx="${100 + Math.floor(Math.random() * 400)}" cy="${350 + Math.floor(Math.random() * 150)}" rx="80" ry="60" stroke="black" fill="transparent" stroke-width="4"></ellipse>
        <text id="text_bub${idCounter}" x="240" y="160" font-family="Verdana" font-size="20" fill="black"></text>
        </g>`;
    }
}

export function initAddBubbleButton(buttonId, bubbleManager) {return new AddBubbleButton(buttonId, bubbleManager)};

/**
 * @class RemoveBubbleButton represents all interactivity and logic for removing one bubble with additional checks for line removal when necessary. 
 * @extends BubbleManagingButton because it needs the access to bubble "database".
 * @constructor Takes also LineGenerator as argument, in order to execute line logic.
 */
class RemoveBubbleButton extends BubbleManagingButton {
    _lineGenerator;

    constructor(buttonId, lineGenerator, bubbleManager) {
        super(buttonId, bubbleManager);
        this._lineGenerator = lineGenerator;
        this._btn_elm.addEventListener('click', this._onClick);
        this._svg_elm.addEventListener('dblclick', this._resetView);
        this._svg_elm.addEventListener('click', this._resetView);
    }

    _onClick = e => {
        super._onClick(e);
        e.stopPropagation();

        if (actionInProgress) {
            return;
        }

        actionInProgress = true;

        let bubbles = this._bubbleManager.get();

        bubbles.forEach(b => {
            b.setAttribute('opacity', 0.4);
            b.setAttribute('fill', 'red');
            b.element.addEventListener('click', this._clickOnBubble);
        });       
    }

    _resetView = e => {
        e.preventDefault();        
        console.log("reset remove");
        actionInProgress = false;

        this._bubbleManager.removeEventListenerForAllBubbles('click', this._clickOnBubble);
    }


    _clickOnBubble = e => {
        e.preventDefault();
        e.stopPropagation();

        const bubbleToRemove = this._bubbleManager.find(e.target.getAttribute('id'));
        this._lineGenerator.removeLinesForBubble(bubbleToRemove.id);
        this._bubbleManager.remove(bubbleToRemove.id);
        //idCounter--;

        this._bubbleManager.removeEventListenerForAllBubbles('click', this._clickOnBubble);
        actionInProgress = false;
    }
}

export function initRemoveBubbleButton(buttonId, lineGenerator, bubbleManager) {return new RemoveBubbleButton(buttonId, lineGenerator, bubbleManager)};

/**
 * @class RemoveAllBubblesButton represents all interactivity and logic for removing all bubbles from the svg plane. 
 * @extends BubbleManagingButton because it needs the access to bubble "database".
 * @constructor Takes also LineGenerator as argument, in order to execute line logic.
 */
class RemoveAllBubblesButton extends BubbleManagingButton {
    _lineGenerator;

    constructor(buttonId, lineGenerator, bubbleManager) {
        super(buttonId, bubbleManager);
        this._lineGenerator = lineGenerator;
        this._btn_elm.addEventListener('click', this._onClick);
    }

    _onClick = e => {
        super._onClick(e);      

        this._bubbleManager.get().forEach(bubble => {
            this._lineGenerator.removeLinesForBubble(bubble.id);
            this._bubbleManager.remove(bubble.id);
        })

       // idCounter = 1;
    }
}

export function initRemoveAllBubblesButton(buttonId, lineGenerator, bubbleManager) {return new RemoveAllBubblesButton(buttonId, lineGenerator, bubbleManager)};

/**
 * @class SetTextButton represents all interactivity and logic for adding/modifying text to bubble. 
 * @extends BubbleManagingButton because it needs the access to bubble "database".
 */
class SetTextButton extends BubbleManagingButton {
    constructor(buttonId, bubbleManager) {
        super(buttonId, bubbleManager);
        this._btn_elm.addEventListener('click', this._onClick);
    }

    _onClick = e => {
        super._onClick(e);      

        const selectedBubble = this._bubbleManager.getSelectedBubble();
        console.log(selectedBubble);
        if (!selectedBubble) {
            alert("Select bubble by doubleclick before trying to add text.");
            return;
        }

        const textInput = document.getElementById("text_input");
        selectedBubble.setText(textInput.value);
        selectedBubble.unselect();
    }
}

export function initSetTextButton(buttonId, bubbleManager) {return new SetTextButton(buttonId, bubbleManager);}

/**
 * @class CreateLineButton represents all interactivity a logic for creating line between two bubbles. 
 * @extends BubbleManagingButton because it needs the access to bubble "database".
 * @constructor Takes also LineGenerator as argument, in order to execute line logic.
 */
class CreateLineButton extends BubbleManagingButton {
    _lineGenerator;
    _firstSelectedBubble;

    constructor(buttonId, lineGenerator, bubbleManager) {
        super(buttonId, bubbleManager);
        this._lineGenerator = lineGenerator;
        this._btn_elm.addEventListener('click', this._onClick);
        this._svg_elm.addEventListener('dblclick', this._resetView);
        this._svg_elm.addEventListener('click', this._resetView);
    }

    _onClick = e => {
        super._onClick(e);

        if (actionInProgress) {
            return;
        }
        
        actionInProgress = true;
        let bubbles = this._bubbleManager.get();

        bubbles.forEach(b => {
            b.setAttribute('opacity', 0.4);
            b.setAttribute('fill', 'green');
            b.element.addEventListener('click', this._firstClickOnBubble);
        });       
    }

    _resetView = e => {
        e.preventDefault();
        console.log("reset create");
        actionInProgress = false;

        this._bubbleManager.removeEventListenerForAllBubbles('click', this._firstClickOnBubble);
        this._bubbleManager.removeEventListenerForAllBubbles('click', this._secondClickOnAnotherBubble);
        this._bubbleManager.removeEventListenerForAllBubbles('click', playError);
    }

    _firstClickOnBubble = e => {
        e.preventDefault();

        this._firstSelectedBubble = this._bubbleManager.find(e.target.getAttribute('id'));

        let unavailableLines = this._lineGenerator.lines.filter(line => {
            if (line.bubble1.id == this._firstSelectedBubble.id || line.bubble2.id == this._firstSelectedBubble.id) {
                return true;
            }
            return false;
        })


        let unaviableBubblesToConnectTo = new Array();
        unavailableLines.forEach(l => unaviableBubblesToConnectTo.push(l.bubble1, l.bubble2));
        unaviableBubblesToConnectTo.forEach(b => b.element.addEventListener('click', playError));

        let allViableBubbles = this._bubbleManager.get();

        allViableBubbles = allViableBubbles.filter(b => {
            if (b.id != this._firstSelectedBubble.id && !unaviableBubblesToConnectTo.find(bub => bub.id == b.id))
                return true;
            return false;
        });

        this._bubbleManager.removeEventListenerForAllBubbles('click', this._firstClickOnBubble);

        if (allViableBubbles.length == 0) {
            playError(e)
            this._resetView(e);
            return;
        }            

        allViableBubbles.forEach(b => {
            b.setAttribute('opacity', 0.55);
            b.setAttribute('fill', 'cornflowerblue');
            b.element.addEventListener('click', this._secondClickOnAnotherBubble);
        });   
    }

    _secondClickOnAnotherBubble = e => {
        e.preventDefault();
        actionInProgress = false;
        this._lineGenerator.addLineBetween(this._firstSelectedBubble.id, e.target.getAttribute('id'));
        this._bubbleManager.removeEventListenerForAllBubbles('click', this._secondClickOnAnotherBubble);
        this._bubbleManager.removeEventListenerForAllBubbles('click', playError);
    }
}

export function initCreateLineButton(buttonId, lineGenerator, bubbleManager) {return new CreateLineButton(buttonId, lineGenerator, bubbleManager)}

class DeleteLineButton extends BubbleManagingButton {
    _lineGenerator;
    _firstSelectedBubble;

    constructor(buttonId, lineGenerator, bubbleManager) {
        super(buttonId, bubbleManager);
        this._lineGenerator = lineGenerator;
        this._btn_elm.addEventListener('click', this._onClick);
        this._svg_elm.addEventListener('dblclick', this._resetView);
        this._svg_elm.addEventListener('click', this._resetView);
    }

    _resetView = e => {
        e.preventDefault();
        console.log("reset delete line");
        actionInProgress = false;

        this._bubbleManager.removeEventListenerForAllBubbles('click', this._firstClickOnBubble);
        this._bubbleManager.removeEventListenerForAllBubbles('click', this._secondClickOnAnotherBubble);
        this._bubbleManager.removeEventListenerForAllBubbles('click', playError);
    }

    _onClick = e => {
        super._onClick(e);

        if (actionInProgress || this._lineGenerator.lines.length == 0) {
            return;
        }

        actionInProgress = true;

        this._lineGenerator.lines.forEach(ln => {
            ln.bubble1.setAttribute('opacity', 0.45);
            ln.bubble2.setAttribute('opacity', 0.45);
            ln.bubble1.setAttribute('fill', 'grey');
            ln.bubble2.setAttribute('fill', 'grey');

            ln.bubble1.element.removeEventListener('click', this._firstClickOnBubble);
            ln.bubble2.element.removeEventListener('click', this._firstClickOnBubble);

            ln.bubble1.element.addEventListener('click', this._firstClickOnBubble);
            ln.bubble2.element.addEventListener('click', this._firstClickOnBubble);
        });
    }

    _firstClickOnBubble = e => {
        e.preventDefault();

        this._firstSelectedBubble = this._bubbleManager.find(e.target.getAttribute('id'));
        this._firstSelectedBubble.element.addEventListener('click', playError);

        const allLinesForSelectedBubble = this._lineGenerator.findAllLinesForBubble(this._firstSelectedBubble.id);

        this._bubbleManager.removeEventListenerForAllBubbles('click', this._firstClickOnBubble);

        const allViableBubblesToDelete = new Array();
        allLinesForSelectedBubble.forEach(l => allViableBubblesToDelete.push(l.bubble1) && allViableBubblesToDelete.push(l.bubble2));

        const unconnectedBubbles = this._bubbleManager.get().filter(b => allViableBubblesToDelete.filter(viableBub => b.id === viableBub.id).length === 0);

        unconnectedBubbles.forEach(b => b.element.addEventListener('click', playError));

        allLinesForSelectedBubble.forEach(line => {
            if (line.bubble1.id == this._firstSelectedBubble.id) {
                line.bubble2.setAttribute('opacity', 0.6);
                line.bubble2.setAttribute('fill', 'black');
                line.bubble2.element.addEventListener('click', this._secondClickOnAnotherBubble);
            } else {
                line.bubble1.setAttribute('opacity', 0.6);
                line.bubble1.setAttribute('fill', 'black');
                line.bubble1.element.addEventListener('click', this._secondClickOnAnotherBubble);
            }
        });
    }

    _secondClickOnAnotherBubble = e => {
        e.preventDefault();
        actionInProgress = false;

        this._lineGenerator.removeLineBetween(this._firstSelectedBubble.id, e.target.getAttribute('id'));
        this._bubbleManager.removeEventListenerForAllBubbles('click', this._secondClickOnAnotherBubble);
        this._bubbleManager.removeEventListenerForAllBubbles('click', playError);        
    }
}

const playError = (e) => {
    e.preventDefault();
    new Audio("error.mp3").play();
}

export function initDeleteLineButton(buttonId, lineGenerator, bubbleManager) {return new DeleteLineButton(buttonId, lineGenerator, bubbleManager)};