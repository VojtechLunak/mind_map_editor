import { initBubbleManager } from "./bubble.js";
import { initLineGenerator } from "./connectionLineGenerator.js";
import { initInfoButton, initAddBubbleButton,
  initRemoveAllBubblesButton,
 initCreateLineButton, 
 initRemoveBubbleButton,
 initDeleteLineButton,
 initExportButton,
 initSetTextButton,
 initSaveButton} from "./buttons.js";
import { initDragManager } from "./drag.js";


const bubbleManager = initBubbleManager();
const lineGenerator = initLineGenerator(bubbleManager);

if (window.navigator.onLine) {
  console.log('online');
} else {
  console.log('offline');
}

// Button logic initialization
initInfoButton("info_btn");
initExportButton("export");
initAddBubbleButton("add_bubble", bubbleManager);
initRemoveAllBubblesButton("remove_all", lineGenerator, bubbleManager);
initRemoveBubbleButton('remove_bubble', lineGenerator, bubbleManager);
initCreateLineButton("create_line", lineGenerator, bubbleManager);
initDeleteLineButton("delete_line", lineGenerator, bubbleManager);
initSetTextButton("set_text", bubbleManager);
initSaveButton("save_btn");

// Checking for save
if(localStorage.getItem('save')) {  
  document.getElementById("svg").innerHTML = localStorage.getItem("save");
  lineGenerator.loadSave();
  console.log("save loaded");
}

// Initial preparation
document.querySelector("svg").addEventListener('click', bubbleManager.unselectAll);

window.onbeforeunload = (e) => { 
  if (localStorage.getItem('save') == document.getElementById("svg").innerHTML) {
    e.preventDefault();
    return;
  }
  return 'Please save your work before leaving the page.';
}

initDragManager(lineGenerator, bubbleManager);
