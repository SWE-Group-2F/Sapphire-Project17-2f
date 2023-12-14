# Group 2F Additional ReadMe content
All of our development was done using the “develop” branch as our main. We have merged in all branches except an in-progress hotfix for CSV roster uploading. Currently, the editing efforts in this branch are focused on the method used to delete students in the Roster group of classes, specifically in how deleted students are hidden from the render view once deleted.
 
## Database
We are not using any database beyond the provided backend functionality with Strapi. All procedures for accessing user data are the same as in the main repository.
 
## Login Information: Username & Password
All login information is the same as provided at the beginning of the project. The method for creating a new username/password remains the same as the original project.

 
## File Storage
We are not storing any files outside of the user data, which is accounted for with the existing backend for data storage. We are not using an external file hosting site.
 
## Other Integration or Third Party Tools
We did not incorporate any third party tools, or integrate any such external applications.
 
## Login Information or Accounts created to interact with your Features
No logins were created outside of those provided.

## Implemented Features
### Mentor lesson creation access:
* A tab section on the mentor dashboard was created with two tabs: Home and Lessons. The tools stated below were added of similar functionality as the content creator tools.
* Unit creator/editor
* Lesson creator/editor and activity creator

#### Troubleshooting
* If you do/don't want to see the grade numbers in the Dashboard tabs, please add/remove strapi permissions for grades in the Classroom Manager.

</br>

### Viewing Roster of Classrooms:
* Home tab now has a list of classrooms from other mentors.
* Public classrooms: can view 
* Private classrooms: cannot view
* Filter function to see different mentors’ classrooms on the dashboard

</br>

### CSV Roster Uploading:
* The issues relating to the emojis transferring over as the text names instead of the emoji itself has been solved. As the website emojis are of google origin, MS Excel emojis (having different text names) do not function completely when being imported. It is recommended that a roster be created in Google sheets, as well as using the template that is linked for use.

### Classroom-Lesson Pairing:
* Added the ability to link a lesson to a classroom
* Lessons are related to units, which are in turn related to classrooms
* Currently, there is no direct link between classrooms and units
* Many-to-many relationship between classrooms and units is necessary to allow for non grade-based classes (e.g college classes)
* Lessons can be moved amongst units rather than being stuck in the unit they were first designed for

</br>

### Lesson Reversion
* Created new ‘Lesson Histories’ collection in Strapi
* Many-to-one relationship with ‘Lesson Module’ collection
* New functionality in [lesson Editor](/client/views/mentor/LessonEditor/LessonEditor.jsx)
* Lessons can now be reverted to a previous version kept in a lesson history collection in the database. A new modal is added to the lesson editor to allow for the proper reversion of any lesson.

#### Troubleshooting
* If reversion fails, please check to make sure Strapi permissions are given to the Classroom Manager for lesson-history.

</br>


