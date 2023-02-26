# Documentation about node image on the Docker hub: https://hub.docker.com/_/node
FROM node:18-bullseye-slim as build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
# If you are working on a project that uses a private npm registry
#   you may need to copy over a .npmrc file before running `npm ci/install`
#   so that Docker can authenticate with the private registry
# More info: https://docs.npmjs.com/docker-and-private-modules
RUN npm ci
COPY . .
# Documentation on deploying an Angular app: https://angular.io/guide/deployment
RUN npm run build

# Documentation about nginx image on the Docker hub: https://hub.docker.com/_/nginx
FROM nginx:1.22 as run
# angular-docker will need to be changed to match the name of your app
COPY --from=build /app/dist/angular-docker /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
