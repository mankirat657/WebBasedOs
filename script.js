//global Elements
const windowDiv = document.querySelector(".window")
const d = new Date();
let Folders = []

// all menus
const contextMenuHTML = () => `
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
const folderOptions = () => `
  <ul class="folder-menu">
    <li class="menu-item" id="openFolder">
      <i class="fa-solid fa-folder-open"></i>
      <span>Open</span>
    </li>

    <li class="menu-item" id="renameFolder">
      <i class="fa-solid fa-pen"></i>
      <span>Rename</span>
    </li>

    <li class="menu-item delete" id="deleteFolder">
      <i class="fa-solid fa-trash"></i>
      <span>Delete</span>
    </li>

    <li class="divider"></li>

    <li class="menu-item" id="propertiesFolder">
      <i class="fa-solid fa-circle-info"></i>
      <span>Properties</span>
    </li>
  </ul>
`;
const recursiveFolderOptions = () => `
  
    <ul>
      <li data-action="new-folder">
        <i class="fa-solid fa-folder-plus new-folder"></i>
        <span>Create Folder</span>
      </li>

      <li data-action="rename">
        <i class="fa-solid fa-pen rename"></i>
        <span>Rename</span>
      </li>

      <li data-action="delete">
        <i class="fa-solid fa-trash delete"></i>
        <span>Delete</span>
      </li>

      <li data-action="properties">
        <i class="fa-solid fa-circle-info properties"></i>
        <span>Properties</span>
      </li>
    </ul>
`;

const folderUi = (name = "New Folder") => `
    
    <div class="folder-icon">
      <i class="fa-solid fa-folder"></i>
    </div>

    <div class="folder-name" contenteditable="false">
      ${name}
    </div>

`;
const folderOpenUi = (folderName = "New Folder",createdAt) => `
 
    <div class="folder-header">
      <div class="folder-title">
        <i style="color:#ffd43b;" class="fa-solid fa-folder"></i>
        <span>${folderName}</span>
      </div>
      <div class="folder-controls">
        <button class="minimize-btn" title="Minimize">—</button>
        <button id="maximizeBtn" class="maximize-btn" title="Maximize">🗖</button>
        <button id="closeFolderBtn" class="close-btn" title="Close">✕</button>
      </div>
    </div>
    <div class="folder-body">
     
    </div>
   <div class="folderInfo">
  <div class="info-item">
    <span class="label">📁 Name</span>
    <span class="value">${folderName}</span>
  </div>

  <div class="info-item">
    <span class="label">🗓 Created</span>
    <span class="value">${createdAt ? createdAt : "—"}</span>
  </div>

  <div class="info-item">
    <span class="label">📦 Items</span>
    <span class="value">0 Files</span>
  </div>

  <div class="info-item">
    <span class="label">💾 Size</span>
    <span class="value">—</span>
  </div>
