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
    //logger.info('Request Received to Get Users!');
    
    projmgr.User.find((err, users) => {
        if (err) {
            logger.info('Error in Getting All Users');
            res.status(400).send(err);
        } else {
            res.status(200).json(users);
        }
    });    
    //res.status(200).json("Yet to implement. Thank you!");

});

router.route('/users/:id').get((req, res) => {
    //logger.info('Request Received to Get User By ID!');
    projmgr.User.findById(req.params.id, (err, user) => {
        if (err) {
            logger.info({ "message":"Error Getting the User",
                          "Task ID": req.params.id,
                          "Error": err
                        });
            res.status(400).json({});
        } else {
            res.json(user);
        }
    });
});

router.route('/user/add').post((req, res) => {
    logger.info({ "message":"Adding New User: ",
                  "req.body": req.body
                });    
    let user = new projmgr.User(req.body);
    user.save()
        .then(user => {
            res.status(200).json({'User': 'Added Successfully'});
            logger.info({ "message":"Adding Successfully"});
        })
        .catch(err => {
            res.status(400).send('Failed to create new User');
            logger.info({ "message":"Add Failed"});
        });
});

router.route('/user/update/:id').post((req, res) => {
    logger.info({ "message":"Updating User: ",
                  "req.params.id": req.params.id,
                  "req.body": req.body
                });
    projmgr.User.findById(req.params.id, (err, user) => {
        if (!user)
            return next(new Error('Could not load the User document'));
        else {
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.employee_id = req.body.employee_id;
            user.save().then(user => {
                res.status(200).json('Update User Done');
            }).catch(err => {
                res.status(400).send('Update User Failed!');
            });
        }
    });
});

router.route('/user/delete/:id').get((req, res) => {
    logger.info("Deleting Task: ", req.params.id);
    projmgr.User.findByIdAndRemove({_id: req.params.id}, (err, user) => {
        if (err) {
            res.json('Error deleting User');
        } else {
            res.json('Removed User Successfully');
        }
    });
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