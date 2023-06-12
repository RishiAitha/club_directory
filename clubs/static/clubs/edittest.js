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