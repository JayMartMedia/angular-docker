#!/bin/bash
follow_logs='false'
while getopts f flag
do
    case "${flag}" in
        f) follow_logs='true';;
    esac
done

docker stop $(docker ps -q)
docker build -t angular-docker:1.0 .
container_id=$(docker run -d -p 1234:80 angular-docker:1.0)

if $follow_logs; then
    docker logs $container_id -f
fi
