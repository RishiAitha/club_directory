document.addEventListener('DOMContentLoaded', function() { // on start
    // start by showing correct divs
    document.querySelector('#clubs-container').style.display = 'block';
    document.querySelector('#single-container').style.display = 'none';
    document.querySelector('#create-container').style.display = 'none';
    const createNav = document.querySelector('#create-nav');
    createNav.addEventListener('click', () => {
        // display creation page if nav link is clicked
        document.querySelector('#clubs-container').style.display = 'none';
        document.querySelector('#single-container').style.display = 'none';
        document.querySelector('#create-container').style.display = 'block';

        // clear creation fields
        document.querySelector('#create-title').value = '';
        document.querySelector('#create-description').value = '';
        document.querySelector('#create-announcement').value = '';
        document.querySelector('#create-errorMessage').innerHTML = '';
    });
    show_approved(); // start by showing approved clubs
});

function show_approved() { // show all approved clubs
    // set correct divs to show
    document.querySelector('#clubs-container').style.display = 'block';
    document.querySelector('#single-container').style.display = 'none';
    document.querySelector('#create-container').style.display = 'none';

    fetch('/approved')
    .then(response => response.json())
    .then(clubs => {
        clubs.forEach(club => {
            document.querySelector('#clubs-container').append(preview_setup(club));
        })
    });
}

function preview_setup(club) {
    const previewContainer = document.createElement('div');
    previewContainer.classList.add('preview-container');

    const title = document.createElement('div');
    title.innerHTML = club.title;
    title.classList.add('preview-title');
    title.addEventListener('click', function() {
        show_club(club.id);
    })
    previewContainer.append(title);

    const announcement = document.createElement('div');
    announcement.innerHTML = 'Announcement: ' + club.announcement;
    announcement.classList.add('preview-announcement');
    previewContainer.append(announcement);

    const image = document.createElement('div');
    image.innerHTML = '--image here--'
    image.classList.add('preview-image');
    previewContainer.append(image);

    return previewContainer;
}

function show_club(id) {
    const postContainer = document.querySelector('#post-container');
    postContainer.parentNode.innerHTML = '';

    document.querySelector('#clubs-container').style.display = 'none';
    document.querySelector('#single-container').style.display = 'block';
    document.querySelector('#create-container').style.display = 'none';

    fetch(`/club/${id}`)
    .then(response => response.json())
    .then(club => {
        const title = document.createElement('h2');
        title.id = 'single-title';
        title.innerHTML = club.title;
        document.querySelector('#single-container').append(title);

        const descriptionLabel = document.createElement('h3');
        descriptionLabel.id = 'single-descriptionLabel';
        descriptionLabel.innerHTML = 'Description:';
        document.querySelector('#single-container').append(descriptionLabel);

        const description = document.createElement('h4');
        description.id = 'single-description';
        description.innerHTML = club.description;
        document.querySelector('#single-container').append(description);

        const announcementLabel = document.createElement('h3');
        announcementLabel.id = 'single-announcementLabel';
        announcementLabel.innerHTML = 'Announcement:';
        document.querySelector('#single-container').append(announcementLabel);

        const announcement = document.createElement('h4');
        announcement.id = 'single-announcement';
        announcement.innerHTML = club.announcement;
        document.querySelector('#single-container').append(announcement);

        const image = document.createElement('div');
        image.id = 'single-image';
        image.innerHTML = '--image here--';
        document.querySelector('#single-container').append(image);

        document.querySelector('#single-container').append(document.createElement('hr'));

        const interestDisplay = document.createElement('h4');
        interestDisplay.id = 'single-interestDisplay';
        interestDisplay.innerHTML = 'Interested Users Count: ' + club.interestCount;
        document.querySelector('#single-container').append(interestDisplay);

        const interestButton = document.createElement('button');
        interestButton.id = 'single-interestButton';
        interestButton.classList.add('btn', 'btn-primary');
        interestButton.innerHTML = 'Mark as Interesting (not working yet)';
        document.querySelector('#single-container').append(interestButton);

        document.querySelector('#single-container').append(document.createElement('hr'));
        
        const messageLabel = document.createElement('h3');
        messageLabel.id = 'single-messageLabel';
        messageLabel.innerHTML = 'Message Board:';
        document.querySelector('#single-container').append(messageLabel);

        //const postContainer = document.querySelector('#post-container');
        postContainer.style.display = 'block';
        document.querySelector('#single-container').appendChild(postContainer);
        document.querySelector('#post-form').onsubmit = () => {
            post_message(club.id);
            return false;
        }

        document.querySelector('#single-container').append(document.createElement('hr'));

        club.messages.forEach(message => {
            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message-container');
            
            const poster = document.createElement('div');
            poster.classList.add('message-poster');
            poster.innerHTML = message.poster.username;
            messageContainer.append(poster);

            const timestamp = document.createElement('div');
            timestamp.classList.add('message-timestamp');
            timestamp.innerHTML = message.timestamp;
            messageContainer.append(timestamp);

            const content = document.createElement('div');
            content.classList.add('message-content');
            content.innerHTML = message.content;
            messageContainer.append(content);

            document.querySelector('#single-container').append(messageContainer);
        })
    });
}

