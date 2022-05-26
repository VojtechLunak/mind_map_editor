# Mind map editor

Mind Map editor JavaScript application created for KAJ. The web app allows user to create mind maps with basic tools: *Add/remove bubble*, *Add/delete connection between bubbles*, and *Set text*. User is also able to export created mind map in png or jpg file. Saving functionality is implemented as well.

## Usage
Click button with given funcionality, then select base bubble and then final bubble (if possible), or **click somewhere else in the editor to reset**\
To add text to bubble, double click the wanted bubble to show input field in the left menu; there you write your text and submit it with the `Set text button`.\
Click `Save` button to save your current mind map; when you come back later or refresh the page, you will see your last local save.

## Requirements
- ✅ Adding + removing mind map bubbles with text
- ✅ Adding + removing connections between bubbles
- ✅ Sound error when unsupported action
- ✅ Lightweight menu
- ✅ Export to png/jpg
- ✅ Saving work in progress + check when user wants to leave/refresh page
- ❌ Export to svg (but it is available to copy directly from html)
- ❌ Import from svg
- ❌ History browser buttons reset last step

## Approach
1. Base HTML (menu buttons, svg) + Modelling logic (add/delete bubble, create/delete connection)
2. Styling (grid, colors, animations)
3. Add text in bubble logic
4. Info popup + Export slide
5. Save button + Saving logic (localStorage)
6. Final styling + Internet connection check for importing module