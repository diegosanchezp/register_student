// This script sends de data that the user put into the
// form, via a json object to a server to register it
// to a data SQL base

// Grab form data
const IP = '192.168.2.4';

const form = document.querySelector('#wrapper form');
const API_URL = `http://${IP}:5000/register`;
form.addEventListener('submit', (event) => {
    //Stop default action 
    event.preventDefault();
    let formData = new FormData(form);

    //Send form data to server
    fetch(API_URL, {
        method: "POST",
        body: formData
    })
        .then(response => response.text())
        .then(message => {
            let notify = document.querySelector("#wrapper > form #notify");
            console.log(message);
            notify.style.display = "block";
            notify.innerHTML = message;
            setTimeout(() => notify.style.display = "", 4000);
        })
        .catch(error => {
            let notify = document.querySelector("#wrapper > form #notify");
            notify.style.display = "block";
            notify.innerHTML = "connection error";
            setTimeout(() => notify.style.display = "", 4000);
        });
})
