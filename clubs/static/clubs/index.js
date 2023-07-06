document.addEventListener('DOMContentLoaded', function() { // on start
    // start by showing correct divs
    document.querySelector('#clubs-container').style.display = 'block';
    document.querySelector('#single-container').style.display = 'none';
    document.querySelector('#create-container').style.display = 'none';
    document.querySelector('#edit-container').style.display = 'none';
    document.querySelector('#editors-container').style.display = 'none';
    
    // initialize session storage
    sessionStorage.setItem('messagePage', 1);
    sessionStorage.setItem('loggedIn', document.querySelector('#nav-username') !== null);
    sessionStorage.setItem('replying', -1);
    sessionStorage.setItem('username', '');
    sessionStorage.setItem('isAdmin', false);
    sessionStorage.setItem('editing', -1);

    if (sessionStorage.getItem('loggedIn') === 'true') {
        sessionStorage.setItem('username', document.querySelector('#nav-username').firstChild.innerHTML);
        sessionStorage.setItem('isAdmin', document.querySelector('#admin-nav') !== null);
    
        const createNav = document.querySelector('#create-nav');
        createNav.addEventListener('click', () => {
            // display creation page if nav link is clicked
            document.querySelector('#clubs-container').style.display = 'none';
            document.querySelector('#single-container').style.display = 'none';
            document.querySelector('#create-container').style.display = 'block';
            document.querySelector('#edit-container').style.display = 'none';
            document.querySelector('#editors-container').style.display = 'none';

            // clear creation fields
            document.querySelector('#create-title').value = '';
            document.querySelector('#create-description').value = '';
            document.querySelector('#create-announcement').value = '';
            document.querySelector('#create-errorMessage').innerHTML = '';
            document.querySelector('#create-image-input').value = '';

            // setup image input
            document.querySelector('#create-image-input').addEventListener('change', (event) => {
                // show image preview
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.querySelector('#create-image-preview').src = e.target.result;
                    };
                    reader.readAsDataURL(file);

                    document.querySelector('#create-image-remove').style.display = 'block';
                    document.querySelector('#create-image-remove').onclick = () => {
                        document.querySelector('#create-image-input').value = '';
                        document.querySelector('#create-image-preview').src = '#';
                        document.querySelector('#create-image-remove').style.display = 'none';
                    }
                } else {
                    document.querySelector('#create-image-preview').src = '#';
                }
            });
        });

        if (sessionStorage.getItem('isAdmin') === 'true') {
            const adminNav = document.querySelector('#admin-nav');
            adminNav.addEventListener('click', () => {
                show_pending();
            })
        }
    }
    show_approved(); // start by showing approved clubs
});

function show_approved() { // show all approved clubs
    // set correct divs to show
    document.querySelector('#clubs-container').style.display = 'block';
    document.querySelector('#single-container').style.display = 'none';
    document.querySelector('#create-container').style.display = 'none';
    document.querySelector('#edit-container').style.display = 'none';
    document.querySelector('#editors-container').style.display = 'none';

    document.querySelector('#clubs-container').innerHTML = '';
    sessionStorage.setItem('clubType', 'approved');

    fetch('/approved')
    .then(response => response.json())
    .then(clubs => {
        show_previews(clubs);
    });
}

function show_pending() {
    // set correct divs to show
    document.querySelector('#clubs-container').style.display = 'block';
    document.querySelector('#single-container').style.display = 'none';
    document.querySelector('#create-container').style.display = 'none';
    document.querySelector('#edit-container').style.display = 'none';
    document.querySelector('#editors-container').style.display = 'none';
    
    document.querySelector('#clubs-container').innerHTML = '';
    sessionStorage.setItem('clubType', 'pending');

    const adminTitle = document.createElement('h3');
    adminTitle.id = 'pending-adminTitle';
    adminTitle.innerHTML = 'Pending Club Requests';
    document.querySelector('#clubs-container').append(adminTitle);

    const adminInfo = document.createElement('p');
    adminInfo.id = 'pending-adminInfo';
    adminInfo.innerHTML = 'Approve clubs if they are suitable for the main page and are real clubs, or change the content to ensure they are suitable. If needed, contact the creator of the club page using their email. Clubs that should not be added can be left on the pending page.'
    document.querySelector('#clubs-container').append(adminInfo);

    fetch('/pending')
    .then(response => response.json())
    .then(clubs => {
        show_previews(clubs);
    });
}

