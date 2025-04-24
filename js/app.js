const tbody = document.querySelector('.table tbody');
const addForm = document.getElementById('add-form');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const modalTitle = document.querySelector('.modal-title');
const saveBtn = document.getElementById('save');
const btn2 = document.getElementById('btn2');
const noResults = document.querySelector('.no-results');
const students = loadData();
let searchValue = "";
let filterValue = "All";
let selectedUsers = null;
let selectedDeleteIndex = null;
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const confirmDeleteBtn = document.getElementById('confirmDelete');

btn2.addEventListener('click', () => {
    modalTitle.innerHTML = "Yangi o'quvchi qo'shish";
    saveBtn.innerHTML = "Saqlash";
    
})

searchInput.addEventListener('input', (e) => {
    searchValue = e.target.value;
    renderStudents();

})


filterSelect.addEventListener('change', (e) => {
    filterValue = e.target.value;
    renderStudents();
})

renderStudents();
function renderStudents() {
    tbody.innerHTML = '';
    noResults.style.display = 'none';

    let filteredData = students;

    filteredData = students.filter((student) => {
        if(student.firstName.toLowerCase().includes(searchValue.toLowerCase()) || student.lastName.toLowerCase().includes(searchValue.toLowerCase())){
            return true
        }
    })
    if(filterValue !== "All"){
        filteredData = filteredData.filter((student) => student.Class === filterValue)        
    }

    if (filteredData.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    filteredData.map((student, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.Class}</td>
            <td>${student.hasWork ? 'Ha' : 'Yoq'}</td>
            <td>
                <button title="Edit" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#addBtn" onclick="editStudent(${i})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button title="Delete" class="btn btn-danger" onclick="deleteStudent(${i})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    })

}


addForm.addEventListener('submit', (e) => {
    if (addForm.firstName.value && addForm.lastName.value && addForm.studentClass.value) {
        e.preventDefault();

        if(selectedUsers !== null){
            students[selectedUsers] = {
                firstName: addForm.firstName.value, 
                lastName: addForm.lastName.value,
                Class: addForm.studentClass.value,
                hasWork: addForm.hasWork.checked
            }
            Toastify({
                text: "Ma'lumot yangilandi",
                className: "info",  
                close: true,
                duration: 3000,
                grid: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",

                }
            }).showToast();
            addForm.reset();
            bootstrap.Modal.getInstance(addBtn).hide();
            renderStudents();
            saveData();
            selectedUsers = null;
            return;
        }
        students.push({
            firstName: addForm.firstName.value,
            lastName: addForm.lastName.value,
            Class: addForm.studentClass.value,
            hasWork: addForm.hasWork.checked

        })

        Toastify({
            text: "Ma'lumot saqlandi",
            className: "info",
            close: true,
            duration: 3000,
            grid: true,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",

            }
        }).showToast();


        addForm.reset();
        bootstrap.Modal.getInstance(addBtn).hide();
        renderStudents();
        saveData();
    }
    else {
        e.preventDefault();
        return alert("Ma'lumotni to'liq kiritish kerak")
    }




});

function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
}
function loadData() {
    const fromData = localStorage.getItem('students') || '[]';
    return JSON.parse(fromData);


}

function deleteStudent(i) {
    selectedDeleteIndex = i;
    deleteModal.show();
}

confirmDeleteBtn.addEventListener('click', () => {
    if (selectedDeleteIndex !== null) {
        students.splice(selectedDeleteIndex, 1);
        saveData();
        renderStudents();
        deleteModal.hide();
        selectedDeleteIndex = null;

        Toastify({
            text: "Ma'lumot o'chirildi",
            className: "info",
            close: true,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #ff4b4b, #ff7878)",
            }
        }).showToast();
    }
});

function editStudent(i) {
    selectedUsers = i;
    addForm.firstName.value = students[i].firstName;
    addForm.lastName.value = students[i].lastName;
    addForm.studentClass.value = students[i].Class;
    addForm.hasWork.checked = students[i].hasWork;
    modalTitle.innerHTML = "O'zgartirish";
    saveBtn.innerHTML = "Yangilash!";

}


