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

    if (sessionStorage.getItem('loggedIn') === 'true') { // if user is currently logged in
        // get user info
        sessionStorage.setItem('username', document.querySelector('#nav-username').firstChild.innerHTML);
        sessionStorage.setItem('isAdmin', document.querySelector('#admin-nav') !== null);
    
        // allow user to create new club
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
            document.querySelector('#create-formLink').value = '';
            document.querySelector('#create-errorMessage').innerHTML = '';
            document.querySelector('#create-image-input').value = '';

            // set up image input
            document.querySelector('#create-image-input').addEventListener('change', (event) => {
                // show image preview
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.querySelector('#create-image-preview').src = e.target.result;
                    };
                    reader.readAsDataURL(file);

                    // set up image upload removal option
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

        // allow user to see pending clubs if they are an admin
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

    fetch('/approved') // get all approved clubs and show their previews
    .then(response => response.json())
    .then(clubs => {
        show_previews(clubs);
    });
}

function show_pending() { // show all pending clubs
    // set correct divs to show
    document.querySelector('#clubs-container').style.display = 'block';
    document.querySelector('#single-container').style.display = 'none';
    document.querySelector('#create-container').style.display = 'none';
    document.querySelector('#edit-container').style.display = 'none';
    document.querySelector('#editors-container').style.display = 'none';
    
    document.querySelector('#clubs-container').innerHTML = '';
    sessionStorage.setItem('clubType', 'pending');

    // show more information for pending requests
    const adminTitle = document.createElement('h2');
    adminTitle.id = 'pending-adminTitle';
    adminTitle.innerHTML = 'Pending Club Requests';
    document.querySelector('#clubs-container').append(adminTitle);

    const adminInfo = document.createElement('p');
    adminInfo.id = 'pending-adminInfo';
    adminInfo.innerHTML = 'Approve clubs if they are suitable for the main page and are real clubs, or change the content to ensure they are suitable. If needed, contact the creator of the club page using their email. Clubs that should not be added can be left on the pending page.'
    document.querySelector('#clubs-container').append(adminInfo);

    fetch('/pending') // get all pending clubs and show their previews
    .then(response => response.json())
    .then(clubs => {
        show_previews(clubs);
    });
}

function show_previews(clubs) { // show a preview of a club
    clubs.forEach(club => { // iterate through each club
        // add info and options for current club
        const previewContainer = document.createElement('div'); // hold all info here
        previewContainer.classList.add('preview-container');

        const title = document.createElement('h1'); // display title of club
        title.innerHTML = club.title;
        title.classList.add('preview-title');
        title.addEventListener('click', function() { // show club page when title is clicked
            show_club(club.id);
        })
        previewContainer.append(title);

        if (club.announcement != '') {
            const announcement = document.createElement('h4'); // show club announcement if possible
            announcement.innerHTML = 'Announcement(s): ' + club.announcement;
            announcement.classList.add('preview-announcement');
            previewContainer.append(announcement);
        }

        if (club.image) {
            const image = document.createElement('img'); // display club image if possible
            image.src = club.image;
            image.classList.add('preview-image');
            image.addEventListener('click', function() { // show club page when image is clicked
                show_club(club.id);
            });

            previewContainer.append(image);

            previewContainer.append(document.createElement('br'));
        }

        // if user is logged in and is either a club editor or admin
        if (sessionStorage.getItem('loggedIn') === 'true' && (club.editors.some(user => user.username === sessionStorage.getItem('username')) || sessionStorage.getItem('isAdmin') === 'true')) {
            // allow user to edit club page content
            const editContentButton = document.createElement('button');
            editContentButton.classList.add('preview-editContentButton', 'btn', 'btn-primary', 'btn-lg');
            editContentButton.innerHTML = 'Edit Club Page Content';
            editContentButton.onclick = () => {
                // display editing interface
                document.querySelector('#clubs-container').style.display = 'none';
                document.querySelector('#single-container').style.display = 'none';
                document.querySelector('#create-container').style.display = 'none';
                document.querySelector('#edit-container').style.display = 'block';
                document.querySelector('#editors-container').style.display = 'none';

                // preset editing fields
                document.querySelector('#edit-title').value = club.title;
                document.querySelector('#edit-description').value = club.description;
                document.querySelector('#edit-announcement').value = club.announcement;
                document.querySelector('#edit-formLink').value = club.formLink;
                document.querySelector('#edit-image-input').value = '';
                document.querySelector('#edit-image-preview').src = '#';
                document.querySelector('#edit-image-remove').style.display = 'none';
                document.querySelector('#edit-image-none').checked = false;
                
                sessionStorage.setItem('editing', club.id); // store club that is currently being edited

                // load or remove preview image when change to image upload occurs
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

            // allow user to change authorized club editors
            const editEditorsButton = document.createElement('button');
            editEditorsButton.classList.add('preview-editEditorsButton', 'btn', 'btn-primary', 'btn-lg');
            editEditorsButton.innerHTML = 'Change Authorized Club Editors';
            editEditorsButton.onclick = () => {
                // display editors interface
                document.querySelector('#clubs-container').style.display = 'none';
                document.querySelector('#single-container').style.display = 'none';
                document.querySelector('#create-container').style.display = 'none';
                document.querySelector('#edit-container').style.display = 'none';
                document.querySelector('#editors-container').style.display = 'block';

                // preset fields
                document.querySelector('#editors-add-input').value = '';
                document.querySelector('#editors-display').innerHTML = 'Change Club Editors -- ' + club.title;

                // set up list of editors that can be removed
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

        if (sessionStorage.getItem('clubType') === 'pending') { // if clubs being displayed are pending
            // set up approval option for admins
            previewContainer.append(document.createElement('br'));
            const approveButton = document.createElement('button');
            approveButton.classList.add('preview-approveButton', 'btn', 'btn-primary', 'btn-lg');
            approveButton.innerHTML = 'Approve Club';
            approveButton.onclick = () => { // approve club when clicked
                approve_club(club.id);
            }
            previewContainer.append(approveButton);

            // display extra admin info
            const timestamp = document.createElement('p');
            timestamp.classList.add('preview-timestamp');
            timestamp.innerHTML = 'Added ' + convert_timestamp(club.timestamp + ' UTC');
            previewContainer.append(timestamp);

            const creator = document.createElement('p');
            creator.classList.add('preview-creator');
            creator.innerHTML = 'Page Added By: ' + club.creator.username + ' -- ' + club.creator.email;
            previewContainer.append(creator);
        } else if (sessionStorage.getItem('loggedIn') === 'true' && sessionStorage.getItem('isAdmin') === 'true') { // if normal clubs are being displayed to an admin
            // set up disapproval option for admins
            previewContainer.append(document.createElement('br'));
            const disapproveButton = document.createElement('button');
            disapproveButton.classList.add('preview-disapproveButton', 'btn', 'btn-primary', 'btn-lg');
            disapproveButton.innerHTML = 'Remove Club Approval';
            disapproveButton.onclick = () => { // disapprove club when clicked
                disapprove_club(club.id);
            }
            previewContainer.append(disapproveButton);
        }

        document.querySelector('#clubs-container').append(previewContainer);
    })
}

function show_club(id) { // show a page for a club
    // show correct divs for club
    document.querySelector('#single-container').innerHTML = '';
    document.querySelector('#clubs-container').style.display = 'none';
    document.querySelector('#single-container').style.display = 'block';
    document.querySelector('#create-container').style.display = 'none';
    document.querySelector('#edit-container').style.display = 'none';
    document.querySelector('#editors-container').style.display = 'none';

    fetch(`/club/${id}`) // get club info
    .then(response => response.json())
    .then(club => {
        const title = document.createElement('h1'); // show title of club
        title.id = 'single-title';
        title.innerHTML = club.title;
        document.querySelector('#single-container').append(title);

        if (club.image) {
            const imageContainer = document.createElement('div');
            imageContainer.id = 'single-imageContainer';
            document.querySelector('#single-container').append(imageContainer);

            const image = document.createElement('img'); // display club image if possible
            image.id = 'single-image';
            image.src = club.image;
            imageContainer.append(image);
        }

        const infoContainer = document.createElement('div');
        infoContainer.id = 'single-infoContainer';
        document.querySelector('#single-container').append(infoContainer);

        const descriptionContainer = document.createElement('div');
        descriptionContainer.id = 'single-descriptionContainer';
        infoContainer.append(descriptionContainer);

        const descriptionLabel = document.createElement('h3'); // indicate club description
        descriptionLabel.id = 'single-descriptionLabel';
        descriptionLabel.innerHTML = 'Description:';
        descriptionContainer.append(descriptionLabel);

        const description = document.createElement('p'); // show club description
        description.id = 'single-description';
        description.innerHTML = club.description;
        descriptionContainer.append(description);

        if (club.announcement != '') {
            const announcementContainer = document.createElement('div');
            announcementContainer.id = 'single-announcementContainer';
            infoContainer.append(announcementContainer);

            const announcementLabel = document.createElement('h3'); // indicate club announcement if needed
            announcementLabel.id = 'single-announcementLabel';
            announcementLabel.innerHTML = 'Announcement(s):';
            announcementContainer.append(announcementLabel);

            const announcement = document.createElement('p'); // show club announcement if possible
            announcement.id = 'single-announcement';
            announcement.innerHTML = club.announcement;
            announcementContainer.append(announcement);
        }
        
        // if clubs being displayed are not pending clubs, allow general interaction
        // otherwise general interaction should not be possible since the club is not in the main page yet
        if (sessionStorage.getItem('clubType') !== 'pending') {
            document.querySelector('#single-container').append(document.createElement('hr'));

            const interestContainer = document.createElement('div');
            interestContainer.id = 'single-interestContainer';
            document.querySelector('#single-container').append(interestContainer);

            const interestDisplay = document.createElement('h3'); // show current number of interested users
            interestDisplay.id = 'single-interestDisplay';
            interestDisplay.innerHTML = 'Interested Users Count: ' + club.interestCount;
            interestContainer.append(interestDisplay);
            
            // allow user to mark a club as interesting
            if (sessionStorage.getItem('loggedIn') === 'true') {
                const interestButtonInfo = document.createElement('p'); // indicate how interest button works
                interestButtonInfo.id = 'single-interestButtonInfo';
                interestButtonInfo.innerHTML = 'Are you interested in joining the club? (This just shows the officers general interest in the club, and does not count as registration.)';
                interestContainer.append(interestButtonInfo);

                const interestButtonNote = document.createElement('p'); // extra info for the interest button
                interestButtonNote.id = 'single-interestButtonNote';
                interestButtonNote.innerHTML = '**If you are now a club member, or are no longer interested, please remove interest for a more accurate measure!';
                interestContainer.append(interestButtonNote);

                const interestButton = document.createElement('button');
                interestButton.id = 'single-interestButton';
                interestButton.classList.add('btn', 'btn-primary', 'btn-lg');
                if (!club.interestedUsers.some(user => user.username === sessionStorage.getItem('username'))) { // checks if user is interested or not
                    // not interested yet
                    interestButton.innerHTML = 'Mark as Interesting';
                    interestButton.onclick = () => { // mark club as interesting
                        toggle_interest(true, club.id);
                    }
                } else {
                    // already interested
                    interestButton.innerHTML = 'Remove Interest';
                    interestButton.onclick = () => { // mark club as uninteresting
                        toggle_interest(false, club.id);
                    }
                }
                interestContainer.append(interestButton);

                document.querySelector('#single-container').append(document.createElement('hr'));

                if (club.formLink != '') {
                    const formContainer = document.createElement('div');
                    formContainer.id = 'single-formContainer';
                    document.querySelector('#single-container').append(formContainer);
    
                    const formLabel = document.createElement('h3');
                    formLabel.id = 'single-formLabel';
                    formLabel.innerHTML = 'Google Form:'
                    formContainer.append(formLabel);
    
                    const formInfo = document.createElement('p');
                    formInfo.id = 'single-formInfo';
                    formInfo.innerHTML = 'If you are interested, please fill the form below!';
                    formContainer.append(formInfo);
    
                    const formNote = document.createElement('p');
                    formNote.id = 'single-formNote';
                    formNote.innerHTML = 'You may be prompted to sign in and be taken to the form on another tab. Then, the form will be greyed out here but you can access it again when you refresh this page and also in the tab it opens in. Here is the direct form link:';
                    formContainer.append(formNote);
    
                    const formLink = document.createElement('a');
                    formLink.id = 'single-formLink';
                    formLink.href = club.formLink;
                    formLink.innerHTML = club.formLink;
                    formContainer.append(formLink);
    
                    formContainer.append(document.createElement('p'));
                    
                    const formEmbed = document.createElement('iframe');
                    formEmbed.id = 'single-formEmbed';
                    formEmbed.innerHTML = 'Loading...';
                    formEmbed.setAttribute('src', club.formLink + '&embedded=true');
                    formEmbed.setAttribute('frameborder', 0);
                    formEmbed.setAttribute('marginheight', 0);
                    formEmbed.setAttribute('marginwidth', 0);
                    formContainer.append(formEmbed);
                }
            }

            document.querySelector('#single-container').append(document.createElement('hr'));
            
            const postReplyContainer = document.querySelector('#postReply-container').cloneNode(true); // create reply option that switches between messages
            show_messages(club.id, postReplyContainer); // show club messages
        } else { // club is pending
            document.querySelector('#single-container').append(document.createElement('hr'));

            const pendingLabelContainer = document.createElement('div');
            pendingLabelContainer.id = 'single-pendingLabelContainer';
            document.querySelector('#single-container').append(pendingLabelContainer);

            const pendingLabel = document.createElement('h3');
            pendingLabel.id = 'single-pendingLabel';
            pendingLabel.innerHTML = 'Approve the club to see the interest count and message board!';
            pendingLabelContainer.append(pendingLabel);

            if (club.formLink != '') {
                const formLinkLabel = document.createElement('a');
                formLinkLabel.id = 'single-formLinkLabel';
                formLinkLabel.href = club.formLink;
                formLinkLabel.innerHTML = 'Here is the Google Form link provided (respond only when needed): ' + club.formLink;
                pendingLabelContainer.append(formLinkLabel);
            }
        }
    });
}

function show_messages(clubID, postReplyContainer) { // show the messages for a club page
    fetch(`/messages/${clubID}/${sessionStorage.getItem('messagePage')}`) // get messages based on club and page
    .then(response => response.json())
    .then(messages => {
        if (sessionStorage.getItem('loggedIn') === 'true') { // if there are messages and user is logged in
            const messageLabel = document.createElement('h2'); // indicate message board
            messageLabel.id = 'single-messageLabel';
            messageLabel.innerHTML = 'Message Board:';
            document.querySelector('#single-container').append(messageLabel);

            const postContainer = document.querySelector('#post-container').cloneNode(true); // get post option to add to page
            postContainer.style.display = 'block';
            document.querySelector('#single-container').appendChild(postContainer);
            document.querySelector('#post-form').onsubmit = () => { // post message if post form is submitted
                post_message(clubID);
                return false;
            }
            
            document.querySelector('#single-container').append(document.createElement('hr'));
            const messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messages.forEach(message => { // iterate through messages (maximum of 10)
                const singleMessage = document.createElement('div'); // hold each message separately
                singleMessage.classList.add('message-single');
                messageContainer.append(singleMessage);

                const messageInfo = document.createElement('div');
                messageInfo.classList.add('message-info');
                singleMessage.append(messageInfo);

                const poster = document.createElement('div'); // show message poster info
                poster.classList.add('message-poster');
                poster.innerHTML = message.poster.username + " - " + message.poster.email;
                messageInfo.append(poster);

                const timestamp = document.createElement('div'); // show when message was posted
                timestamp.classList.add('message-timestamp');
                timestamp.innerHTML = convert_timestamp(message.timestamp + ' UTC');
                messageInfo.append(timestamp);

                messageInfo.append(document.createElement('br'));

                const content = document.createElement('p'); // show message content
                content.classList.add('message-content');
                content.innerHTML = message.content;
                singleMessage.append(content);

                singleMessage.append(document.createElement('hr'));

                show_replies(clubID, message, singleMessage, postReplyContainer); // show replies of message and other related items

                document.querySelector('#single-container').append(messageContainer);
            });
            show_pagenav(clubID); // after all the messages, show navigation to switch around the messages
        } else {
            const loginLabelContainer = document.createElement('div');
            loginLabelContainer.id = 'single-loginLabelContainer';
            document.querySelector('#single-container').append(loginLabelContainer);

            const loginLabel = document.createElement('a'); // indicate message board
            loginLabel.id = 'single-loginLabel';
            loginLabel.innerHTML = 'Log in to post messages and provide input!';
            loginLabel.href = 'login';
            loginLabelContainer.append(loginLabel);
        }
    });
}

function show_replies(clubID, message, singleMessage, postReplyContainer) { // show the replies for a message
    const replyContainer = document.createElement('div');
    replyContainer.classList.add('reply-container');

    if (sessionStorage.getItem('loggedIn') == 'true') { // if the user is logged in
        // allow user to reply to a message
        const replyButtonContainer = document.createElement('div');
        replyButtonContainer.classList.add('reply-buttonContainer');
        singleMessage.append(replyButtonContainer);

        const replyButton = document.createElement('button');
        replyButton.classList.add('btn', 'btn-primary', 'reply-button', 'btn-lg');
        replyButton.id = `reply-button-${message.id}`;
        replyButton.innerHTML = 'Reply';
        replyButton.onclick = () => { // show or remove replying option
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
                document.querySelector('#postReply-form').onsubmit = () => { // post reply when form is submitted
                    post_reply(clubID, message.id);
                    return false;
                };
            }
        };
        replyButtonContainer.append(replyButton);
    }

    if (message.replies.length > 0) { // indicate message replies
        const replyLabel = document.createElement('h4');
        replyLabel.classList.add('reply-label');
        replyLabel.innerHTML = 'Replies:';
        replyContainer.append(replyLabel);
    }

    message.replies.forEach(reply => { // iterate through replies
        // display reply and relevant info
        const singleReply = document.createElement('div'); // hold each reply separately
        singleReply.classList.add('reply-single');
        replyContainer.append(singleReply);

        const poster = document.createElement('div'); // show reply poster info
        poster.classList.add('reply-poster');
        poster.innerHTML = reply.poster.username + " - " + reply.poster.email;
        singleReply.append(poster);

        const timestamp = document.createElement('div'); // show when reply was posted
        timestamp.classList.add('reply-timestamp');
        timestamp.innerHTML = convert_timestamp(reply.timestamp + ' UTC');
        singleReply.append(timestamp);

        const content = document.createElement('p'); // show reply content
        content.classList.add('reply-content');
        content.innerHTML = reply.content;
        singleReply.append(content);
    });

    singleMessage.append(replyContainer);
}

function convert_timestamp(timestamp) {
    const utcDate = new Date(timestamp);
    const options = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short"
    };
    const localTime = utcDate.toLocaleString("en-US", options);
    return localTime;
}

function show_pagenav(clubID) { // show page navigation for message board
    fetch(`/messages/${clubID}/${0}`) // get amount of pages
    .then(response => response.json())
    .then(info => {
        const count = info.pageCount; // store page count
        
        if (count > 1) { // if there is more than one page then page navigation is needed
            // set up page navigation
            const pageNav = document.createElement('nav');
            pageNav.setAttribute('id', 'page-nav');
            pageNav.setAttribute('aria-label', 'Message Page Navigation');

            const pageUL = document.createElement('ul');
            pageUL.classList.add('pagination', 'pagination-lg');
            pageNav.append(pageUL);

            const prev = document.createElement('li');
            prev.classList.add('page-prev');
            pageUL.append(prev);

            const prevA = document.createElement('a');
            prevA.classList.add('page-link', 'text-dark');
            prevA.href = '#';
            prevA.setAttribute('aria-label', 'Previous');
            prevA.onclick = () => { // store previous page number and reload club page if possible
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

            for (let i = 1; i <= count; i++) { // add options for each page
                const single = document.createElement('li');
                single.classList.add('page-item');
                single.setAttribute('id', `page-${i}`);
                pageUL.append(single);

                const singleA = document.createElement('a');
                singleA.classList.add('page-link', 'text-dark');
                singleA.href = '#';
                singleA.innerHTML = `${i}`;
                singleA.onclick = () => { // store selected page number and reload club page
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
            nextA.classList.add('page-link', 'text-dark');
            nextA.href = '#';
            nextA.setAttribute('aria-label', 'Next');
            nextA.onclick = () => { // store next page number and reload club page if possible
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

function submit_club() { // send request to add club
    if (document.querySelector('#create-title').value === '') { // if no title is provided, show error
        document.querySelector('#create-errorMessage').innerHTML = 'Club must have title.';
    } else if (document.querySelector('#create-description').value === '') { // if no description is provided, show error
        document.querySelector('#create-errorMessage').innerHTML = 'Club must have description.';
    } else if (document.querySelector('#create-formLink').value !== '' && (!document.querySelector('#create-formLink').value.includes('docs.google.com/forms/') || document.querySelector('#create-formLink').value.includes('</iframe>'))) {
        document.querySelector('#create-errorMessage').innerHTML = 'Google Form link must be a non-shortened link copied from the Google Forms editor share/send page.';
    } else {
        // store club information to be sent
        const formData = new FormData(document.querySelector('#create-form')); // create FormData object to hold info
        const file = document.querySelector('#create-image-input').files[0]; // get uploaded image file
        // store info in formData
        formData.append('title', document.querySelector('#create-title').value);
        formData.append('description', document.querySelector('#create-description').value);
        formData.append('announcement', document.querySelector('#create-announcement').value);
        formData.append('formLink', document.querySelector('#create-formLink').value);
        formData.append('image', file);

        fetch('/create', { // send club info to server
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            // remove error and hide creation page
            document.querySelector('#create-errorMessage').innerHTML = '';
            document.querySelector('#create-container').style.display = 'none';
            document.querySelector('#create-image-input').value = '';
            document.querySelector('#create-image-preview').src = '#';
            document.querySelector('#create-image-remove').style.display = 'none';
            show_approved(); // show approved clubs
        });
    }
    return false;
}

function post_message(clubID) { // send request to post message
    if (document.querySelector('#post-content').value == '') { // if no content is provided, show error
        document.querySelector('#post-errorMessage').innerHTML = 'Message must have content.';
    } else {
        fetch('/post', { // send message info to server
            method: 'POST',
            body: JSON.stringify({
                clubID: clubID,
                content: document.querySelector('#post-content').value
            })
        })
        .then(response => response.json())
        .then(result => {
            // remove error and reset post fields
            document.querySelector('#post-errorMessage').innerHTML = '';
            document.querySelector('#post-content').value = '';
            sessionStorage.setItem('messagePage', 1);
            show_club(clubID); // show club that message was posted to
        })
    }

    return false;
}

function post_reply(clubID, messageID) { // send request to post reply
    if (document.querySelector('#postReply-content').value == '') { // if no content is provided, show error
        document.querySelector('#postReply-errorMessage').innerHTML = 'Reply must have content.';
    } else {
        fetch('/reply', { // send reply info to server
            method: 'POST',
            body: JSON.stringify({
                messageID: messageID,
                content: document.querySelector('#postReply-content').value
            })
        })
        .then(response => response.json())
        .then(result => {
            // remove error, reset reply fields, and hide reply option
            document.querySelector('#postReply-errorMessage').innerHTML = '';
            document.querySelector('#postReply-content').value = '';
            document.querySelector('#postReply-container').style.display = 'none';
            sessionStorage.setItem('replying', -1);
            show_club(clubID); // show club that reply was posted to
        })
    }
}

function edit_club() { // send request to edit club content
    if (document.querySelector('#edit-description').value === '') { // if no description is provided, show error
        document.querySelector('#edit-errorMessage').innerHTML = 'Club must have description.';
    } else if (document.querySelector('#edit-formLink').value !== '' && (!document.querySelector('#edit-formLink').value.includes('docs.google.com/forms/') || document.querySelector('#edit-formLink').value.includes('</iframe>'))) {
        document.querySelector('#edit-errorMessage').innerHTML = 'Google Form link must be a non-shortened link copied from the Google Forms editor share/send page.';
    } else {
        // store edited club information
        const formData = new FormData(document.querySelector('#edit-form')); // create FormData object to hold info
        const file = document.querySelector('#edit-image-input').files[0]; // get uploaded image file
        // store info in formData
        formData.append('clubID', parseInt(sessionStorage.getItem('editing')));
        formData.append('description', document.querySelector('#edit-description').value);
        formData.append('announcement', document.querySelector('#edit-announcement').value);
        formData.append('formLink', document.querySelector('#edit-formLink').value);
        formData.append('noImage', document.querySelector('#edit-image-none').checked);
        formData.append('image', file);

        fetch('/edit/content', { // send edited club info to server
            method: 'POST', // uses POST because of lack of support to send formData on Django through PATCH requests
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            // remove error, hide editing page, and change editing status
            document.querySelector('#edit-errorMessage').innerHTML = '';
            document.querySelector('#edit-container').style.display = 'none';
            sessionStorage.setItem('editing', -1);
            if (sessionStorage.getItem('clubType') === 'approved') {
                show_approved();
            } else {
                show_pending();
            }
        });
    }
    return false;
}

function add_editor() { // send request to add an authorized club editor
    if (document.querySelector('#editors-add-input').value === '') { // if no email is provided, show error
        document.querySelector('#editors-errorMessage').innerHTML = 'Email must be provided to add editor.';
    } else {
        fetch('/edit/editors', { // send editor info to server
            method: 'PATCH',
            body: JSON.stringify({
                clubID: parseInt(sessionStorage.getItem('editing')),
                editorEmail: document.querySelector('#editors-add-input').value
            })
        })
        .then(response => response.json())
        .then(result => {
            // get email that user provided
            let email = document.querySelector('#editors-add-input').value;
            let invalidEmail = result.error === `User with email ${email} does not exist`; // check if an invalid email was given
            if (invalidEmail) {
                // invalid email inputted
                document.querySelector('#editors-errorMessage').innerHTML = `User with email \"${email}\" does not exist.`;
            } else {
                // reset editing fields and change editing status
                document.querySelector('#editors-errorMessage').innerHTML = '';
                document.querySelector('#editors-add-input').value = '';
                document.querySelector('#editors-remove-input').innerHTML = '';
                sessionStorage.setItem('editing', -1);
                if (sessionStorage.getItem('clubType') === 'approved') {
                    show_approved();
                } else {
                    show_pending();
                }
            }
        })
    }
}

function remove_editor() { // send request to remove an authorized club editor
    fetch('edit/editors', { // send editor info to server
        method: 'PATCH',
        body: JSON.stringify({
            clubID: parseInt(sessionStorage.getItem('editing')),
            editorEmail: document.querySelector('#editors-remove-input').value
        })
    })
    .then(response => response.json())
    .then(result => {
        // guaranteed to send a valid editor due to the list of editor options to remove coming from the server itself
        // reset editing fields and change editing status
        document.querySelector('#editors-errorMessage').innerHTML = '';
        document.querySelector('#editors-add-input').value = '';
        document.querySelector('#editors-remove-input').innerHTML = '';
        sessionStorage.setItem('editing', -1);
        if (sessionStorage.getItem('clubType') === 'approved') {
            show_approved();
        } else {
            show_pending();
        }
    })
}

function toggle_interest(interested, clubID) { // toggle user's interest in a club
    fetch('/edit/interest', { // send club that user toggled interest for to server
        method: 'PATCH',
        body: JSON.stringify({
            clubID: clubID
        })
    })
    .then(response => response.json())
    .then(result => {
        document.querySelector('#single-interestDisplay').innerHTML = 'Interested Users Count: ' + result.interestCount; // update interest count display
        if (interested) {
            // allow user to remove interest status
            document.querySelector('#single-interestButton').innerHTML = 'Remove Interest';
            document.querySelector('#single-interestButton').onclick = () => {
                toggle_interest(false, result.id);
            }
        } else {
            // allow user to add interest status
            document.querySelector('#single-interestButton').innerHTML = 'Mark as Interesting';
            document.querySelector('#single-interestButton').onclick = () => {
                toggle_interest(true, result.id);
            }
        }
    })
}

function approve_club(clubID) { // set a club as approved
    fetch('/edit/approval', { // send club and approval info to server
        method: 'PATCH',
        body: JSON.stringify({
            clubID: clubID,
            approval: true
        })
    })
    .then(response => response.json())
    .then(result => {
        show_approved(); // show approved clubs
    })
}

function disapprove_club(clubID) { // remove a club's approval
    fetch('/edit/approval', { // send club and approval info to server
        method: 'PATCH',
        body: JSON.stringify({
            clubID: clubID,
            approval: false
        })
    })
    .then(response => response.json())
    .then(result => {
        show_pending(); // show pending clubs
    })
}