//global Elements
const windowDiv = document.querySelector(".window")
const d = new Date();
let Folders = []
let foldersObj = {
    folderId : "",        
    folderName : "",
    childrens: [],
    createdAt : ""
}
// all menus
const contextMenuHTML = () =>`
 <ul>
  <li><i style="color:#74c0fc;" class="fa-solid fa-eye"></i> View</li>
  <li><i style="color:#63e6be;" class="fa-solid fa-arrow-down-wide-short"></i> Sort by</li>
  <li id="refreshPage"><i style="color:#51cf66;" class="fa-solid fa-rotate"></i> Refresh</li>

  <li class="divider"></li>

  <li id="createFolderBtn"><i style="color:#ffd43b;"  class="fa-solid fa-folder-plus"></i> New Folder</li>

  <li class="divider"></li>

  <li><i style="color:#9775fa;" class="fa-solid fa-palette"></i> Personalize</li>

  <li class="divider"></li>

  <li><i style="color:#ffa94d;" class="fa-solid fa-circle-info"></i> Properties</li>
</ul>
`
const folderUi = (name = "New Folder") => `
  <div class="folder">
    
    <div class="folder-icon">
      <i class="fa-solid fa-folder"></i>
    </div>

    <div class="folder-name" contenteditable="false">
      ${name}
    </div>

  </div>
`;



function closeOpenedMenu(e) {
   if(e) e.preventDefault();
    const oldMenu = document.querySelector(".contextMenu");
    if (oldMenu) oldMenu.remove();
}
function createContextMenu(e) {
    e.preventDefault();
    const oldMenu = document.querySelector(".contextMenu");
    if (oldMenu) oldMenu.remove();
    const contextMenu = document.createElement('div');
    contextMenu.classList.add("contextMenu");
    contextMenu.id = "contextMenu"
    contextMenu.style.display = "block"
    contextMenu.innerHTML = contextMenuHTML();
    document.body.appendChild(contextMenu);
    contextMenu.style.left = e.clientX + "px";
    contextMenu.style.top = e.clientY + "px";
    contextMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });
    let createFolderBtn = contextMenu.querySelector("#createFolderBtn");
    let refreshPageBtn = contextMenu.querySelector("#refreshPage");
    refreshPageBtn.addEventListener("click",(e)=> window.location.reload())
    createFolderBtn.addEventListener("click", (e2) => {
        recursivelyCreateFolders(e2, '');
    });

}
function selectText(element) {
    const range = document.createRange();
    range.selectNodeContents(element);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function recursivelyCreateFolders(event, folderId) {
    if (folderId == '') {
        let folder = document.createElement("div");
        folder.classList.add("folder")
        folder.id = id();
        folder.innerHTML = folderUi();
        windowDiv.appendChild(folder);
        let folderName = folder.querySelector(".folder-name");
        folderName.setAttribute("contentEditable","true");
        selectText(folderName);
        folderName.focus()
        closeOpenedMenu();
        saveFolders(folder.id,folderName.innerText);
    }

}
const createAtfnc = () => {
    const d = new Date(Date.now());

    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} (${hours}:${minutes})`;
};

function saveFolders(folderId,folderName){
    foldersObj.folderId = folderId,
    foldersObj.folderName = folderName,
    foldersObj.createdAt = createAtfnc();
    Folders.push(foldersObj);
    localStorage.setItem("Folders",JSON.stringify(Folders));
    
}
//utility functions
const id = () => `Fid-${Math.random(Date.now() * 1030240300)}`;
//eventlistners
document.body.addEventListener("contextmenu", createContextMenu);
document.body.addEventListener("click", closeOpenedMenu)