function show_previews(clubs) {
    clubs.forEach(club => {
        console.log(club);
        const previewContainer = document.createElement('div');
        previewContainer.classList.add('preview-container');

        const title = document.createElement('div');
        title.innerHTML = club.title;
        title.classList.add('preview-title');
        title.addEventListener('click', function() {
            show_club(club.id);
        })
        previewContainer.append(title);

        if (club.announcement != '') {
            const announcement = document.createElement('div');
            announcement.innerHTML = 'Announcement(s): ' + club.announcement;
            announcement.classList.add('preview-announcement');
            previewContainer.append(announcement);
        }

        if (club.image) {
            const image = document.createElement('img');
            image.src = club.image;
            image.classList.add('preview-image');
            previewContainer.append(image);

            previewContainer.append(document.createElement('br'));
        }

        if (sessionStorage.getItem('loggedIn') === 'true' && (club.editors.some(user => user.username === sessionStorage.getItem('username')) || sessionStorage.getItem('isAdmin') === 'true')) {
            const editContentButton = document.createElement('button');
            editContentButton.classList.add('preview-editContentButton', 'btn', 'btn-primary');
            editContentButton.innerHTML = 'Edit Club Page Content';
            editContentButton.onclick = () => {
                // display editing interface
                document.querySelector('#clubs-container').style.display = 'none';
                document.querySelector('#single-container').style.display = 'none';
                document.querySelector('#create-container').style.display = 'none';
                document.querySelector('#edit-container').style.display = 'block';
                document.querySelector('#editors-container').style.display = 'none';

                document.querySelector('#edit-title').value = club.title;
                document.querySelector('#edit-description').value = club.description;
                document.querySelector('#edit-announcement').value = club.announcement;
                document.querySelector('#edit-image-input').value = '';
                document.querySelector('#edit-image-preview').src = '#';
                document.querySelector('#edit-image-remove').style.display = 'none';
                document.querySelector('#edit-image-none').checked = false;

                
                sessionStorage.setItem('editing', club.id);

                document.querySelector('#edit-image-input').addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            document.querySelector('#edit-image-preview').src = e.target.result;
                        }
                        reader.readAsDataURL(file);

                        document.querySelector('#edit-image-remove').style.display = 'block';
                        document.querySelector('#edit-image-remove').onclick = () => {
                            document.querySelector('#edit-image-input').value = '';
                            document.querySelector('#edit-image-preview').src = '#';
                            document.querySelector('#edit-image-remove').style.display = 'none';
                        };
                    } else {
                        document.querySelector('#edit-image-preview').src = '#';
                    }
                });
            }
            previewContainer.append(editContentButton);

            previewContainer.append(document.createElement('br'));

            const editEditorsButton = document.createElement('button');
            editEditorsButton.classList.add('preview-editEditorsButton', 'btn', 'btn-primary');
            editEditorsButton.innerHTML = 'Change Authorized Club Editors';
            editEditorsButton.onclick = () => {
                // display editors interface
                document.querySelector('#clubs-container').style.display = 'none';
                document.querySelector('#single-container').style.display = 'none';
                document.querySelector('#create-container').style.display = 'none';
                document.querySelector('#edit-container').style.display = 'none';
                document.querySelector('#editors-container').style.display = 'block';

                // field presets
                document.querySelector('#editors-add-input').value = '';
                document.querySelector('#editors-display').innerHTML = 'Change Club Editors -- ' + club.title;

                document.querySelector('#editors-remove-input').innerHTML = '';
                club.editors.forEach(editor => {
                    const option = document.createElement('option');
                    option.text = editor.email;
                    document.querySelector('#editors-remove-input').add(option);
                });
                sessionStorage.setItem('editing', club.id);
            }
            previewContainer.append(editEditorsButton);
        }

        if (sessionStorage.getItem('clubType') === 'pending') {
            previewContainer.append(document.createElement('br'));
            const approveButton = document.createElement('button');
            approveButton.classList.add('preview-approveButton', 'btn', 'btn-primary');
            approveButton.innerHTML = 'Approve Club';
            approveButton.onclick = () => {
                approve_club(club.id);
            }
            previewContainer.append(approveButton);

            const timestamp = document.createElement('div');
            timestamp.classList.add('preview-timestamp');
            timestamp.innerHTML = 'Added ' + club.timestamp;
            previewContainer.append(timestamp);

            const creator = document.createElement('div');
            creator.classList.add('preview-creator');
            creator.innerHTML = 'Page Added By: ' + club.creator.username + ' -- ' + club.creator.email;
            previewContainer.append(creator);
        } else if (sessionStorage.getItem('loggedIn') === 'true' && sessionStorage.getItem('isAdmin') === 'true') {
            previewContainer.append(document.createElement('br'));
            const disapproveButton = document.createElement('button');
            disapproveButton.classList.add('preview-disapproveButton', 'btn', 'btn-primary');
            disapproveButton.innerHTML = 'Remove Club Approval';
            disapproveButton.onclick = () => {
                disapprove_club(club.id);
            }
            previewContainer.append(disapproveButton);
        }

        document.querySelector('#clubs-container').append(previewContainer);
    })
}

