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

One of the interesting thing about routing in a single page app is that all routes actually need to load the same html, css, and js files. Then the routing itself is actually handled by the javascript on the client side. That's a bit of a simplification, especially considering that lazy loading is a thing, but you will see what I mean in a minute.

Now I've added some extra pages, and you can see them here.

# Building the production version, show static output

# Serving the static files

# Intro to docker

# Creating the dockerfile



# Outro
