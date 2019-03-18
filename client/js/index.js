'use strict';

//This script hides all placeholder attribute for inputs for desktop desing
if(screen.availWidth > 992){
    let labels = document.querySelectorAll("#wrapper > form input");
    for(let i = 0; i<labels.length; i++){
        labels[i].setAttribute("placeholder","");
    }
}

