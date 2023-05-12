const addBox = document.querySelector('.add_box');
popupBox = document.querySelector('.popup_box');
popupTitle = document.querySelector('header p');
closeIcon = document.querySelector('header i');
titleTag = document.querySelector('input');
descTag = document.querySelector('textarea');
addBtn = popupBox.querySelector('button');

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//getting localStorage notes if exist and parsing them to js object else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener('click', () => {
    titleTag.focus();
    popupBox.classList.add('show');
});
closeIcon.addEventListener('click', () => {
    isUpdate = false;
    titleTag.value = "";
    descTag.value = "";
    addBtn.innerText = "Add Note";
    popupTitle.innerText = "Add a new Note";
    popupBox.classList.remove('show');
});

function showNotes() {
    document.querySelectorAll('.note').forEach(note => note.remove());
    notes.forEach((note, index) => {
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom_content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="fas fa-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="fas fa-pencil-alt"></i>Edit</li>
                                    <li onclick="deleteNote(${index})"><i class="far fa-trash-alt"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        
        addBox.insertAdjacentHTML("afterend", liTag);
    })
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add('show');
    document.addEventListener('click', (e) => {
      if(e.target.tagName != "I" || e.target != elem) {
        elem.parentElement.classList.remove('show');
      }
    })
}

function deleteNote(noteId) {
    let confirmDel = confirm('Are you sure you want to delete this note ?')
    if(!confirmDel) return;
    notes.splice(noteId, 1); //remove selected note from array/tasks
    //saving updated notes to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, desc) {
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update this Note";
    console.log(noteId, title, desc);
}

addBtn.addEventListener('click', (e) => {
    e.preventDefault();    
    let noteTitle = titleTag.value;
    noteDesc = descTag.value;

    if(noteTitle || noteDesc) {
        //getting month, day and year from the current date
        let dateObj = new Date();
        month = months[dateObj.getMonth()];
        day = dateObj.getDay();
        year = dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle,
            description: noteDesc,
            date: `${month} ${day} ${year}`
        }

        if(!isUpdate) {
             notes.push(noteInfo); //Adding new note to notes
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo; //Updating specified note
        }
       
        //saving notes to localStorage
        localStorage.setItem("notes", JSON.stringify(notes));
        closeIcon.click();
        showNotes();
    }
    
})