# Club Directory - CS50W Capstone

## Project Overview
This website is a submission for the CS50W Capstone Project and is made by Rishi Aitha. The purpose of the site is to provide easy organization and access for information on clubs and activities at a school. I plan on deploying the site and offering it to my school to use for the students.

The idea arose because of the confusion that I and many other students faced when deciding what kinds of opportunities and activities we wanted to pursue at the beginning of high school. This website could be a great source of information and discussion to help students find clubs that they can be passionate about.

The administration features and security would allow a school to easily manage the site without worry of malicious attacks and inaccurate information. The users can easily understand how to navigate the site and there are several useful features such as the message board that help students gain valuable insight into their interests and questions.

## Distinctiveness and Complexity
### Distinctiveness from previous projects:
This project is significantly distinct from previous work in the CS50W course while still using the ideas and strategies covered in the lectures and projects (other ideas and strategies used are cited below). The aspects of messaging are used and implemented differently compared to previous email and network projects and more features have been added compared to before (such as replies). The focus of the site is managing information rather than communication, so it is very different compared to the communication sites made previously.

The real-life application also makes the website very distinctive, as the admin features and information stored are completely different from other work.

### Complexity in comparison to previous projects:
This project is significantly more complex than any other CS50W projects that I have made before, with more in-depth work in all aspects of the code.

The administration feature of approving clubs before adding them is a new system that has not been implemented in previous projects. The message board contains replies and improved display/organization that is even more useful and robust compared to the network and email projects, and it is only one part of one section of the website. The editing features are more thorough and the system of "authorized editors" for each club creates more complexity while improving the website. Small features like the interest count of a club also provide more complexity to the project.

The single page layout of the website meant that I could not simply have separate html templates associated with different urls, so the entire page had to be assembled using JavaScript. This made the website simpler overall for the user but made the complexity of development harder since I could not fully use Django's capabilities with html manipulation.

The largest point of complexity and difficulty for me when creating the project was the images, as the image storage and uploading systems were more complex and in-depth compared to any specifications that were required in previous projects.

Along with the images (which were stored in a Docker volume), the structure of the website during development created more complexity. The website is run on a Docker container using a PostgreSQL database. While these concepts were introduced in the lectures, implementing them onto a robust Django project with features like image upload and storage was a challenge and made the project more complex while making it more scalable, easier to share, and easier to deploy.

## File Overview
 - club_directory folder: manages Django project and contains settings and other files
 - settings.py: modified to work for images and static files
 - Dockerfile: defines the initial process for Docker container
 - docker-compose.yml: defines docker container structure
 - .dockerignore: stops some files from being managed in the container
 - requirements.txt: contains all required Python packages for the project to run
 - clubs folder: contains all files related to the clubs application in my Django project
 - favicon.ico: placeholder icon file to display in the site tab
 - index.js: this is the bulk of the website logic, it manages all the information display and all the user input and interaction
 - styles.css: manages the style and mobile compatibility of the website
 - index.html: file used to display the main page content using the divs added in JavaScript, and also holds forms and other sections of the website to be displayed
 - layout.html: main html layout of the website containing the navbar and script/style links and sections
 - login.html, register.html: contains forms to log in and register to the website
 - admin.py: manages the admin display of and interaction with website data
 - models.py: outlines the structure that website data is stored in
 - urls.py: defines all the clubs application urls (API routes and account management routes)
 - views.py: defines all API routes and account management routes to store and change the website data using JavaScript fetch calls

## Project Structure
This website is currently being hosted and managed locally on a Docker container. The base layer of the entire website is the database that stores all information and files relating to the site, which is currently mounted on a Docker volume and managed with PostgreSQL. This database is outlined and manipulated with a Django Python API, where club information is added, modified, and removed using the Django functionalities. The website itself is laid out and organized using html and an html layout, which is rendered using some of the website urls. The page itself is assembled and completed using mostly JavaScript, because of the single page structure. All information is retrieved from fetch calls to the API and displayed, and all interaction is managed through more API calls in JavaScript. This structure is one of many that can create a functional webpage, so many changes could be made.

## How to Set Up and Run Website
### Requirements:
Docker Desktop is the only installation needed to run this application, but it does have its own requirements on the website: https://docs.docker.com/get-docker/

