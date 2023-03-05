# Intro and main points

What's up YouTube, in this video I'm going to show you how to serve an Angular app as static files from inside a docker container using Nginx. This could be helpful if you want to deploy your app to amazon app runner, google cloud run, azure container instances or Kubernetes. I'll also talk a little about how this is different than the normal `ng serve` command which you're probably used to using for local development, and I'll briefly talk about some other options for serving an angular app.

I'm going to try to go into detail about what each line of code does, so that you actually understand what I'm doing as opposed to just copying me and can replicate it for yourself in your app.

This video has a companion repo on github, if you prefer text based learning, you can refer to that.

# Overview of project

Alright, so here's what the project will roughly look like after we get it running. It's just going to be a basic angular app with a nav bar and a few different pages. We have a home page, some other pages, and some nested pages. This is similar to how a real app would be laid out. This video is specifically about running the angular app in docker, so we aren't going to spend much time making the pages look nice.

I've created a github repo that has a walkthrough of everything we need to do in order to run the Angular app in docker and I'll be referring to it throughout this video. I'll include a link to the github repo in the video description so that you can refer to it while you're setting up your app to run in Docker!

# Creating the new angular project

To create the new app I'm going to run `ng new`

Once the app is created I can run it with `npm start` which runs `ng serve`

As you can see, the starter app starts with only a single page, I'm going to go ahead and create a few more pages to show how having pages on different routes will cause some issues, then how we can fix it by configuring nginx.

One of the interesting thing about routing in a single page app is that all routes actually need to load the same html, css, and js files. Then the routing itself is actually handled by the javascript on the client side. That's a bit of a simplification, especially considering that lazy loading is a thing, but you will see what I mean in a minute. (source: https://angular.io/guide/deployment#routed-apps-must-fall-back-to-indexhtml)

Now I've added some extra pages, and you can see them here.

# Building the production version, show static output

(Show angular deployment page: https://angular.io/guide/deployment)

Building the production version of a typical angular app means running `ng build`. This command does a few things, it transpiles your typescript files into some static javascript files, and puts then into the "dist" slash "name of your project" folder, along with any files in your assets folder. Depending on the settings in your angular.json file, this command can also optimize, minify, and obfuscate your code. If you are't familiar with those buzzwords, just know it makes your app load quicker on the users device.

This command is different from the `ng serve` command, which is meant for running during local development. ng serve uses the webpack-dev-server which is not intended for production use. Running `ng build` means that all the transpilation is done once, and from then on, the server itself is only returning files, not doing any server side rendering. All of the routing for a typical production angular app is done on the client side. This takes some of the load off of the server.

Lets run the `ng build` command now. As you can see, this `dist` folder has been created, and inside of that is a directory named the name of our app. This folder contains all the static files that were generated during the `ng build` command.

As a general disclaimer, you should never have to manually change any of the files in the dist folder (and to be honest, you'll never really need to look there at all). Only the `ng build` command should be used to generate or change these files. The files in the dist folder should not be committed to source control, whenever you generate an angular app, the dist folder is listed in the .gitignore file. If something is wrong in the dist folder, it means something needs to be changed in your source code. That said, lets look into what these files do, so that we can understand how we need to deploy the app.

As far as the webpage code goes, there are four main parts:

- index.html: here is the index.html file, it is a combination of the index.html file here, with an added styles tag, a link to a css file, and references to the javascript files.
- css: This styles.css file is the output from transpiling the styles files listed in the styles section of the angular.json file (lines 32-34). The styles.scss file has been transpiled to css since browsers don't handle scss yet.
- javascript: There are a few javascript files
  - polyfills.js includes some polyfills which add functionality to older browsers to make them compatible with newer js code and consistent with other browsers. For example if a browser doesn't natively support localstorage, there may be a polyfill that implements something similar, so that application code doesn't break.
  - runtime.js includes some things needed by the webpack loader... apparently
  - main.js includes your actual application code. It's obviously not readable or understandable since it's been optimized and obfuscated. But if I search for some values used in my app, for example the text "First page works!" then you'll see we find it. Same thing goes for if I search for a route used by my app, since this js file is what actually handles the client side routing. The same goes for any of my classnames, the css is also in here. This file is almost the entirety of the angular app. It's worth noting that if the app gets big, this file will start to take a long time to load. Angular does support dynamic page loading which allows this app code to load depending on the route. This dynamic loading would speed up the initial render of the app, but redirection to other pages may take slightly longer. In this example, we do not have dynamic loading set up.
- assets: the assets could be things like images, .gifs, audio files, etc. The list of assets to be copied over comes from the asset section of the angular.json file (lines 28-31). Here you can see that the favicon.ico and anything in the assets folder will be copied over

# Serving the static files

# Intro to docker

# Creating the dockerfile

# Running the dockerfile to create the docker image

# Running the docker image as a docker container

# Outro


# Resources

Optimizing the angular app: https://itnext.io/how-to-optimize-angular-applications-99bfab0f0b7c