function submit_club() { // send request to add club if input is valid
    if (document.querySelector('#create-title').value === '') {
        document.querySelector('#create-errorMessage').innerHTML = 'Club must have title.';
    } else if (document.querySelector('#create-description').value === '') {
        document.querySelector('#create-errorMessage').innerHTML = 'Club must have description.';
    } else {
        fetch('/create', {
            method: 'POST',
            body: JSON.stringify({
                title: document.querySelector('#create-title').value,
                description: document.querySelector('#create-description').value,
                announcement: document.querySelector('#create-announcement').value
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            document.querySelector('#create-errorMessage').innerHTML = '';
            document.querySelector('#create-container').style.display = 'none';
            show_approved();
        });
    }
    return false;
}

function post_message(clubID) {
    if (document.querySelector('#post-content').value == '') {
        document.querySelector('#post-errorMessage').innerHTML = 'Message must have content.';
    } else {
        fetch('/post', {
            method: 'POST',
            body: JSON.stringify({
                clubID: clubID,
                content: document.querySelector('#post-content').value
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            document.querySelector('#post-errorMessage').innerHTML = '';
            document.querySelector('#post-content').value = '';
            show_club(clubID);
        })
    }

    return false;
}





// NOT ACTUALLY USED
// MADE TO TEST EDITING VIEW AND FOR REFERENCE
// Editing Testing 6/12/2023
// document.addEventListener('DOMContentLoaded', function() {
//     edit_test();
// });

// function edit_test() {
//     fetch('/approved')
//     .then(response => response.json())
//     .then(clubs => {
//         clubs.forEach(club => {
//             if (club.id === 1) {
//                 mainDiv = document.querySelector('#index-placeholder');
//                 mainDiv.innerHTML = 'Testing for Editing a Club';

//                 const desc = document.createElement('textarea');
//                 desc.classList.add('form-control');
//                 desc.value = club.description;
//                 mainDiv.append(desc);

//                 const announce = document.createElement('textarea');
//                 announce.classList.add('form-control');
//                 announce.value = club.announcement;
//                 mainDiv.append(announce);

//                 const interest = document.createElement('input');
//                 interest.type = 'number';
//                 interest.classList.add('form-control');
//                 interest.value = 0;
//                 mainDiv.append(interest);

//                 // changing editors would need to be done here

//                 const approveDiv = document.createElement('div');
//                 approveDiv.classList.add('checkbox');
//                 const approveLabel = document.createElement('label');
//                 approveDiv.append(approveLabel);
//                 approveLabel.innerHTML = '\tApproval Status';
//                 const approval = document.createElement('input');
//                 approval.id = 'approvalBox';
//                 approval.type = 'checkbox';
//                 approval.checked = club.isApproved;
//                 approveLabel.prepend(approval);
//                 mainDiv.append(approveDiv);

//                 const submit = document.createElement('button');
//                 submit.innerHTML = 'Submit Edit';
//                 submit.classList.add('btn', 'btn-primary');
//                 submit.onclick = () => {
//                     // just uses original editors
//                     let newEditors = '';
//                     club.editors.forEach(editor => {
//                         newEditors += editor + ',';
//                     });
//                     newEditors = newEditors.substring(0, newEditors.length - 1);
//                     edit_club(club.id, desc.value, announce.value, parseInt(interest.value), newEditors, approval.checked);
//                 };
//                 mainDiv.append(submit);
//             }
//         })
//     });
// }

// function edit_club(id, description, announcement, interestChange, editors, isApproved) {
//     fetch('/edit', {
//       method: 'PUT',
//       body: JSON.stringify({
//         clubID: id,
//         description: description,
//         announcement: announcement,
//         interestChange: interestChange,
//         editors: editors,
//         isApproved: isApproved
//       })  
//     })
//     .then(response => response.json())
//     .then(club => {
//         console.log('New Club: \n', club);
//     });
// }