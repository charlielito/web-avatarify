# Web-avatarify for image animations

![Example][s1] 


This is the code base for this [website](https://www.liveportraits.ml) and its backend. This aims to bring technology closer to everyone, just by a couple of clicks away, democratizing it to anyone. It is based on [avatarify](https://github.com/alievk/avatarify) which uses the incredible work of a recent [paper](https://arxiv.org/pdf/2003.00196.pdf). Thanks for the authors for releasing the [code](https://github.com/AliaksandrSiarohin/first-order-model) and the trained model.

In addition it allows you to record and produce a video also with your input audio.
### Jon Snow Example with audio
[![Watch the video](https://img.youtube.com/vi/0lCcDpExVdo/0.jpg)](https://youtu.be/0lCcDpExVdo)


## Updates
* It will be running until June 26 where my Azure Free credits for running the GPU backend are over :D
* June 8 2020 web page public released

## Architecture

#### High level info
* The Web App was made using `React` (actually I learned it for building this so don't except clean javascript code :D).
* Everything is containerized so it should run everywhere.
* There is a version for running it in CPU (Dockerfile) and a version for GPU (Dockerfile-gpu) -because at the beginning I thought people could wait a couple of minutes whilst processing the video :D, I was wrong, it takes too much on CPU-
* Because the WebApp needs access to the browser's microphone and camera, it needs to be served over HTTPS. I used firebase for hosting the app because its easytouse features and automatic SSL handling, and also custom name routing.
* I purchased the domain on [https://freenom.com](https://freenom.com) because they have 1 year free `.ml` domains.
* The backend that runs the model (final version with GPU) were deployed in azure in a single Virtual Machine (because this is just a demo and more machines will cost considerably more). 
* One tricky implementation detail is that because the front end is served over HTTP, the backend also needs to be served over HTTPS. This will complicate things a lot, so at the end the fast solution (I know not the most elegant one) was to use a relay server with HTTPS using Google Cloud Run (manages automatically the HTTPS part) that just redirects the petitions to the virtual machine.


TODO: Image with the actual architecture :P

## Requirements
<!-- * Python 3.7 + requirements.txt + torch==1.1.0 and torchvision==0.3.0 + pyyaml for the backend -->
* WebApp tested on mobile and desktop machines with Chrome and Mozilla browsers.
* React to test front end locally
* Firebase command for deploying front end
* Gcloud command for deploying part of backend
* Python 3.7 and requirements.txt for the backend
* A `secrets.sh` file with variables `API_TOKEN` and `SERVER_URL`. The first one is the token for accessing the backend and the last one the url of the backend. Also add this at the end `export REACT_APP_API_TOKEN=$API_TOKEN` for the front end to get the variables.


[s1]: web-app/src/assets/example.gif "S"

### Running the web-app
This is straightforward like any react app. Just make sure to source the `secrets.sh` file before.

```bash
source secrets.sh
cd web-app/
npm install
npm start
```
For deploying:
```bash
npm run build
firebase deploy
```

### Running the backend
#### Locally
```bash
bash scripts/run-local.sh
```
#### Locally with Docker
```bash
bash scripts/run-docker.sh
```
or for GPU
```bash
bash scripts/run-docker.sh --gpu
```
### Deploy to cloud run
This will deploy the CPU version (reaaaaally slow)
```bash
bash scripts/deploy.sh
```