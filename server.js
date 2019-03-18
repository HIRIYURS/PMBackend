// MEAN FSD FINAL Project - PROJECT MANAGER BACKEND
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import winston from 'winston';

// import Task from './models/task';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const winston = require('winston');

const projmgr = require('./models/projmgr');


// Logging level
//winston.level = process.env.LOG_LEVEL

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston.format.json(),
    // You can also comment out the line above and uncomment the line below for JSON format
    // format: format.json(),
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/logfile.log' })
      ]
  });

const port = 9001;
const hostname = "localhost";

const app = express();
const router = express.Router();

//Setup to use cors - attach middleware cors
app.use(cors());

//Setup to parse jason data in requests
app.use(bodyParser.json());

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ProjectManager');

const connection = mongoose.connection;

connection.once('open', () => {
    logger.info("Connected to MongoDB Successfully!!");
});

//Attach end points for the router
router.route('/').get((req, res) => {
    logger.info('Request Received!');
    res.status(200).json("Yet to implement. Thank you!");

});

// route/API for User table
router.route('/users').get((req, res) => {
    logger.info('Request Received!');
    
    projmgr.User.find((err, users) => {
        if (err) {
            logger.info('Unable to find any users');
            res.status(400).send(err);
        } else {
            logger.info('Got List of Users');
            console.log(users);
            res.status(200).json(users);
        }
    });    
    //res.status(200).json("Yet to implement. Thank you!");

});

router.route('/users/:id').get((req, res) => {
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/user/add').post((req, res) => {
    logger.info({ "message":"Adding New Task: ",
                  "req.body": req.body
                });    
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/user/update/:id').post((req, res) => {
    logger.info({ "message":"Updating Task: ",
                  "req.params.id": req.params.id,
                  "req.body": req.body
                });
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/user/delete/:id').get((req, res) => {
    logger.info("Deleting Task: ", req.params.id);
    res.status(200).json("Yet to implement. Thank you!");
});

// router or API for Tasks
router.route('/tasks').get((req, res) => {
    logger.info('Request Received!');
    res.status(200).json("Yet to implement. Thank you!");

});

router.route('/tasks/:id').get((req, res) => {
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/gettasksbyproj/:id').get((req, res) => {
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/task/add').post((req, res) => {
    logger.info({ "message":"Adding New Task: ",
                  "req.body": req.body
                });    
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/task/update/:id').post((req, res) => {
    logger.info({ "message":"Updating Task: ",
                  "req.params.id": req.params.id,
                  "req.body": req.body
                });
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/task/delete/:id').get((req, res) => {
    logger.info("Deleting Task: ", req.params.id);
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/task/endtask/:id').get((req, res) => {
    logger.info("Ending Task: ", req.params.id);
    res.status(200).json("Yet to implement. Thank you!");
});

// route or API for Parent Task
router.route('/parenttasks').get((req, res) => {
    logger.info('Request Received!');
    res.status(200).json("Yet to implement. Thank you!");

});

router.route('/parenttasks/:id').get((req, res) => {
    res.status(200).json("Yet to implement get parenttask by id. Thank you!");
});

router.route('/parenttask/add').post((req, res) => {
    logger.info('Request Received! /parenttask/add');
    logger.info({ "message":"Adding New Task: ",
                  "req.body": req.body
                });    
    res.status(200).json("Yet to implement add parenttask. Thank you!");
});

// route or API for Projects
router.route('/project').get((req, res) => {
    logger.info('Request Received!');
    res.status(200).json("Yet to implement. Thank you!");

});

router.route('/project/:id').get((req, res) => {
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/project/add').post((req, res) => {
    logger.info({ "message":"Adding New Task: ",
                  "req.body": req.body
                });    
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/project/update/:id').post((req, res) => {
    logger.info({ "message":"Updating Task: ",
                  "req.params.id": req.params.id,
                  "req.body": req.body
                });
    res.status(200).json("Yet to implement. Thank you!");
});

router.route('/project/delete/:id').get((req, res) => {
    logger.info("Deleting Task: ", req.params.id);
    res.status(200).json("Yet to implement. Thank you!");
});


// Attach another middleware - router
app.use('/', router);

//app.get('/', (req, res) => res.send("My First Ever Node/Express Server: Hello World, I have Arrived!!"));

var server = app.listen(port, hostname, () => {
    logger.info(`My First ever Express Server running on Port ${hostname}:${port}`);
});

module.exports = server;