function show_club(id) {
    document.querySelector('#single-container').innerHTML = '';
    document.querySelector('#clubs-container').style.display = 'none';
    document.querySelector('#single-container').style.display = 'block';
    document.querySelector('#create-container').style.display = 'none';
    document.querySelector('#edit-container').style.display = 'none';
    document.querySelector('#editors-container').style.display = 'none';

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

        if (club.announcement != '') {
            const announcementLabel = document.createElement('h3');
            announcementLabel.id = 'single-announcementLabel';
            announcementLabel.innerHTML = 'Announcement(s):';
            document.querySelector('#single-container').append(announcementLabel);

            const announcement = document.createElement('h4');
            announcement.id = 'single-announcement';
            announcement.innerHTML = club.announcement;
            document.querySelector('#single-container').append(announcement);
        }

        if (club.image) {
            const image = document.createElement('img');
            image.id = 'single-image';
            image.src = club.image;
            document.querySelector('#single-container').append(image);
        }

        document.querySelector('#single-container').append(document.createElement('hr'));

        if (sessionStorage.getItem('clubType') !== 'pending') {
            const interestDisplay = document.createElement('h4');
            interestDisplay.id = 'single-interestDisplay';
            interestDisplay.innerHTML = 'Interested Users Count: ' + club.interestCount;
            document.querySelector('#single-container').append(interestDisplay);
            
            if (sessionStorage.getItem('loggedIn') === 'true') {
                const interestButtonInfo = document.createElement('div');
                interestButtonInfo.id = 'single-interestButtonInfo';
                interestButtonInfo.innerHTML = 'Are you interested in joining the club?';
                document.querySelector('#single-container').append(interestButtonInfo);

                const interestButton = document.createElement('button');
                interestButton.id = 'single-interestButton';
                interestButton.classList.add('btn', 'btn-primary');
                if (!club.interestedUsers.some(user => user.username === sessionStorage.getItem('username'))) {
                    // not interested yet
                    interestButton.innerHTML = 'Mark as Interesting';
                    interestButton.onclick = () => {
                        toggle_interest(true, club.id);
                    }
                } else {
                    // already interested
                    interestButton.innerHTML = 'Remove Interest';
                    interestButton.onclick = () => {
                        toggle_interest(false, club.id);
                    }
                }
                document.querySelector('#single-container').append(interestButton);
            }

            document.querySelector('#single-container').append(document.createElement('hr'));
            
            const messageLabel = document.createElement('h3');
            messageLabel.id = 'single-messageLabel';
            messageLabel.innerHTML = 'Message Board:';
            document.querySelector('#single-container').append(messageLabel);

            if (sessionStorage.getItem('loggedIn') == 'true') {
                const postContainer = document.querySelector('#post-container').cloneNode(true);
                postContainer.style.display = 'block'; // variable assigned above
                document.querySelector('#single-container').appendChild(postContainer);
                document.querySelector('#post-form').onsubmit = () => {
                    post_message(club.id);
                    return false;
                }
                
                document.querySelector('#single-container').append(document.createElement('hr'));
            }
            const postReplyContainer = document.querySelector('#postReply-container').cloneNode(true);
            show_messages(club.id, postReplyContainer);
        }
    });
}

