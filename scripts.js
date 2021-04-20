/*GLOBALS AND AUX STUFF*/
const getHeightInRows = elem => Math.ceil((elem.offsetHeight/10));
const getRandomElem = elems => elems[Math.floor(Math.random()*elems.length)];
const colors = ["#ffffff","#badc58","#f6e58d","#7ed6df"];

const hideElement = e => e.style.display="none";
const showElement = e => e.style.display="block";

let modal = document.querySelector(".modal");
let titleField = document.querySelector(".title-field");
let descriptionField = document.querySelector(".description-field");
let currentNote = null;

let savedNotes = localStorage.getItem("notes");
let notesList = (savedNotes)?JSON.parse(savedNotes):[];


const editNote = clickedNote => {
    currentNote = clickedNote.currentTarget;
    titleField.value = currentNote.querySelector(".title").innerText;
    descriptionField.value = currentNote.querySelector(".description").innerText;
    deleteButton.classList.add("active");
    showElement(modal);
}

const makeNote = newNote => {
    
    let noteTitle = document.createElement('div');
    noteTitle.className="title";
    noteTitle.innerText=newNote.title;
    
    let noteDescription = document.createElement('div');
    noteDescription.className="description";
    noteDescription.innerText=newNote.description;
    
    let noteContent = document.createElement('div');
    noteContent.className="note-inner";
    noteContent.append(noteTitle);
    noteContent.append(noteDescription);
    
    let note = document.createElement('div');
    note.className="note shadowed";
    note.id=newNote.id;
    note.append(noteContent);  
    note.style.backgroundColor=newNote.color;
    
    const notesContainer = document.querySelector(".notes");
    notesContainer.prepend(note);
    
    note.addEventListener("click", editNote);
    note.style.gridRowEnd="span "+ getHeightInRows(note.firstElementChild);
}

/*EVENTS*/
let saveButton = document.querySelector(".save-button");
let deleteButton = document.querySelector(".delete-button");
let addButton = document.querySelector(".add-button");

addButton.onclick = ()=>{
    currentNote=null;
    showElement(modal);
    descriptionField.value="";
    titleField.value="";
    deleteButton.classList.remove("active");
    saveButton.classList.remove("active")
};

modal.onclick = e => {if(e.target==modal) hideElement(modal)};

saveButton.onclick = () => {    
    if(currentNote){
        currentNote.querySelector(".title").innerText = titleField.value;
        currentNote.querySelector(".description").innerText = descriptionField.value;
        currentNote.style.gridRowEnd="span "+ getHeightInRows(currentNote.firstElementChild);
        notesList.forEach(note =>{
            if(note.id == currentNote.id){
                note.description = descriptionField.value;
                note.title = titleField.value;
            }
        })
    }else{
        let idSaved = localStorage.getItem("id");
        let id = (idSaved)?idSaved:1;
        let newNote = {
            id:id++,
            title:titleField.value,
            description:descriptionField.value,
            color:getRandomElem(colors)
        }
        makeNote(newNote);
        notesList.push(newNote);
        localStorage.setItem("id",id);
    };
    localStorage.setItem("notes", JSON.stringify(notesList));
    hideElement(modal);
};

deleteButton.onclick = () => {
    const position = notesList.findIndex(e => e.id==currentNote.id);
    notesList.splice(position,1);
    currentNote.remove();
    localStorage.setItem("notes", JSON.stringify(notesList));
    hideElement(modal);
};

/*VALIDATIONS*/
descriptionField.onkeyup = () =>{
    if(descriptionField.value.trim()) saveButton.classList.add("active")
    else saveButton.classList.remove("active")
}

/*SEARCH*/
let searchField = document.querySelector(".search-field");

searchField.onkeyup = () =>{
    let notes = document.querySelectorAll(".note");
    let text = searchField.value.trim().toLowerCase();
    notes.forEach(note=>{
        const title = note.querySelector(".title").innerText.toLowerCase();
        const description = note.querySelector(".description").innerText.toLowerCase();
        note.style.display=((title.includes(text) || description.includes(text)))?"block":"none";
    });
}

/*BEGIN*/
const loadNotes = () => notesList.forEach(note=>makeNote(note));

loadNotes();