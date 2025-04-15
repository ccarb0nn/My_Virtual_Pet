export function changePet(petIndex) {
    let notSet = false; // Did user name pet 
    let petType;

    let petName = prompt("What would you like to name your pet?");
    if (petName === null || petName.trim() === ""){
        notSet = true;
    }
    switch (petIndex) {
        case 0:
            petType = 'dog';  // Dog selected
            if(notSet){
                petName = 'CLOUD';
            }
            break;
        case 1:
            petType = 'cat';  // Cat selected
            if(notSet){
                petName = 'GARF';
            }
            break;
        case 2:
            petType = 'monk'; // Monkey selected
            if(notSet){
                petName = 'FUDGE';
            }
            break;
        case 3:
            petType = 'rex'; // T-Rex selected
            if(notSet){
                petName = 'REX';
            }
            break;
        case 4:
            petType = 'turt'; // Turtle selected
            if(notSet){
                petName = 'TURT';
            }
            break;
    }

    const selectedPet = { name: petName, type: petType };

    // Save the selected pet in localStorage
    localStorage.setItem('selectedPet', JSON.stringify(selectedPet));

    // Redirect to home.html
    window.location.href = "home.html"; 
}

window.changePet = changePet;