function show_messages(clubID, postReplyContainer) {
    fetch(`/messages/${clubID}/${sessionStorage.getItem('messagePage')}`)
    .then(response => response.json())
    .then(messages => {
        const messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messages.forEach(message => {
            const singleMessage = document.createElement('div');
            singleMessage.classList.add('message-single');
            messageContainer.append(singleMessage);

            const poster = document.createElement('div');
            poster.classList.add('message-poster');
            poster.innerHTML = message.poster.username + " - " + message.poster.email;
            singleMessage.append(poster);

            const timestamp = document.createElement('div');
            timestamp.classList.add('message-timestamp');
            timestamp.innerHTML = message.timestamp;
            singleMessage.append(timestamp);

            const content = document.createElement('div');
            content.classList.add('message-content');
            content.innerHTML = message.content;
            singleMessage.append(content);

            show_replies(clubID, message, singleMessage, postReplyContainer);

            document.querySelector('#single-container').append(messageContainer);
        });
        show_pagenav(clubID);
    });
}

function show_replies(clubID, message, singleMessage, postReplyContainer) {
    const replyContainer = document.createElement('div');
    replyContainer.classList.add('reply-container');

    if (sessionStorage.getItem('loggedIn') == 'true') {
        const replyButton = document.createElement('button');
        replyButton.classList.add('btn', 'btn-primary', 'reply-button');
        replyButton.id = `reply-button-${message.id}`;
        replyButton.innerHTML = 'Reply';
        replyButton.onclick = () => {
            document.querySelector('#postReply-errorMessage').innerHTML = '';
            if (sessionStorage.getItem('replying') === `${message.id}`) {
                document.querySelector(`#reply-button-${message.id}`).innerHTML = 'Reply';
                sessionStorage.setItem('replying', -1);
                postReplyContainer.style.display = 'none';
            } else {
                if (sessionStorage.getItem('replying') !== '-1') {
                    // replying somewhere, not here
                    document.querySelector(`#reply-button-${sessionStorage.getItem('replying')}`).innerHTML = 'Reply';
                }
                document.querySelector(`#reply-button-${message.id}`).innerHTML = 'Cancel Reply';
                sessionStorage.setItem('replying', message.id);
                replyContainer.prepend(postReplyContainer);
                postReplyContainer.style.display = 'block';
                document.querySelector('#postReply-form').onsubmit = () => {
                    post_reply(clubID, message.id);
                    return false;
                };
            }
        };
        singleMessage.append(replyButton);
    }

    if (message.replies.length > 0) {
        const replyLabel = document.createElement('h5');
        replyLabel.classList.add('reply-label');
        replyLabel.innerHTML = 'Replies:';
        replyContainer.append(replyLabel);
    }

    message.replies.forEach(reply => {
        const singleReply = document.createElement('div');
        singleReply.classList.add('reply-single');
        replyContainer.append(singleReply);

        const poster = document.createElement('div');
        poster.classList.add('reply-poster');
        poster.innerHTML = reply.poster.username + " - " + reply.poster.email;
        singleReply.append(poster);

        const timestamp = document.createElement('div');
        timestamp.classList.add('reply-timestamp');
        timestamp.innerHTML = reply.timestamp;
        singleReply.append(timestamp);

        const content = document.createElement('div');
        content.classList.add('reply-content');
        content.innerHTML = reply.content;
        singleReply.append(content);
    });

    singleMessage.append(replyContainer);
}