### Edit Button
* New ‘Edit’ column added to Mentor ‘Lessons’ dashboard tab.
* Added button to columns structure in LessonEditor.jsx (Go to [LessonEditor](/client/views/mentor/LessonEditor/LessonEditor.jsx)
* This allows for a more streamlined usage of the Lesson Editor. No additional functions were created for this feature.

</br>

## Outstanding Work

### Groups
* Enable the categorization of students within the same class into specific cohorts.

### Creating copies of lessons
* Creating copies of other teachers' lessons and editing said copies to create inspired lessons based on other teachers' coursework.

### Share lessons
* Easily share lessons with fellow educators and students to foster collaboration and knowledge exchange.

# CaSMM

> Computation and Science Modeling through Making

Cloud-based programming interface

![Deploy Staging](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Staging/badge.svg)
![Deploy Production](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Production/badge.svg)

<br/>

## Application

### `client` 
[client](/client#client) is the frontend of the application. It is powered by [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

### `server`

[server](/server#server) is the web server and application server. It is powered by [Node](https://nodejs.org/en/) and [Strapi](https://docs-v3.strapi.io/developer-docs/latest/getting-started/introduction.html).

### `compile`

  [compile](/compile#compile) is an arduino compiler service. It is an unofficial fork of [Chromeduino](https://github.com/spaceneedle/Chromeduino).

<br/>

## Environments

> The project is divided into three conceptual environments.

### Development
#### Structure

The development environment is composed of five servers. The first one is run with the [Create React App](https://create-react-app.dev/docs/getting-started/) dev server. The later four are containerized with docker and run with [docker compose](https://docs.docker.com/compose/).

* `casmm-client-dev` - localhost:3000

* `casmm-server-dev` - localhost:1337/admin

* `casmm-compile-dev` 

* `casmm-db-dev` - localhost:5432

  > The first time the db is started, the [init_db.sh](/scripts/init_db.sh) script will run and seed the database with an environment specific dump. Read about Postgres initialization scripts [here](https://github.com/docker-library/docs/blob/master/postgres/README.md#initialization-scripts). To see how to create this dump, look [here](https://github.com/DavidMagda/CaSMM_fork_2023/blob/develop/scripts/readme.md).

* `casmm-compile_queue-dev`

#### Running

`casmm-client-dev`

1. Follow the [client](/client#setup) setup
2. Run `yarn start` from `/client`

`casmm-server-dev`, `casmm-compile-dev`, `casmm-db-dev`, and `casmm-compile_queue-dev`

1. Install [docker](https://docs.docker.com/get-docker/)

2. Run `docker compose up` from `/`

   > Grant permission to the **scripts** and **server** directories if you are prompted
   

### Staging

#### Structure

The staging environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm-staging` - [casmm-staging.herokuapp.com](https://casmm-staging.herokuapp.com/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm-staging` is automatically built from the latest commits to branches matching `release/v[0-9].[0-9]`. Heroku runs the container orchestration from there.

### Production

#### Structure

The production environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm` - [www.casmm.org](https://www.casmm.org/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm` is automatically built from the latest commits to `master`. Heroku runs the container orchestration from there.

<br/>

## Maintenance

All three components of the application have their own dependencies managed in their respective `package.json` files. Run `npm outdated` in each folder to see what packages have new releases. Before updating a package (especially new major versions), ensure that there are no breaking changes. Avoid updating all of the packages at once by running `npm update` because it could lead to breaking changes. 

### Strapi

This is by far the largest and most important dependency we have. Staying up to date with its [releases](https://github.com/strapi/strapi/releases) is important for bug/security fixes and new features. When it comes to actually upgrading Strapi make sure to follow the [migration guides](https://docs-v3.strapi.io/developer-docs/latest/update-migration-guides/migration-guides.html#v3-guides)!

<br/>

## CI/CD

All of the deployments and releases are handled automatically with [GitHub Actions](https://docs.github.com/en/actions). The workflows implement custom [Actions](https://github.com/STEM-C/CaSMM/actions) that live in the [auto](https://github.com/STEM-C/auto) repo.

<br/>

## Contributing

### Git Flow 

> We will follow this git flow for the most part — instead of individual release branches, we will have one to streamline staging deployment 

![Git Flow](https://nvie.com/img/git-model@2x.png)

### Branches

#### Protected

> Locked for direct commits — all commits must be made from a non-protected branch and submitted via a pull request with one approving review

- **master** - Production application

#### Non-protected

> Commits can be made directly to the branch

- **release** - Staging application
- **develop** - Working version of the application
- **feature/<`scaffold`>-<`feature-name`>** - Based off of develop
  - ex. **feature/cms-strapi**
- **hotfix/<`scaffold`>-<`fix-name`>** - Based off of master
  - ex. **hotfix/client-cors**

### Pull Requests

Before submitting a pull request, rebase the feature branch into the target branch to resolve any merge conflicts.

- PRs to **master** should squash and merge
- PRs to all other branches should create a merge commit
