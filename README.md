# Code on Github

https://github.com/selbstereg/to-do-fe-nonblocking

# Hosting on Heroku

Deployment reachable under:

https://to-do-fe-nonblocking.herokuapp.com/

This is the way you configured the auto deployment on heroku:

https://itnext.io/how-to-deploy-angular-application-to-heroku-1d56e09c5147

Apart from the content of server.js, it's straight forward.
You host the git repo on github and create a heroku app, that watches the repo's master
branch so every push triggers an update of the deployment.
I think Heroku runs `npm run postinstall` to build and then `npm run start`, which runs server.js.

# Using node server for serving

You can run `npm run start`. Node will run server.js, which sets up a server, listening on port `8080`.

# Local development

Use `npm rum dev-start` (The IntelliJ run config "Angular CLI Server" does that) to start the local dev server,
 listening on port 4200, which communicates with the local backend.
