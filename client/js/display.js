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
                            <div id="modify-ico"></div>
                            <img src="./img/prf_pics/${st.prf_pic}" id="photo">
                            <label class="del-ico" for="click"></label>
                            <section id="info">
                                <p>Name:</p>
                                <p>${st.name}</p>
                                <p>Last_name:</p>
                                <p>${st.last_name}</p>
                                <p>E-mail:</p>
                                <p>${st.e_mail}</p>
                                <p>Age:</p>
                                <p>${st.age}</p>   
                                <p>Gender:</p>
                                <p>${st.gender}</p>
                                <p>School:</p>
                                <p>${st.school}</p> 
                                <p>College:</p>
                                <p>${st.uni}</p>
                                <p style="display: none;">${st.id}</p>
                            </section>
                        </div>`;
                        document.body.appendChild(modal);
                        const del_ico = modal.firstElementChild.children[2];
                        del_ico.addEventListener('click', () => {
                            overlay.remove();
                            modal.remove();
                        })
                        const mod_ico = modal.firstElementChild.children[0];
                        mod_ico.addEventListener('click', () => {
                            modify(modal, st);

                        })
                    }
                });
            });
        });
    }
}
function modify(modal, st){
    // Modify a student data
    // This function will be called inside info()
    
    // Remove info part of modal
    const info_old = modal.firstElementChild.children[3];
    info_old.remove();

    // If cancel button pressed restore modal
    // When modify button is clicked 
    // 1) display an accept button [Green gradient github]
    // 1.2) display cancel button  [Red color]
    // Replace 
    // Choose what default value to display in gender dropdown list
    let selec;
    switch(st.gender){
        case 'M':
            selec = `
                <option value="M" selected>Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
            `;
            break;
        case 'F':
            selec = `
                <option value="M">Male</option>
                <option value="F" selected>Female</option>
                <option value="O">Other</option>
            `;
            break;
        case 'O':
            selec = `
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O" selected>Other</option>
            `;
            break;
    }
    const form_info = document.createElement("form");
    form_info.id = "form-info";
    form_info.innerHTML =
    `
        <label for="prfPic">Profile Picture</label>
        <input type="file" name="prfPic">
        <label for="name">Name</label>
        <input type="text" name="name" required placeholder="Nombre" id="name" value="${st.name}">
        <label for="l_name">Last Name</label>
        <input type="text" name="l_name" required placeholder="Apellido" id="l_name" value="${st.last_name}">
        <label for="e_mail">E-mail</label>
        <input type="email" name="e_mail" required value="${st.e_mail}">
        <label for="age">Age</label>
        <input type="number" min="18" max="50" name="age" required id="age" value="${st.age}">
        <label for="gender">Gender</label>
        <select name="gender" id="gender">
            ${selec}
        </select>
        <label for="school">School</label>
        <input type="text" name="school" placeholder="Escuela" id ="school" value="${st.school}">
        <label for="uni">College</label>
        <input type="text" name="uni" required placeholder="Universidad" id="uni" value="${st.uni}">
        <div id="modify-bts">
            <button>Accept</button>
            <button>Cancel</button>
        </div>
        <div id="notify"></div>
    `;
    modal.firstElementChild.appendChild(form_info);
    const bts = document.querySelector("#modify-bts");
    // Cancel button
    const cancel = bts.lastElementChild;
    cancel.addEventListener("click", ()=>{
        bts.remove();
        form_info.remove();
        modal.firstElementChild.appendChild(info_old);
    });

    //Accept button
    form_info.addEventListener("submit", (event)=>{
        event.preventDefault();
        let formData = new FormData(form_info);
        formData.append("prf_pic", st.prf_pic);
        API_URL = `http://${IP}:5000/update/`;
        fetch(API_URL + st.id,{
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(message => {
            console.log(message);
            //Reload updated data in modal
            info_old.innerHTML = `<p>Name:</p>
            <p>${formData.get("name")}</p>
            <p>Last_name:</p>
            <p>${formData.get("l_name")}</p>
            <p>E-mail:</p>
            <p>${formData.get("e_mail")}</p>
            <p>Age:</p>
            <p>${formData.get("age")}</p>   
            <p>Gender:</p>
            <p>${formData.get("gender")}</p>
            <p>School:</p>
            <p>${formData.get("school")}</p> 
            <p>College:</p>
            <p>${formData.get("uni")}</p>
            <p style="display: none;">${st.id}</p>`
            form_info.remove();
            modal.firstElementChild.appendChild(info_old);
            

        })
        .catch(error => console.log(error));
});
    
    // 2) convert all p:nth-child(odd) into inputs with the actual value
    // When user clicks accept button do 
    // 1) Make a post request to rest API server to modify the existing data
    // Important save id unique key !!
    // 2) If request succesful reload current data in modal
    // 3) Refresh data in component


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
                    fetch(API_URL + 'students/' + sID, { method: 'DELETE' })
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
            searchForm.addEventListener("submit", event => {
                event.preventDefault();
                const formData = new FormData(searchForm);
                const searchKey = formData.get("search");
                console.log(searchKey);
                // Fetch from database
                API_URL = `http://${IP}:5000/search/`
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
                                        <p style="display: none;">${st.id}</p>
                                    </section>
                                </div>`;
                                document.body.appendChild(div);
                            });
                            info(students_);
                            remove(students_);
                        }
                    })
                    .catch(error => console.log(error));
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
const reload_btn = document.querySelector("#search-bar #reload");
reload_btn.addEventListener("click", ()=>{
    reload();
});
function reload(){
    API_URL = `http://${IP}:5000/`;
    fetch(API_URL + 'students', { method: 'GET' })
        .then(response => response.json())
        .then(students => {
            // Remove all current students displayed
            const oldStudents = document.querySelectorAll(".component");
            oldStudents.forEach(st => st.remove());
            display(students);
            info(students);
            remove(students);
        })
        .catch(error => console.error(error));
}