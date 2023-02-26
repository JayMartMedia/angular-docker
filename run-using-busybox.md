Build the image

```sh
 docker build -f Dockerfile.busybox -t angular-docker-busybox:1.0 .
```

Run the image

```sh
docker run -d -p 1235:80 angular-docker-busybox:1.0
```
