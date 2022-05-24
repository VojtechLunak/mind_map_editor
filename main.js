import { initBubbleManager } from "./bubble.js";

const bubbleManager = initBubbleManager();

import { initLineGenerator } from "./connectionLineGenerator.js";

const lineGenerator = initLineGenerator(bubbleManager);
let ecl1 = document.getElementById("bubble1");
let ecl2 = document.getElementById("bubble2");
bubbleManager.add(ecl1, ecl2);

if (navigator.onLine) {
    console.log('online');
  } else {
    console.log('offline');
  }

//lineGenerator.addLineBetween(ecl1.getAttribute('id'), ecl2.getAttribute('id'));

import { initInfoButton, initAddBubbleButton,
     initRemoveAllBubblesButton,
    initCreateLineButton, 
    initRemoveBubbleButton,
    initDeleteLineButton,
    initExportButton,
    initSetTextButton} from "./buttons.js";

initInfoButton("info_btn");
initExportButton("export");
initAddBubbleButton("add_bubble", bubbleManager);
initRemoveAllBubblesButton("remove_all", lineGenerator, bubbleManager);
initRemoveBubbleButton('remove_bubble', lineGenerator, bubbleManager);
initCreateLineButton("create_line", lineGenerator, bubbleManager);
initDeleteLineButton("delete_line", lineGenerator, bubbleManager);
initSetTextButton("set_text", bubbleManager);

document.querySelector("svg").addEventListener('click', bubbleManager.unselectAll);





//import { initMoveBubble } from "./move.js";
//initMoveBubble(lineGenerator);

import { initDragManager } from "./drag.js";
initDragManager(lineGenerator, bubbleManager);
