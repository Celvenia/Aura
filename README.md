# Aura

**Table of Contents**

- [About The Project](#Description)
- [Live Link](#live-link)
- [Built With](#built-with)
- [Features](#features)
- [Future Feature Ideas](#future-feature-ideas)
- [Verbal Commands](#verbal-commands)
- [Reach Me](#reach-me)

<br>

## Goal

A simple AI personal assistant

## Description

Aura is an ai personal assistant utilizing openai's api for questions. The answers you can then store in notes or just continue the conversation. Pending geolocation and alarm functionality, will allow for reminders to be stored and automatically provide an update to length of time to arrive if latitude/longitude based, and/or an accompanied alarm.

## Schema

![](https://res.cloudinary.com/dtzv3fsas/image/upload/v1686592347/Personal%20Assistant/Shadow_kfiukq.png)

## Screenshots

### Landing Page

![](https://res.cloudinary.com/dtzv3fsas/image/upload/v1686592608/Personal%20Assistant/Screenshot_2023-06-11_235947_zagr7j.png)

### Home Page (Once User logged in)

![](https://res.cloudinary.com/dtzv3fsas/image/upload/v1686592595/Personal%20Assistant/Screenshot_2023-06-11_235841_uodsov.png)

<br>

## Live Link

https://aura-e23a.onrender.com

## Built With

- python
- flask
- javascript
- react

## Features

### Of note, no social aspect to this project

**<h3>Notes</h3>**

- <p>Users can create, read, update, and delete only their own Notes while logged in</p>
- <p>Pending** Create note through voice recognition </p>
  <img src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1686593718/Personal%20Assistant/CreateNote.png"/>

**<h3>Reminders</h3>**

- <p>Users can create reminders through calendar.</p>
- <p>Users can view reminders created in short and long form </p>
- <p>Users can update and delete reminders. If reminder time has passed, will automatically be removed from view (currently linked to mountain time)</p>
- <p>Pending** Reminder times will be linked to alarm clock</p>
- <p>Pending** Create reminder through voice recognition </p>
  <img src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1686593643/Personal%20Assistant/ReminderInput.png"/>
  <br>
  <img src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1686593718/Personal%20Assistant/ReminderQuickView.png"/>
  <br>
  <img src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1686593719/Personal%20Assistant/Screenshot_2023-06-12_120906_c8dhss.png"/>
  <br>
  <img src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1686593719/Personal%20Assistant/Screenshot_2023-06-12_120939_w9sft2.png"/>
  <br>

**<h3>Conversations</h3>**

- <p>Logged in users can interact with open ai's api through voice and store conversation history</p>
- <p>Users can create new conversations, view conversations, update the title of each conversation, delete conversations</p>
- <p>Only messages sent to open ai's api will be stored, voice interaction for time, date, navigation are not </p>
  <br>
  <img src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1686593719/Personal%20Assistant/ActiveShadow.png"/>
  <br>
  <img src="https://res.cloudinary.com/dtzv3fsas/image/upload/v1686593719/Personal%20Assistant/ConversationHistory.png"/>

## Future Feature Ideas

- Search
- Image Generation
- Google maps Integration
- Voice Initiation

## Getting Started

### Dependencies

1: git clone https://github.com/Celvenia/Aura.git

2: download dependencies

```shell
pipenv install -r requirements.txt
```

3: Create a .env file based on the example with proper settings for your development environment

4: Make sure the SQLite3 database connection URL is in the .env file

5: This starter organizes all tables inside the flask_schema schema, defined by the SCHEMA environment variable. Replace the value for SCHEMA with a unique name, making sure you use the snake_case convention.

6: Get into your pipenv, migrate your database, seed your database, and run your Flask app

```shell
pipenv shell
```

```shell
pip install openai
```

```shell
flask db upgrade
```

```shell
flask seed all
```

```shell
flask run
```

7: You'll need to signup with OpenAI for an API key which you'll then place in your root environment.

8: Your root env should look like this

```shell
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///dev.db
SCHEMA=unique_schema_name
OPEN_AI_KEY=your_openai_key
```

9: navigate to the react-app folder

```shell
cd react-app
```

```shell
npm install
```

```shell
npm install dayjs
```

- create .env file in react-app

```shell
touch .env
```

- place this inside your .env file

```shell
REACT_APP_BASE_URL=http://localhost:5000
```

## Deployment through Render.com

First, refer to your Render.com deployment articles for more detailed
instructions about getting started with [Render.com], creating a production
database, and deployment debugging tips.

From the [Dashboard], click on the "New +" button in the navigation bar, and
click on "Web Service" to create the application that will be deployed.

Look for the name of the application you want to deploy, and click the "Connect"
button to the right of the name.

Now, fill out the form to configure the build and start commands, as well as add
the environment variables to properly deploy the application.

### Part A: Configure the Start and Build Commands

Start by giving your application a name.

Leave the root directory field blank. By default, Render will run commands from
the root directory.

Make sure the Environment field is set set to "Python 3", the Region is set to
the location closest to you, and the Branch is set to "main".

Next, add your Build command. This is a script that should include everything
that needs to happen _before_ starting the server.

For your Flask project, enter the following command into the Build field, all in
one line:

```shell
# build command - enter all in one line
npm install --prefix react-app
&& npm install @react-google-maps/api
&& npm run build --prefix react-app
&& pip install -r requirements.txt
&& pip install psycopg2
&& pip install openai
&& pip install pytz tzlocal
&& flask db upgrade
&& flask seed all

```

This script will install dependencies for the frontend, and run the build
command in the **package.json** file for the frontend, which builds the React
application. Then, it will install the dependencies needed for the Python
backend, and run the migration and seed files.

Now, add your start command in the Start field:

```shell
# start script
gunicorn app:app
```

_If you are using websockets, use the following start command instead for increased performance:_

`gunicorn --worker-class eventlet -w 1 app:app`

### Part B: Add the Environment Variables

Click on the "Advanced" button at the bottom of the form to configure the
environment variables your application needs to access to run properly. In the
development environment, you have been securing these variables in the **.env**
file, which has been removed from source control. In this step, you will need to
input the keys and values for the environment variables you need for production
into the Render GUI.

Click on "Add Environment Variable" to start adding all of the variables you
need for the production environment.

Add the following keys and values in the Render GUI form:

- SECRET_KEY (click "Generate" to generate a secure secret for production)
- FLASK_ENV production
- FLASK_APP app
- SCHEMA (your unique schema name, in snake_case)
- REACT_APP_BASE_URL (use render.com url, located at top of page, similar to
  https://this-application-name.onrender.com) .
- OPEN_AI_KEY (your unique API key from OpenAI)
  In a new tab, navigate to your dashboard and click on your Postgres database
  instance.

Add the following keys and values:

- DATABASE_URL (copy value from Internal Database URL field)

\_Note: Add any other keys and values that may be present in your local .env file. As you work to further develop your project, you may need to add more environment variables to your local .env file. Make sure you add these environment variables to the Render GUI as well for the next deployment.

Next, choose "Yes" for the Auto-Deploy field. This will re-deploy your application every time you push to main.

Now, you are finally ready to deploy! Click "Create Web Service" to deploy your project. The deployment process will likely take about 10-15 minutes if everything works as expected. You can monitor the logs to see your build and start commands being executed, and see any errors in the build process.

When deployment is complete, open your deployed site and check to see if you successfully deployed your Flask application to Render! You can find the URL for your site just below the name of the Web Service at the top of the page.

[Render.com]: https://render.com/

- tested on google chrome
- deployed on render

### Executing program

- After you've signed up or logged in

## Verbal commands

- Preface command with "Aura" when interacting with voice and openai's api. I.e. "Aura what is 2+2?"
- Navigate to pages, currently only home, notes, and reminders available "Navigate to home"
- Stop active listening "Stop listening"
- Stop request "ignore"
- Current time "What is the current time"
- Current date "What is the current date"

## Help

Advice for common problems or issues.

- Known issue when setting reminders as project is based off of Mountain Time
- Voice response with lengthy responses may not work as intended due to auto delay turn off feature
- Some limitations on current events and information due to data
- Responses have a set token limit

## Authors

Contributors name
Christopher Elvenia

## Reach Me

chriselvenia@gmail.com

# Aura
