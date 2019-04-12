// This script sends de data that the user put into the
// form, via a json object to a server to register it
// to a data SQL base

// Grab form data
const IP = '192.168.2.4';

function notify(message){
    let notifyElem = document.querySelector("#wrapper > form #notify");
    notifyElem.style.display = "block";
    notifyElem.innerHTML = message; 
    setTimeout(() => notifyElem.style.display = "", 4000); 
}

const form = document.querySelector('#wrapper form');
const API_URL = `http://${IP}:5000/students`;
form.addEventListener('submit', (event) => {
    //Stop default action 
    event.preventDefault();
    let formData = new FormData(form);

    //Send form data to server
    fetch(API_URL, {
        method: "POST",
        body: formData
    })
        .then(response =>  response.text())
        .then(message => {
            console.log(message);
            notify(message);
        })
        .catch(error => {
            notify("Connection error");
        });
})
