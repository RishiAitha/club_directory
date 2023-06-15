document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#create-div').style.display = 'none';
    const createNav = document.querySelector('#create-nav');
    createNav.addEventListener('click', () => {
        document.querySelector('#create-div').style.display = 'block';
    });
});

function submit_club() {
    console.log("Submit Club Function Called");
    document.querySelector('#create-div').style.display = 'none';
    return false;
}