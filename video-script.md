# Intro and main points

What's up YouTube, in this video I'm going to show you how to serve an Angular app as static files from inside a docker container using Nginx. This could be helpful if you want to deploy your app to amazon app runner, google cloud run, azure container instances or Kubernetes. I'll also talk a little about how this is different than the normal `ng serve` command which you're probably used to using for local development, and I'll briefly talk about some other options for serving an angular app.

I'm going to try to go into detail about what each line of code containerization does, so that you actually understand what I'm doing as and can replicate it for yourself in your app as opposed to just copying me. That way if you run into issues, you will have an idea of how to start solving them.

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

In order for you to understand why we need a different command to build the production version of our app, let's first start by talking about the `ng serve` command.

The `ng serve` command is meant for running during local development. The `ng serve` command continuously watches the angular app source code to detect changes. Whenever there is a change, the source code is re-transpiled into the output files, and the web server restarts so you can see your changes very quickly in your browser. This hot-reload feature is very convenient for local development when you are regularly making changes to your source code. But this is not necessary once the app is deployed. In addition to hot-reload being unnecessary overhead, `ng serve` uses the webpack dev server and you can see here directly in the webpack-dev-server github repo, the webpack-dev-server is intended only for development purposes, it it not meant to run in production. 

Now that you know a little about the webpack dev server, let's talk about the `ng build` command.

The `ng build` command is used to generate static files that can be put on and served by a simple web server. Running `ng build` means that all the transpilation is done once, and from then on, whatever web server the files are put on is only responsible for serving the static files, the server itself does not do any transpilation or server side rendering. All of the routing for a typical production angular app is done on the client side. This takes a lot of the load off of the server. Later in this video I'll show you how to configure nginx to serve the static files, but keep in mind that just about any other web server could be used instead of nginx.

So lets run the `ng build` command now and see for ourself what it does. As you can see, this `dist` folder has been created, and inside of that is a directory named the name of our app. This folder contains all the static files that were generated during the `ng build` command.

As a general disclaimer, you should never have to manually change any of the files in the dist folder (and to be honest, you'll never really need to look there at all). Only the `ng build` command should be used to generate or change these files. The files in the dist folder should not be committed to source control, whenever you generate an angular app, the dist folder is listed in the .gitignore file. If something is wrong in the dist folder, it means something needs to be changed in your source code. That said, lets look into what these files do, so that we can understand how we need to deploy the app.

As far as the webpage code goes, there are four main parts:

- index.html: here is the index.html file, it is a combination of the index.html file here, with an added styles tag, a link to a css file, and references to the javascript files. Notice that there is only a single html file, even though we have multiple routes. This is because this index.html file will be served regardless of what route the user goes to. The routing is handled by the frontend javascript code, not the server.
- css: This styles.css file is the output from transpiling the styles files listed in the styles section of the angular.json file (lines 32-34). The styles.scss file has been transpiled to css since browsers don't handle scss yet.
- javascript: There are a few javascript files
  - polyfills.js includes some polyfills which add functionality to older browsers to make them compatible with newer js code and consistent with other browsers. For example if a browser doesn't natively support localstorage, there may be a polyfill that implements something similar, so that application code doesn't break.
  - runtime.js includes some things needed by the webpack loader... apparently
  - main.js includes your actual application code. It's obviously not readable or understandable since it's been optimized and obfuscated. But if I search for some values used in my app, for example the text "First page works!" then you'll see we find it. Same thing goes for if I search for a route used by my app, since this js file is what actually handles the client side routing. The same goes for any of my classnames, the css is also in here. This file is almost the entirety of the angular app. It's worth noting that if the app gets big, this file will start to take a long time to load. Angular does support dynamic page loading which allows this app code to load depending on the route. This dynamic loading would speed up the initial render of the app, but redirection to other pages may take slightly longer. In this example, we do not have dynamic loading set up.
- assets: the assets could be things like images, .gifs, audio files, etc. The list of assets to be copied over comes from the asset section of the angular.json file (lines 28-31). Here you can see that the favicon.ico and anything in the assets folder will be copied over

# Serving the static files

Now that we have run the `ng build` command we need to get it deployed. There are many different ways to do this. If you have a shared hosting account such as bluehost, hostgator, or something else, you can upload the files to the server, and configure the web server (which would most likely be Apache) to serve the single page app.

I'll quickly show you a simple web server that is pretty easy to run. This is an npm package called http-server. I can run npx http-server, then pass the path to the directory that contains the files I want to serve (`npx http-server dist/angular-docker/`). npx is just allowing me to run the package without globally installing it. Once the server starts up, I can go to localhost port 8080 and see the application. Notice that if I click on one of the links, we will get a 404, this is because there is no file that matches this path in the dist directory. To fix this we will need to slightly configure http-server. http-server has a proxy option which will act as a fallback for any routes which don't have a matching path. We can add the -P option, and pass it `http://localhost:8080?` (`npx http-server dist/angular-docker/ -P http://localhost:8080?`), this will cause the server to return the /index.html file whenever a file is not found at the specific file. So if we go to /epic-script.js, or some other file which is not an actual file in our dist folder, then the http-server will return the index.html file instead, index.html will load the normal css and js files, the js files will handle the routing in the browser, and since the angular app doesn't have this route defined it will display the fallback 404 page. This also works if we don't include an extension.

So hopefully that gives you a better understanding of what it means to serve static files. In the next step, we'll setup the nginx web server to serve the files from a docker container. Nginx is a pretty fully featured web-server, in addition to serving files, it can act as a load balancer, reverse proxy, and can be configured to do server-side processing with fastCGI and PHP. This functionality does come with some configuration, we will only use the web-server functionality in this video. Nginx is very production tested, according to netcraft and some other stats I have seen, it just recently surpassed Apache as the most popular web-server.

# Intro to docker

# Creating the dockerfile

# Running the dockerfile to create the docker image

# Running the docker image as a docker container

# Outro


# Resources

Optimizing the angular app: https://itnext.io/how-to-optimize-angular-applications-99bfab0f0b7c

Most popular webserver:
- https://news.netcraft.com/archives/category/web-server-survey/
- https://w3techs.com/technologies/overview/web_server