function show_pagenav(clubID) {
    fetch(`/messages/${clubID}/${0}`)
    .then(response => response.json())
    .then(info => {
        const count = info.pageCount;
        
        if (count > 1) {
            const pageNav = document.createElement('nav');
            pageNav.setAttribute('id', 'page-nav');
            pageNav.setAttribute('aria-label', 'Message Page Navigation');

            const pageUL = document.createElement('ul');
            pageUL.classList.add('pagination');
            pageNav.append(pageUL);

            const prev = document.createElement('li');
            prev.classList.add('page-prev');
            pageUL.append(prev);

            const prevA = document.createElement('a');
            prevA.classList.add('page-link');
            prevA.href = '#';
            prevA.setAttribute('aria-label', 'Previous');
            prevA.onclick = () => {
                if (parseInt(sessionStorage.getItem('messagePage')) - 1 > 0) {
                    sessionStorage.setItem('messagePage', parseInt(sessionStorage.getItem('messagePage')) - 1);
                    sessionStorage.setItem('replying', -1);
                    show_club(clubID);
                }
            };
            prev.append(prevA);

            const prevSpan = document.createElement('span');
            prevSpan.classList.add('pagination-icon');
            prevSpan.setAttribute('aria-hidden', 'true');
            prevSpan.innerHTML = '&laquo;';
            prevA.append(prevSpan);

            for (let i = 1; i <= count; i++) {
                const single = document.createElement('li');
                single.classList.add('page-item');
                single.setAttribute('id', `page-${i}`);
                pageUL.append(single);

                const singleA = document.createElement('a');
                singleA.classList.add('page-link');
                singleA.href = '#';
                singleA.innerHTML = `${i}`;
                singleA.onclick = () => {
                    sessionStorage.setItem('messagePage', i);
                    sessionStorage.setItem('replying', -1);
                    show_club(clubID);
                };
                single.append(singleA);
            }

            const next = document.createElement('li');
            next.classList.add('page-next');
            pageUL.append(next);

            const nextA = document.createElement('a');
            nextA.classList.add('page-link');
            nextA.href = '#';
            nextA.setAttribute('aria-label', 'Next');
            nextA.onclick = () => {
                if (parseInt(sessionStorage.getItem('messagePage')) + 1 <= count) {
                    sessionStorage.setItem('messagePage', parseInt(sessionStorage.getItem('messagePage')) + 1);
                    sessionStorage.setItem('replying', -1);
                    show_club(clubID);
                }
            };
            next.append(nextA);

            const nextSpan = document.createElement('span');
            nextSpan.classList.add('pagination-icon');
            nextSpan.setAttribute('aria-hidden', 'true');
            nextSpan.innerHTML = '&raquo;';
            nextA.append(nextSpan);

            document.querySelector('#single-container').append(pageNav);
        }
    });
}

