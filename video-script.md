# Intro and main points

What's up YouTube, in this video I'm going to show you how to serve an Angular app as static files from inside a docker container using Nginx. This could be helpful if you want to deploy your app to amazon app runner, google cloud run, azure container instances or Kubernetes. I'll also talk about how the `ng build` command is different than the normal `ng serve` command which you're probably used to using for local development, and I'll briefly talk about some other options for serving an angular app.

I'm going to try to go into detail about what each line of containerization code does, so that you actually understand what I'm doing and can replicate it for yourself in your app as opposed to just copying me. That way if you run into issues, you will have an idea of how to start solving them.

This video has a companion repo on github, if you prefer text based learning, are already familiar with docker, or just want to see the code, you can refer to the repo linked in the video description.

# Overview of project

Alright, so here's what the project will roughly look like after we get it running. It's just going to be a basic angular app with a nav bar and a few different pages. We have a home page, some other pages, and some nested pages. This is similar to how a real app would be laid out. This video is specifically about running the angular app in docker, so we aren't going to spend much time making the pages look nice, or diving into the angular code.

I've created a github repo that has a walkthrough of everything we'll be doing here, in order to run the Angular app in docker and I'll be referring to it throughout this video. I highly suggest that you refer to it yourself when you're setting up your app to run in Docker!

# Creating the new angular project

To create the new app I'm going to run `ng new`

Once the app is created I can run it with `npm start` which runs `ng serve`

As you can see, the starter app starts with only a single page, I'm going to go ahead and create a few more pages to show how having pages on different routes will cause some issues, then how we can fix it by configuring nginx.

One of the interesting things about routing in a single page app is that all routes actually need to load the same html, css, and js files. Then the routing itself is actually handled by the javascript on the client side. That's a bit of a simplification, especially considering that lazy loading is a thing, but you will see what I mean in a minute. (source: https://angular.io/guide/deployment#routed-apps-must-fall-back-to-indexhtml)

Now I've added some extra pages, and you can see them here.

# Building the production version, show static output