The requirements.txt file is used by the Docker container to easily set up the website requirements. This file includes Django (with dependencies), psycopg2, and Pillow (for images).
### Process:
**Notes:**
 - I have tested the commands and process on Windows, but I am not entirely sure of the differences on different operating systems.
 - The website is not in a deployment phase as of submission, so make sure to keep DEBUG=True and other settings in settings.py untouched.

**How to Set Up:**
 - Install and set up Docker Desktop on your computer to run the web server, using this link: https://docs.docker.com/get-docker/. Ensure that the Docker Engine software is running while doing the rest of the process.
 - Download and extract all the files from the GitHub repository into a desired directory, if you haven't already.
 - Open a new terminal in Command Prompt (or equivalent in another OS). Open the directory containing the downloaded files in the terminal.
 - Run the command ```docker compose up -d --build``` to build the container and keep the terminal open to execute further commands. On Docker Desktop, you should see a container with two images running.
 - Run the migrations for the website with ```docker compose exec web python manage.py migrate```.
 - The website should, by default, be accessible on the url "localhost:8000".
 - Unfortunately, due to the data in the database being stored on a volume, data in a build of the website is exclusive to that host. Other computers and even other directories cannot access the same volume data, so the PostgreSQL database will be empty when the server runs.
 - When you are done testing, you can stop running the website with the command ```docker compose down```.

**Database Setup:**
 - Note: You can completely refresh the web page with ctrl+shift+r if things don't update right away.
 - Create a super user account using the command ```docker compose exec web python manage.py createsuperuser``` and choose your username, email, and password. (THIS IS IMPORTANT FOR ACCESSING ADMIN FEATURES)
 - Log into the admin page at the url http://localhost:8000/admin/.
 - On the admin page, you can add and change data as you please, but you can also change info on the normal user page if your account is an admin, which can be toggled in the actual admin page.
 - Open the users section, go to your superuser account, toggle the isAdmin checkbox to true, and save the changes.
 - Now, when you open the website and log in with your superuser details, all the features will be accessible.

**Trying Out the Website:**
 - Use the "Add Club" option to create a new club, where you can add information like the description and announcement(s) and an image if you would like.
 - Notice that when it is added, it does not appear on the main page, and only appears in the admin section to approve clubs.
 - You can edit the club and change the club editors, and you will notice that everything changes the database immediately through the appropriate fetch calls.
 - Even if you remove your superuser account from being an editor, you can still edit any club with that account since it is marked as an admin.
 - Try creating a new account on the registration page to see what the limitations are for a normal user. This way you can also test features like authorized club editors.
 - Use the message board to add messages and replies underneath a club. If you add more than 10 messages, the pagination will appear to make navigation easier.
 - As an admin user, you will also be able to approve and disapprove clubs, so you can try this to see where the clubs go when you use the options.
 - You can try to access the website while logged out to see the differences in interaction.
 - Small features like the interest counter are also some things you can test out.
 - The website is responsive to any layout, so you can use the console page to try out a mobile view for the website as well.
 - The focus of the website was ease of use and robust interaction, so try messing around with interactive elements and see how they work to improve user experience!

**If you have any questions or issues, you can reach out to me at my contact info below!**

## Citations
### Strategies:
Docker and Postgres setup - 

https://learndjango.com/tutorials/django-docker-and-postgresql-tutorial

FormData for managing image files - 

https://developer.mozilla.org/en-US/docs/Web/API/FormData

https://www.freecodecamp.org/news/formdata-explained/

https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects

https://docs.djangoproject.com/en/4.2/ref/request-response/

Image Storage - 

https://docs.djangoproject.com/en/4.2/topics/files/

https://www.section.io/engineering-education/an-extensive-guide-on-handling-images-in-django/

https://medium.com/@seanoughton/docker-data-volumes-32d83b334d

https://docs.docker.com/storage/volumes/

API info - 

https://www.geeksforgeeks.org/difference-between-put-and-patch-request/amp/

Comparisons with .some() - 

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some

Transform Translate CSS - 

https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate

### Tools and Style:
Git - 

https://github.com/

Bootstrap - 

https://getbootstrap.com/docs/3.3/getting-started/

Navbar - 

https://getbootstrap.com/docs/4.0/components/navbar/

Font - 

https://fonts.google.com/share?selection.family=Montserrat:wght@500

## Contact
**Project Made by Rishi Aitha**

Email: rishi.aitha@gmail.com