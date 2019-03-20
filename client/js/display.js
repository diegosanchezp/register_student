// This script display students data in form of a JSON object 
// visually
const IP = '192.168.2.4';
const main = document.querySelector("#main");
const form = document.querySelector("#search-bar");
// Add a top padding to prevent content overlay with search bar
main.style.paddingTop = form.clientHeight + "px";

// Function definitions/
function display(students) {
    if (students.length > 0) {
        // Display all students with partial info 
        students.forEach(st => {
            let div = document.createElement('div');
            div.className = 'component';
            div.innerHTML =
                `<div id="container">
                <div class="info-ico"></div>
                <img src="../img/prf_pics/${st.prf_pic}" id="photo">
                <div class="del-ico"></div>
                <section id="info">
                    <p>${st.name}</p>
                    <p>${st.age}</p>    
                    <p>${st.school}</p>
                    <p style="display: none;">${st.id}</p>
                </section>
            </div>`;
            main.appendChild(div);
        });
    }
}

function info(students) {
    if (students.length > 0) {
        // Display complete student data
        let infos = document.querySelectorAll('.info-ico');
        infos.forEach(i => {
            i.addEventListener('click', () => {
                //Find what student i'm talking about
                let sID= i.parentNode.lastElementChild.lastElementChild.innerHTML;
                //Get student from students array
                students.forEach(st => {
                    if (st.id == sID) {
                        //Add overlay
                        let overlay = document.createElement('div');
                        overlay.className = 'overlay';
                        document.body.appendChild(overlay);
                        //Display info window on dom
                        let modal = document.createElement('div');
                        modal.id = 'modal';
                        modal.innerHTML =
                            `<div id="container">
                            <img src="./img/prf_pics/${st.prf_pic}" id="photo">
                            <label class="del-ico" for="click"></label>
                            <section id="info">
                                <p>Nombre:</p>
                                <p>${st.name}</p>
                                <p>Apellido:</p>
                                <p>${st.last_name}</p>
                                <p>E-mail:</p>
                                <p>${st.e_mail}</p>
                                <p>Edad:</p>
                                <p>${st.age}</p>   
                                <p>Género:</p>
                                <p>${st.gender}</p>
                                <p>Escuela:</p>
                                <p>${st.school}</p> 
                                <p>Universidad:</p>
                                <p>${st.uni}</p>
                                <p style="display: none;">${st.id}</p>
                            </section>
                        </div>`;
                        document.body.appendChild(modal);
                        let del_ico = modal.firstElementChild.children[1];
                        del_ico.addEventListener('click', () => {
                            overlay.remove();
                            modal.remove();
                        })
                    }
                });
            });
        });
    }
}
function modify(){
    // Modify a student data

    // TODO: change display email for id
    // TODO: Put modify button on modal
    // When modify button is clicked 
    // 1) display an accept button [Green gradient github]
    // 1.2) display cancel button  [Red color]
    // 2) convert all p:nth-child(odd) into inputs with the actual value
    // When user clicks accept button do 
    // 1) Make a post request to rest API server to modify the existing data
    // Important save id unique key !!
    // 2) If request succesful reload current data in modal
    // 3) Refresh data in component

    console.log("test");
}
function remove(students) {
    // Remove a student
    if (students.length > 0) {
        let del = document.querySelectorAll('.del-ico');
        del.forEach(d => {
            d.addEventListener('click', () => {
                //Set display to none
                if (confirm("Do you really want to delete this student?")) {
                    //Delete from database
                    //Find what student i'm talking about
                    let sID= d.parentNode.lastElementChild.lastElementChild.innerHTML;
                    console.log(sID);
                    API_URL = `http://${IP}:5000/`;
                    fetch(API_URL + 'students/delete/' + sID, { method: 'DELETE' })
                        .then(response => response.text())
                        .then(message => {
                            console.log(message);
                            d.parentElement.remove();
                        })
                        .catch(error => { console.log(error) });
                }
            });
        });
    }
}

// Fetch students data from database

let API_URL = `http://${IP}:5000/`;
fetch(API_URL + 'students', { method: 'GET' })
    .then(response => response.json())
    .then(students => {
        if (students.length > 0) {
            display(students);
            info(students);
            remove(students);
            // Search a student
            const searchForm = document.querySelector("#search-bar");
            API_URL = `http://${IP}:5000/students/`
            searchForm.addEventListener("submit", event => {
                event.preventDefault();
                const formData = new FormData(searchForm);
                const searchKey = formData.get("search");
                console.log(searchKey);
                // Fetch from database
                fetch(API_URL + searchKey, { method: 'GET' })
                    .then(response => response.json())
                    .then(students_ => {
                        if (students_.length > 0) {
                            // Remove all current students displayed
                            const oldStudents = document.querySelectorAll(".component");
                            oldStudents.forEach(st => st.remove());

                            // Display the students that the database search got
                            students_.forEach(st => {
                                let div = document.createElement('div');
                                div.className = 'component';
                                div.innerHTML =
                                    `<div id="container">
                                    <div class="info-ico"></div>
                                    <img src="../img/prf_pics/${st.prf_pic}" id="photo">
                                    <div class="del-ico"></div>
                                    <section id="info">
                                        <p>${st.name}</p>
                                        <p>${st.age}</p>    
                                        <p>${st.school}</p>
                                        <p style="display: none;">${st.e_mail}</p>
                                    </section>
                                </div>`;

                                document.body.appendChild(div);
                            });
                            info(students_);
                            remove(students_);
                        }
                    })
                    .catch(error => console.error(error));
            });

        } else {
            let c = document.createElement('center');
            c.innerHTML = '<h1>No students in database :(</h1>';
            document.body.appendChild(c);
        }
    })
    .catch(error => {
        console.error(error);
    });

// Reload or refresh all student 

const reload = document.querySelector("#search-bar #reload");
reload.addEventListener("click", ()=>{
   API_URL = `http://${IP}:5000/`;
   fetch(API_URL + 'students', { method: 'GET' })
    .then(response => response.json())
    .then(students => {
        // Remove all current students displayed
        const oldStudents = document.querySelectorAll(".component");
        oldStudents.forEach(st => st.remove());
        display(students);
    })
    .catch(error => console.error(error));
})
