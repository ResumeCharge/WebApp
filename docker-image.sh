sudo docker build -t web-app .

sudo docker image tag web-app adalaws/web-app:latest

sudo docker image push adalaws/web-app:latest
