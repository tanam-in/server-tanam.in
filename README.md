## General info
This repository is RESTFul API of tanam.in   

## Technologies
Project is created with:
* Node version: V16.14.0
* NPM version: V8.3.1
* Google Cloud SQL
* Google App Engine
* Google Cloud Function

## Setup
To run this project, install it locally using npm:

``` bash
# clone the repo
$ git clone 

# go into app's directory
$ cd tanamin-api

```

> Configuration env
```
- Rename .env.example to .env
- Change configuration with your database (this app using MySQL) : 
    DB_HOST=<YOUR_DATABASE_HOST>
    DB_USER=<YOUR_DATABASE_USER>
    DB_PASS=<YOUR_DATABASE_PASSWORD>
    DB_NAME=<YOUR_DATABASE_NAME>
    DB_PORT=<YOUR_DATABASE_PORT>
    KEY=<YOUR_PRIVATE_KEY>
```

> get google storage cridential
```
go to api service -> cridential in google cloud platform
make a service account
make a json key from service account
download and place json file in tanamin-api directory
change keyfilename in line 433 and 621 in handler.js to json file name
```


> Configuration Node Module

```
# in tanamin-api directory

# to install all depedencies
npm install

# to run backend
npm start
```

> Deploy backend to Google Cloud App Engine
```
# edit app.eml
add 
env_variables:
  DB_HOST: <YOUR_DATABASE_HOST>
  DB_USER: <YOUR_DATABASE_USER>
  DB_PASS: <YOUR_DATABASE_PASSWORD>
  DB_NAME: <YOUR_DATABASE_NAME>
  DB_PORT: <YOUR_DATABASE_PORT>
  KEY: <YOUR_PRIVATE_KEY>
 
upload json key file
# Deploy to Google Cloud App Engine
gcloud app deploy


## Features
* Register & Login
* CRUD for page home, classlist, profile, module and forum


## Postman Documentation
- LINK : https://documenter.getpostman.com/view/21095376/Uz5KnahV

## Deploy ML on GCP
 1. Create new Cloud Storage Bucket
 2. Download model.h5 and uploaded it into storage bucket
 3. Create new function in Cloud Function to implement end-to-end serverless machine learning deployment using HTTP trigger type 
 4. Set memory allocated and runtime service account to App Engine, then copy main.py & requirement.txt from ML APIs to cloud function code and setting the entry point
 5. Make sure that configure of model directory to load model succesfully
 6. Deploy it 
 7. Use Postman to test GCF using trigger url