</div>

  
`;


function createContextMenu(e) {
    e.preventDefault();
    closeAllMenus();
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
    refreshPageBtn.addEventListener("click", (e) => window.location.reload())
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
function createFolderCode(fName, folderId, children, left = null, top = null) {
    closeAllMenus()
    let folder = document.createElement("div");
    folder.classList.add("folder")
    folder.setAttribute("draggable", "true");
    folder.id = folderId ? folderId : id();
    folder.innerHTML = fName ? folderUi(fName) : folderUi();
    windowDiv.appendChild(folder);
    if (left !== null || top !== null) {
        folder.style.position = "absolute";
        folder.style.left = left + "px";
        folder.style.top = top + "px";
    }
    let folderName = folder.querySelector(".folder-name");

    if (!fName) {
        folderName.setAttribute("contentEditable", "true");
        selectText(folderName);
        folderName.focus();

        folderName.addEventListener("blur", () => {
            saveFolders(folder.id, folderName.innerText);
        });

    } else {
        folderName.setAttribute("contentEditable", "false");
    }
    folder.addEventListener("dblclick", openFolderContextMenu);
}

function renameFolderName(e, folder) {
    closeAllMenus();
    const folderName = folder.querySelector(".folder-name");
    folderName.setAttribute("contentEditable", "true");
    selectText(folderName);
    folderName.addEventListener("blur", () => {
        const left = parseInt(folder.style.left) || 0;
        const top = parseInt(folder.style.top) || 0;
        saveFolders(folder.id, folderName.innerText, left, top);
    })


}
function deleteFolder(e, folder) {
    closeAllMenus()
    let exisingFolder = JSON.parse(localStorage.getItem("Folders"));
    let filterFolders = exisingFolder.filter(f => f.folderId != folder.id);
    console.log(filterFolders);
    localStorage.setItem("Folders", JSON.stringify(filterFolders));
    displayFolders()

}
function openFolderContextMenu(e) {
    if (e) e.preventDefault();
   closeAllMenus()
    const layout = document.createElement("div");
    layout.innerHTML = folderOptions();
    layout.classList.add("folderUpdationMenu");
    layout.style.position = "fixed";
    layout.style.left = e.clientX + 'px';
    layout.style.top = e.clientY + 'px';
    document.body.appendChild(layout);

    layout.addEventListener("click", (e) => e.stopPropagation());
    const folder = this;
    let renameFolderBtn = layout.querySelector("#renameFolder");
    renameFolderBtn.addEventListener("click", (e) => renameFolderName(e, folder))

    let deleteFolderBtn = layout.querySelector("#deleteFolder");
    deleteFolderBtn.addEventListener("click", (e) => deleteFolder(e, folder));

    let openFolder = layout.querySelector("#openFolder");
    openFolder.addEventListener("click", () => folderOpen(folder))
}
function recursivelyCreateFolders(event, folderId) {
    if (folderId == '') {
        createFolderCode();
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

function saveFolders(folderId, folderName, left = 0, top = 0) {
    let folders = JSON.parse(localStorage.getItem("Folders")) || [];
    let index = folders.findIndex(f => f.folderId == folderId);

    if (index !== -1) {
        folders[index].folderName = folderName;
        folders[index].left = left;
        folders[index].top = top;
    } else {
        let foldersObj = {
            folderId: folderId,
            folderName: folderName,
            childrens: [],
            createdAt: createAtfnc(),
            left: left,
            top: top
        };

        folders.push(foldersObj);
    }

    localStorage.setItem("Folders", JSON.stringify(folders));
}

function displayFolders() {
    windowDiv.innerHTML = ""
    let existingFolders = JSON.parse(localStorage.getItem("Folders")) || [];
    existingFolders.forEach((e) => {
        createFolderCode(e?.folderName, e?.folderId, e?.children, e?.left || null,
            e?.top || null);
    })
}
//utility functions
const id = () => `Fid-${Math.random(Date.now() * 1030240300)}`;
document.body.addEventListener("contextmenu", createContextMenu);
document.body.addEventListener("click", closeAllMenus)
let isDragging = false;
let currentFolder = null;
let offsetX = 0;
let offsetY = 0;

function foldersDragAndDrop() {

    document.body.addEventListener("dragstart", (e) => {
        const folder = e.target.closest('.folder');
        if (!folder) return;

        currentFolder = folder;

        const rect = folder.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        folder.style.opacity = "0.5";
    });

    document.body.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (!currentFolder) return;

        currentFolder.style.position = "absolute";

        currentFolder.style.left = (e.clientX - offsetX) + "px";
        currentFolder.style.top = (e.clientY - offsetY) + "px";
    });

    document.body.addEventListener("dragend", () => {
        if (!currentFolder) return;

        currentFolder.style.opacity = "1";

        const foldername = currentFolder.querySelector(".folder-name").innerText;

        const left = parseInt(currentFolder.style.left) || 0;
        const top = parseInt(currentFolder.style.top) || 0;

        saveFolders(currentFolder.id, foldername, left, top);

        currentFolder = null;
    });

}
function dragAndDrop(element) {
    let offsetX = 0;
    let offsetY = 0;
    let currentElement = null;

    element.setAttribute("draggable", "true");

    element.addEventListener("dragstart", (e) => {
        currentElement = element;

        const rect = element.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        element.style.opacity = "0.5";


        e.dataTransfer.setData("text/plain", "");
        e.dataTransfer.effectAllowed = "move";
    });

    document.body.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!currentElement) return;

    const elementWidth = currentElement.offsetWidth;
    const elementHeight = currentElement.offsetHeight;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;
    newLeft = Math.max(0, Math.min(newLeft, viewportWidth - elementWidth));

    newTop = Math.max(0, Math.min(newTop, viewportHeight - elementHeight));

    currentElement.style.position = "absolute";
    currentElement.style.left = newLeft + "px";
    currentElement.style.top = newTop + "px";
});


    element.addEventListener("dragend", () => {
        if (!currentElement) return;

        currentElement.style.opacity = "1";
        currentElement = null;
    });

}
function closeFolder(div){
   div.remove()
    
}
function maximizeFolder(div){
    div.classList.add("maximize");
    div.style.top = "";
    div.style.left = "";
}
function minimizeFolder(div){
    div.classList.remove("maximize")
}
let isClicked = true;
function folderOpen(folder) {
    console.log(folder)
    closeAllMenus()
    const folderName = folder.querySelector(".folder-name");
    console.log(folderName);
    const existingFolders = JSON.parse(localStorage.getItem("Folders"));
    const filterFolders = existingFolders.filter(f=> f.folderId == folder.id);
    const div = document.createElement("div");
    div.classList.add("folder-window");
    div.id = folder.id;
    console.log(filterFolders);
    
    div.innerHTML = folderOpenUi(folderName.innerText,filterFolders[0]?.createdAt);
    document.body.append(div);
    dragAndDrop(div)
    const deleteFolderBtn = div.querySelector("#closeFolderBtn");
    deleteFolderBtn.addEventListener("click",()=>closeFolder(div))
    const maximizeBtn = document.querySelector("#maximizeBtn");

    maximizeBtn.addEventListener("click",() => {
        if(isClicked){
            maximizeFolder(div)
            isClicked = false;
        }else{
            minimizeFolder(div);
            isClicked = true;
        }
    })
    div.addEventListener("contextmenu",openMenu)
}
function closeAllMenus() {
    document.querySelectorAll(
        ".contextMenu, .folderUpdationMenu, .rec-menu"
    ).forEach(menu => menu.remove());
}

function openMenu(e){
 
        e.preventDefault();
         e.stopPropagation();
         closeAllMenus()
        let exisingFolder = document.querySelector(".rec-menu");
        if(exisingFolder) exisingFolder.remove();
        let div = document.createElement("div");
        div.classList.add("rec-menu");
        div.innerHTML = recursiveFolderOptions();
        document.body.appendChild(div);
        div.style.left = e.clientX + "px";
        div.style.top = e.clientY + "px";

}

foldersDragAndDrop();

window.addEventListener("DOMContentLoaded", () => {
    displayFolders();
});