(Show angular deployment page: https://angular.io/guide/deployment)

Building the production version of a typical angular app means running `ng build`. This command does a few things, it transpiles your typescript files into some static javascript files, and puts them into the "dist" slash "name of your project" folder, along with any files in your assets folder. Depending on the settings in your angular.json file, this command can also optimize, minify, and obfuscate your code. If you are't familiar with those buzzwords, just know it makes your app load quicker on the users device.

In order for you to understand why we need a different command to build the production version of our app, let's first start by talking about the `ng serve` command.

The `ng serve` command is meant for running during local development. The `ng serve` command continuously watches the angular app source code to detect changes. Whenever there is a change, the source code is re-transpiled into the output files, and the web server restarts so you can see your changes very quickly in your browser. This hot-reload feature is very convenient for local development when you are regularly making changes to your source code. But this is not necessary once the app is deployed. In addition to hot-reload being an unnecessary overhead, `ng serve` uses the webpack dev server and you can see here directly in the webpack-dev-server github repo, the webpack-dev-server is intended only for development purposes, it it not meant to run in production. 

Now that you know a little about the the `ng serve` command, let's talk about the `ng build` command.

The `ng build` command is used to generate static files that can be put on and served by a simple web server. Running `ng build` means that all the transpilation is done once, and from then on, whatever web server the files are put on is only responsible for serving the static files, the server itself does not do any transpilation or server side rendering. All of the routing for a typical production angular app is done on the client side. This takes a lot of the load off of the server. Later in this video I'll show you how to configure nginx to serve the static files, but keep in mind that just about any other web server could be used instead of nginx.

So now lets run the `ng build` command and see what exactly it does. As you can see, this `dist` folder has been created, and inside of that is a directory named the name of our app. This folder contains all the static files that were generated during the `ng build` command.

As a general disclaimer, you should never have to manually change any of the files in the dist folder (and to be honest, you'll never really need to look there at all). Only the `ng build` command should be used to generate or change these files. The files in the dist folder should not be committed to source control, whenever you generate an angular app, the dist folder is listed in the .gitignore file. If something is wrong in the dist folder, it means something needs to be changed in your source code. That said, lets look into what these files do, just so that we can understand how we need to deploy the app.

As far as the webpage code goes, there are four main parts:

- index.html: here is the index.html file, it is a combination of the index.html file here, with an added styles tag, a link to a css file, and references to the javascript files. Notice that there is only a single html file, even though we have multiple routes. This is because this index.html file will be served regardless of what route the user goes to. The routing is handled by the frontend javascript code, not the server.
- css: This styles.css file is the output from transpiling the styles files listed in the styles section of the angular.json file (lines 32-34). The styles.scss file has been transpiled to css since browsers don't handle scss yet.
- javascript: There are a few different javascript files
  - polyfills.js includes some polyfills which add functionality to older browsers to make them compatible with newer js code and consistent with other browsers. For example if a browser doesn't natively support localstorage, there may be a polyfill that implements something similar, so that the application code doesn't break.
  - runtime.js includes some things needed by the webpack loader... apparently I'm not really sure what exactly this does
  - main.js includes your actual application code. It's obviously not readable or understandable since it's been optimized and obfuscated. But if I search for some values used in my app, for example the text "First page works!" then you'll see we do find it. Same thing goes for if I search for a route used by my app, since this js file is what actually handles the client side routing. The same goes for any of my classnames, the css is also in here. This file is almost the entirety of the angular app. It's worth noting that if the app gets big, this file will start to take a long time to load. Angular does support dynamic page loading which allows this app code to load depending on the route. This dynamic loading would speed up the initial render of the app, but redirection to other pages may take slightly longer. In this example, we do not have any dynamic loading set up.
- assets: the assets could be things like images, .gifs, audio files, etc. The list of assets to be copied over comes from the asset section of the angular.json file (lines 28-31). Here you can see that the favicon.ico and anything in the assets folder will be copied over

# Serving the static files

Now that we have run the `ng build` command we need to serve the static files. There are many different ways to do this. If you have a shared hosting account such as bluehost, hostgator, or something else, you can upload the files to the server, and configure the web server (which would most likely be Apache) to serve the single page app.

I'll quickly show you a simple web server that is pretty easy to run on the local machine. This is an npm package called http-server. I can run npx http-server, then pass the path to the directory that contains the files I want to serve (`npx http-server dist/angular-docker/`). npx is just allowing me to run the package without globally installing it. Once the server starts up, I can go to localhost port 8080 and see the application. Notice that if I click on one of the links, we will get a 404, this is because there is no file that matches this path in the dist directory. To fix this we will need to slightly configure http-server. http-server has a proxy option which will act as a fallback for any routes which don't have a matching path. We can add the -P option, and pass it `http://localhost:8080?` (`npx http-server dist/angular-docker/ -P http://localhost:8080?`), don't worry too much about the specific syntax, this will just cause the server to return the /index.html file whenever a file is not found at the specific file. So if we go to /epic-script.js, or some other file which is not an actual file in our dist folder, then the http-server will return the index.html file instead, index.html will load the normal css and js files, the js files will handle the routing in the browser, and since the angular app doesn't have this route defined it will display the fallback 404 page. This also works if we don't include an extension.

So hopefully that gives you a better understanding of what it means to serve static files. So far we've just been working on our local host machine. In the next step, we'll build the app inside of docker, and setup the nginx web server to serve the files. Nginx is a pretty fully featured web-server, in addition to serving files, it can act as a load balancer, reverse proxy, and can be configured to do server-side processing with fastCGI and PHP. This functionality does come with some configuration, we will only use the web-server functionality in this video. Nginx is very production tested, and according to netcraft and some other stats I have seen, it just recently surpassed Apache as the most popular web-server.

# Intro to docker

Since you're looking for this video, I'll assume you already know a little bit about the purpose of docker. Just in case you don't I'll give a brief overview. Docker is a containerization tool that makes it easy to repeatably deploy applications that are isolated from each other with low overhead as compared to isolation using virtual machines which has very high overhead. Docker is often used when deploying an application to the cloud.

This isn't going to be a full on Docker tutorial, but I am going to try to go somewhat in depth just so you actually understand everything I'm doing. First we'll create the Dockerfile, which is used to tell docker what commands it needs to do in order to create our docker image. Then we'll use the docker build command to create the docker image. And finally, we'll use the docker run command to run the docker image on our machine.

# Creating the dockerfile

We'll start by creating the dockerfile. By default, this is called Dockerfile with no extension. You can name it something different, but this is the filename that is typically used. Like I just mentioned, the dockerfile is used to tell Docker how to build our image. In the case of an angular app, that means copying over our source code files, running npm install to install our packages, and running `ng build`, like we just discussed, to build the static files for our app. And since we're going to be serving the static files with nginx, we're going to have to create an nginx configuration file so nginx knows how to serve the files, specifically how it should serve the index.html file for all routes.

I'll walk you through it here, but the dockerfile is also available in the companion Github project.

On the first line of our dockerfile we need to specify our starting image. In this case, we will start with `node:18-bullseye-slim` this image is a lightish weight image that has the tools we'll need to build our app such as node version 18 and npm.

We'll set our working directory to the /app directory, this is pretty typical. Then we're going to copy over our package.json and package-lock.json files. We could copy all our source code files now, but this allows us to cache the npm install command, so future builds of the docker image will be faster. Then we'll run npm ci, npm ci is similar to npm install, and we could use npm install here. However npm ci doesn't change the lock file and requires dependencies to be the same version as in the lock file. Whereas npm install doesn't always respect the lock file.

Once we've installed our dependencies, we will copy the rest of the source code. We can exempt files from being copied by adding them to a dot dockerignore file. In this case, we will go ahead and add the node_modules, and dist directories to the .dockerignore file.

Once the source code files are copied over, we can run `npm run build` which run `ng build` to build the static files from our source code and put it in the dist directory.

This dockerfile is going to use something called a multistage build. This is typically done to reduce the final size of the docker image. The docker commands you see here make up the first stage, which we can call the build stage.

Now we'll start a second stage based on the nginx image. This will consist of two commands, the first command will copy the static files from the dist directory of the first stage build into the nginx/html directory of the second stage since that is where nginx serves files from. The second line will copy the nginx configuration file into the second stage.

Now let's create the nginx.conf file to configure nginx. The file will consist of a single server block. The two listen lines listen on port 80 for both ipv4 and ipv6, server name should match your host name, in this case localhost. Root specifies where nginx will serve the files from, and this try_files section ultimately falls back to serve the index.html file. This is important since our angular app is a single page application. As we saw earlier, the same files get served for every path, and the routing is handled by the javascript code on the client side.

The advantage of this multistage build is that the second stage, the run stage only has the static files needed for the app, and nginx. It does not have npm or node installed, and it does not have the source code or node_modules directory. This makes the final docker image much smaller. We could have done all of this in a single stage, but then the final image would be much larger.

```conf
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    root   /usr/share/nginx/html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

# Running the dockerfile to create the docker image

Now that we have our docker file created, we need to use it to build a docker image.

The command for this is docker build, then -t to specify a tag, we will call this image angular-docker-youtube 1 dot zero, and then say dot which specifies the build context. The build context is the used to tell docker where it should copy files from when using the COPY command in the docker file for example. (`docker build -t angular-docker-youtube:1.0 .`)

When we run the docker build command, we can watch as the commands are executed. You can also pass the --progress=plain flag to prevent vscode from collapsing the output.

Now that the docker build command has finished, we can run `docker images` and see the image that we created.

# Running the docker image as a docker container

Finally, we need to run the image as a container. The command for this is docker run, then -d to run in detached mode (this is not strictly necessary, but I find it very convenient since it doesn't lock up the terminal), the -p flag publishes a port on the host machine. I typically think of it like forwarding a port on the host machine to a port in the docker container. In this case we can set the number on the left to whatever we want, I'm setting it to 1234 arbitrarily, but the port on the right needs to be 80 since that is the port that nginx serves the file on in the docker container, and lastly we need to specify the image and version that we want to run. (docker run -d -p 1234:80 angular-docker-youtube:1.0)

Once we start the container, we can run the `docker ps` or `docker container list` command and we should see our new container. If we navigate to localhost port 1234, we should see our application!

# Outro

In this video we talked about the ng build command and how it is different than the ng serve command. We dove into the dist folder so that we could understand how a production angular app works.

Then we build a dockerfile to tell docker how to build our image, as well as an nginx.conf file to configure nginx. We used the dockerfile to build our app into a docker image, and then we ran the image as a container!

If you have any questions or comments, please leave them down below. If you liked the video, please give it a like so that more people will see it, and consider subscribing if you would like to see more videos similar to this in the future. As always, have a great day and I will see you next time!

# Resources

Optimizing the angular app: https://itnext.io/how-to-optimize-angular-applications-99bfab0f0b7c

Most popular webserver:
- https://news.netcraft.com/archives/category/web-server-survey/
- https://w3techs.com/technologies/overview/web_server
