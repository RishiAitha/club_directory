# Club Directory - CS50W Capstone
---

## Project Overview
This website is a submission for the CS50W Capstone Project, and is made by Rishi Aitha. The purpose of the site is to provide easy organization and access for information on clubs and activites at a school. I plan on deploying the site and offering it for my own school to use for the students.

The idea arose because of the confusion that myself and many other students faced when deciding what kinds of opportunities and activites we wanted to pursue in the beginning of high school. This website could be a great source of information and discussion to help students find clubs that they can be passionate about.

The administration features and security would allow a school to easily manage the site without worry of malicious attacks and inaccurate information. The users can easily understand how to navigate the site and there are several useful features such as the message board that help students gain valuable insight into their interests and questions.

---
## Distinctiveness and Complexity
### Distinctiveness from previous projects:
This project is significantly distinct from previous work in the CS50W course while still using the ideas and strategies covered in the lectures and projects (other ideas and strategies used are cited below). The aspects of messaging are used and implemented differently compared to previous email and network projects and more features have been added compared to before (such as replies). The focus of the site is managing information rather than communication, so it is very different compared to the communication sites made previously.

The real-life application also makes the website very distinctive, as the admin features and information stored are completely different from other work.

### Complexity in comparison to previous projects:
This project is significantly more complex than any other CS50W projects that I have made before, with more in-depth work in all aspects of the code.

The administration feature of approving clubs before adding them is a new system that has not been implemented in previous projects. The message board contains replies and improved display/organization that is even more useful and robust compared to the network and email projects, and it is only one part of one section of the website. The editing features are more thorough and the system of "authorized editors" for each club creates more complexity while improving the website. Small features like the interest count of a club also provide more complexity to the project.

The largest point of complexity and difficulty for me when creating the project was the images, as the image storage and uploading systems were more complex and in-depth compared to any specifications that were required in previous projects.

Along with the images (which were stored in a Docker volume), the structure of the website during development created more complexity. The website is run on a Docker container using a PostgresSQL database. While these concepts were introduced in the lectures, implementing them onto a robust Django project with features like image upload and storage was a challenge and made the project more complex while making it more scalable, easier to share, and easier to deploy.

---
## File Overview
 - club_directory folder: manages Django project and contains settings and other files
 - settings.py: modified to work for images and static files
 - Dockerfile: defines initial process for Docker container
 - docker-compose.yml: defines docker container structure
 - .dockerignore: stops some files from being managed in the container
 - requirements.txt: contains all required Python packages for the project to run
 - clubs folder: contains all files related to the clubs application in my Django project
 - favicon.ico: placeholder icon file to display in the site tab
 - index.js: this is the bulk of the website logic, it manages all the information display and all the user input and interaction
 - styles.css: manages the style and mobile compatibility of the website
 - index.html: file used to display the main page content using the divs added in JavaScript, and also holds forms and other sections of the website to be displayed
 - layout.html: main html layout of the website containing the navbar and script/style links and sections
 - login.html, register.html: contains form to login and register to the website
 - admin.py: manages the admin display of and interaction with website data
 - models.py: outlines the structure that website data is stored
 - urls.py: defines all the clubs application urls (API routes and account management routes)
 - views.py: defines all API routes and account management routes to store and change the website data using JavaScript fetch calls
---
## How to Set Up and Run Website
### Requirements:
### Process:

---
## Citations
### Strategies:
FormData for managing image files:
https://developer.mozilla.org/en-US/docs/Web/API/FormData
https://www.freecodecamp.org/news/formdata-explained/
https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
https://docs.djangoproject.com/en/4.2/ref/request-response/

Docker and Postgres setup:
https://learndjango.com/tutorials/django-docker-and-postgresql-tutorial

Image Storage:
https://docs.djangoproject.com/en/4.2/topics/files/
https://www.section.io/engineering-education/an-extensive-guide-on-handling-images-in-django/
https://medium.com/@seanoughton/docker-data-volumes-32d83b334d
https://docs.docker.com/storage/volumes/

API info:
https://www.geeksforgeeks.org/difference-between-put-and-patch-request/amp/

Comparisons with .some():
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some

Transform Translate CSS:
https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate

### Tools and Style:
Git:
https://github.com/

Bootstrap:
https://getbootstrap.com/docs/3.3/getting-started/

Navbar:
https://getbootstrap.com/docs/4.0/components/navbar/

Font:
https://fonts.google.com/share?selection.family=Montserrat:wght@500

### Images (Public Domain):
https://flic.kr/p/2o3eXpC
https://flic.kr/p/9xSrLG
https://flic.kr/p/7KjuVQ
https://flic.kr/p/269qffo