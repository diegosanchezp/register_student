// This script display students data in form of a JSON object 
// visually
const IP = '192.168.2.4';
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
                    <p style="display: none;">${st.e_mail}</p>
                </section>
            </div>`;

            document.body.appendChild(div);
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
                let sEmail = i.parentNode.lastElementChild.lastElementChild.innerHTML;
                //Get student from students array
                students.forEach(st => {
                    if (st.e_mail == sEmail) {
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

function remove(students) {
    // Remove a student
    if (students.length > 0) {
        let del = document.querySelectorAll('.del-ico');
        del.forEach(d => {
            d.addEventListener('click', () => {
                //Set display to none
                if (confirm("¿Realmente desea eliminar el estudiante?")) {
                    //Delete from database
                    //Find what student i'm talking about
                    let sEmail = d.parentNode.lastElementChild.lastElementChild.innerHTML;
                    console.log(sEmail);
                    fetch(API_URL + 'students/delete/' + sEmail, { method: 'DELETE' })
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
            // TO-DO remove the commented code below
            // Display all students with partial info 
            /*students.forEach( st => {
                let div = document.createElement('div');
                div.className = 'component';
                div.innerHTML= 
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
            });*/

            // Display complete student data
            /*let infos = document.querySelectorAll('.info-ico');
            infos.forEach( i => {
                i.addEventListener('click', ()=>{
                    //Find what student i'm talking about
                    let sEmail = i.parentNode.lastElementChild.lastElementChild.innerHTML;
                    //Get student from students array
                    students.forEach( st => {
                        if(st.e_mail == sEmail){
                            //Add overlay
                            let overlay =  document.createElement('div');
                            overlay.className = 'overlay';
                            document.body.appendChild(overlay);
                            //Display info window on dom
                            let modal= document.createElement('div');
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
                                </section>
                            </div>`;
                            document.body.appendChild(modal);
                            let del_ico = modal.firstElementChild.children[1];
                            del_ico.addEventListener('click', ()=>{
                                overlay.remove();
                                modal.remove();
    
                            })
                        }
                    });
                });
            });*/

            // Remove a student
            /*let del = document.querySelectorAll('.del-ico');
            del.forEach( d =>{
                d.addEventListener('click', () => {
                    //Set display to none
                    if(confirm("¿Realmente desea eliminar el estudiante?")){
                        //Delete from database
                        //Find what student i'm talking about
                        let sEmail = d.parentNode.lastElementChild.lastElementChild.innerHTML;
                        console.log(sEmail);
                        fetch(API_URL + 'students/delete/' + sEmail, {method: 'DELETE'} )
                        .then(response => response.text())
                        .then(message => {
                            console.log(message);
                            d.parentElement.remove();
                        })
                        .catch(error =>{console.log(error)});
                    }
                    
                });
            });*/
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