function submit_club() { // send request to add club if input is valid
    if (document.querySelector('#create-title').value === '') {
        document.querySelector('#create-errorMessage').innerHTML = 'Club must have title.';
    } else if (document.querySelector('#create-description').value === '') {
        document.querySelector('#create-errorMessage').innerHTML = 'Club must have description.';
    } else {
        const formData = new FormData(document.querySelector('#create-form'));
        const file = document.querySelector('#create-image-input').files[0];
        formData.append('title', document.querySelector('#create-title').value);
        formData.append('description', document.querySelector('#create-description').value);
        formData.append('announcement', document.querySelector('#create-announcement').value);
        formData.append('image', file);

        fetch('/create', {
            method: 'POST',
            body: formData
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

function post_reply(clubID, messageID) {
    if (document.querySelector('#postReply-content').value == '') {
        document.querySelector('#postReply-errorMessage').innerHTML = 'Reply must have content.';
    } else {
        fetch('/reply', {
            method: 'POST',
            body: JSON.stringify({
                messageID: messageID,
                content: document.querySelector('#postReply-content').value
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            document.querySelector('#postReply-errorMessage').innerHTML = '';
            document.querySelector('#postReply-content').value = '';
            document.querySelector('#postReply-container').style.display = 'none';
            show_club(clubID);
        })
    }
}

function edit_club() {
    if (document.querySelector('#edit-description').value === '') {
        document.querySelector('#edit-errorMessage').innerHTML = 'Club must have description.';
    } else {
        const formData = new FormData(document.querySelector('#edit-form'));
        const file = document.querySelector('#edit-image-input').files[0];
        formData.append('clubID', parseInt(sessionStorage.getItem('editing')));
        formData.append('description', document.querySelector('#edit-description').value);
        formData.append('announcement', document.querySelector('#edit-announcement').value);
        formData.append('noImage', document.querySelector('#edit-image-none').checked);
        formData.append('image', file);

        fetch('/edit/content', {
            method: 'POST', // uses post because of Django issues
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            document.querySelector('#edit-errorMessage').innerHTML = '';
            document.querySelector('#edit-container').style.display = 'none';
            sessionStorage.setItem('editing', -1);
            show_approved();
        });
    }
    return false;
}

function add_editor() {
    if (document.querySelector('#editors-add-input').value === '') {
        document.querySelector('#editors-errorMessage').innerHTML = 'Email must be provided to add editor.';
    } else {
        fetch('/edit/editors', {
            method: 'PATCH',
            body: JSON.stringify({
                clubID: parseInt(sessionStorage.getItem('editing')),
                editorEmail: document.querySelector('#editors-add-input').value
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            let email = document.querySelector('#editors-add-input').value;
            let invalidEmail = result.error === `User with email ${email} does not exist`;
            if (invalidEmail) {
                // invalid email inputted
                document.querySelector('#editors-errorMessage').innerHTML = `User with email \"${email}\" does not exist.`;
            } else {
                document.querySelector('#editors-errorMessage').innerHTML = '';
                document.querySelector('#editors-add-input').value = '';
                document.querySelector('#editors-remove-input').innerHTML = '';
                sessionStorage.setItem('editing', -1);
                show_approved();
            }
        })
    }
}

function remove_editor() {
    fetch('edit/editors', {
        method: 'PATCH',
        body: JSON.stringify({
            clubID: parseInt(sessionStorage.getItem('editing')),
            editorEmail: document.querySelector('#editors-remove-input').value
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        document.querySelector('#editors-errorMessage').innerHTML = '';
        document.querySelector('#editors-add-input').value = '';
        document.querySelector('#editors-remove-input').innerHTML = '';
        sessionStorage.setItem('editing', -1);
        show_approved();
    })
}

function toggle_interest(interested, clubID) {
    fetch('/edit/interest', {
        method: 'PATCH',
        body: JSON.stringify({
            clubID: clubID
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        document.querySelector('#single-interestDisplay').innerHTML = 'Interested Users Count: ' + result.interestCount;
        if (interested) {
            document.querySelector('#single-interestButton').innerHTML = 'Remove Interest';
            document.querySelector('#single-interestButton').onclick = () => {
                toggle_interest(false, result.id);
            }
        } else {
            document.querySelector('#single-interestButton').innerHTML = 'Mark as Interesting';
            document.querySelector('#single-interestButton').onclick = () => {
                toggle_interest(true, result.id);
            }
        }
    })
}

function approve_club(clubID) {
    fetch('/edit/approval', {
        method: 'PATCH',
        body: JSON.stringify({
            clubID: clubID,
            approval: true
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        show_approved();
    })
}

function disapprove_club(clubID) {
    fetch('/edit/approval', {
        method: 'PATCH',
        body: JSON.stringify({
            clubID: clubID,
            approval: false
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        show_pending();
    })
}