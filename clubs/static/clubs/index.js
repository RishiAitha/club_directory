document.addEventListener('DOMContentLoaded', function() { // on start
    // start by showing correct divs
    document.querySelector('#clubs-container').style.display = 'block';
    document.querySelector('#single-container').style.display = 'none';
    document.querySelector('#create-container').style.display = 'none';
    document.querySelector('#edit-container').style.display = 'none';
    
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

            // clear creation fields
            document.querySelector('#create-title').value = '';
            document.querySelector('#create-description').value = '';
            document.querySelector('#create-announcement').value = '';
            document.querySelector('#create-errorMessage').innerHTML = '';
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
    
    document.querySelector('#clubs-container').innerHTML = '';
    sessionStorage.setItem('clubType', 'pending');

    fetch('/pending')
    .then(response => response.json())
    .then(clubs => {
        show_previews(clubs);
    });
}

function show_previews(clubs) {
    clubs.forEach(club => {
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
            announcement.innerHTML = 'Announcement: ' + club.announcement;
            announcement.classList.add('preview-announcement');
            previewContainer.append(announcement);
        }

        // may need to add if statement like announcements
        const image = document.createElement('div');
        image.innerHTML = '--image here--'
        image.classList.add('preview-image');
        previewContainer.append(image);

        if (sessionStorage.getItem('loggedIn') === 'true' && (club.editors.some(user => user.username === sessionStorage.getItem('username')) || sessionStorage.getItem('isAdmin') === 'true')) {
            const editContentButton = document.createElement('button');
            editContentButton.classList.add('preview-editContentButton', 'btn', 'btn-primary');
            editContentButton.innerHTML = 'Edit Club Content';
            editContentButton.onclick = () => {
                // display editing interface
                document.querySelector('#clubs-container').style.display = 'none';
                document.querySelector('#single-container').style.display = 'none';
                document.querySelector('#create-container').style.display = 'none';
                document.querySelector('#edit-container').style.display = 'block';

                document.querySelector('#edit-title').value = club.title;
                document.querySelector('#edit-description').value = club.description;
                document.querySelector('#edit-announcement').value = club.announcement;
                sessionStorage.setItem('editing', club.id);
            }
            previewContainer.append(editContentButton);

            const editEditorsButton = document.createElement('button');
            editEditorsButton.classList.add('preview-editEditorsButton', 'btn', 'btn-primary');
            editEditorsButton.innerHTML = 'Change Club Editors';
            editEditorsButton.onclick = () => {
                console.log('changed club editors! (not yet)');
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
            announcementLabel.innerHTML = 'Announcement:';
            document.querySelector('#single-container').append(announcementLabel);

            const announcement = document.createElement('h4');
            announcement.id = 'single-announcement';
            announcement.innerHTML = club.announcement;
            document.querySelector('#single-container').append(announcement);
        }

        // may need to add if statement like announcements
        const image = document.createElement('div');
        image.id = 'single-image';
        image.innerHTML = '--image here--';
        document.querySelector('#single-container').append(image);

        document.querySelector('#single-container').append(document.createElement('hr'));

        const interestDisplay = document.createElement('h4');
        interestDisplay.id = 'single-interestDisplay';
        interestDisplay.innerHTML = 'Interested Users Count: ' + club.interestCount;
        document.querySelector('#single-container').append(interestDisplay);
        
        if (sessionStorage.getItem('loggedIn') === 'true') {
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
        fetch('/edit/content', {
            method: 'PUT',
            body: JSON.stringify({
                clubID: parseInt(sessionStorage.getItem('editing')),
                description: document.querySelector('#edit-description').value,
                announcement: document.querySelector('#edit-announcement').value
            })
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

function toggle_interest(interested, clubID) {
    fetch('/edit/interest', {
        method: 'PUT',
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
        method: 'PUT',
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
        method: 'PUT',
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