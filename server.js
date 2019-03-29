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
const uri = "mongodb+srv://ordermgr:ordermgr@cluster0-t4g7v.azure.mongodb.net/test?retryWrites=true";

//mongoose.connect('mongodb://localhost:27017/ProjectManager');
mongoose.connect(uri);

const connection = mongoose.connection;

connection.once('open', () => {
    logger.info("Connected to MongoDB Successfully!!");
});

var curDate = new Date();
logger.info({"Server Starting!!! Current DateTime": curDate});

//Attach end points for the router
router.route('/').get((req, res) => {
    logger.info('Request Received!');
    res.status(200).json("Yet to implement. Thank you!");

});

// route/API for User table
router.route('/users').get((req, res) => {
    logger.info('Request Received to Get Users!');
    
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
                          "User ID": req.params.id,
                          "Error": err
                        });
            res.status(400).json({});
        } else {
            res.json(user);
        }
    });
});

router.route('/getuserbyempid/:id').get((req, res) => {
    logger.info({'Request':'Request Received to Get User By Employee ID', 
                 'Employee ID': req.params.id
                });
    projmgr.User.findOne({"employee_id": req.params.id}, (err, user) => {
        if (err) {
            logger.info({ "message":"Error Getting the User by Employee ID",
                          "User Employee ID": req.params.id,
                          "Error": err
                        });
            res.status(400).json({});
        } else {
            res.status(200).json(user);
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
    logger.info({'Request': "Deleting User: ", 
                 'User ID': req.params.id
                });
    projmgr.User.findByIdAndRemove({_id: req.params.id}, (err, user) => {
        if (err) {
            res.status(400).json({'Error':'Error deleting User'});
        } else {
            res.status(200).json({'User':'Removed User Successfully'});
        }
    });
});

// router or API for Tasks
router.route('/tasks').get((req, res) => {
    //logger.info('Request Received to Get Tasks!');
    
    projmgr.Task.find((err, task) => {
        if (err) {
            logger.info('Error in Getting All Tasks');
            res.status(400).send(err);
        } else {
            res.status(200).json(task);
        }
    });    

});

router.route('/tasks/:id').get((req, res) => {
    //logger.info('Request Received to Get User By ID!');
    projmgr.Task.findById(req.params.id, (err, task) => {
        if (err) {
            logger.info({ "message":"Error Getting the User",
                          "Task ID": req.params.id,
                          "Error": err
                        });
            res.status(400).json({});
        } else {
            res.json(task);
        }
    });
});

router.route('/gettasksbyproj/:id').get((req, res) => {
    logger.info({"Request" :'Request Received to Get Tasks By Project!',
                "Project ID": req.params.id
                });
    projmgr.Task.find({ "project": mongoose.Types.ObjectId(req.params.id)}, (err, tasks) => {
        if (err) {
            logger.info({ "message":"Error Getting the Tasks for Project",
                          "Project ID": req.params.id,
                          "Error": err
                        });
            res.status(400).json({});
        } else {
            logger.info("Tasks: ", tasks);
            res.status(200).json(tasks);
        }
    });
});

router.route('/task/add').post((req, res) => {
    logger.info({ "message":"Adding New Task: ",
                  "req.body": req.body
                });    
    let task = new projmgr.Task(req.body);
    task.save()
        .then(task => {
            res.status(200).json({'Task': 'Added Successfully'});
            logger.info({ "message":"Adding Successfully"});
        })
        .catch(err => {
            res.status(400).send('Failed to create new User');
            logger.info({ "message":"Add Failed",
                          "Error Message": err});
        });
});

router.route('/task/update/:id').post((req, res) => {
    logger.info({ "message":"Updating Task: ",
                  "req.params.id": req.params.id,
                  "req.body": req.body
                });
    projmgr.Task.findById(req.params.id, (err, task) => {
        if (!task)
            return next(new Error('Could not load the User document'));
        else {
            task.task = req.body.task;
            task.start_date = req.body.start_date;
            task.end_date = req.body.end_date;
            task.priority = req.body.priority;
            task.status = req.body.status;
            task.parent = req.body.parent;
            task.user = req.body.user;
            task.project = req.body.project;
            task.save().then(task => {
                res.status(200).json('Update Task Done');
            }).catch(err => {
                res.status(400).send('Update Task Failed!');
            });
        }
    });
});

router.route('/task/delete/:id').get((req, res) => {
    logger.info("Deleting Task: ", req.params.id);
    projmgr.Task.findByIdAndRemove({_id: req.params.id}, (err, task) => {
        if (err) {
            res.json('Error deleting Task');
        } else {
            res.json('Removed Task Successfully');
        }
    });
});

router.route('/task/endtask/:id').get((req, res) => {
    logger.info("Ending Task: ", req.params.id);
    projmgr.Task.findById(req.params.id, (err, task) => {
        if (!task)
            return next(new Error('Could not load the document'));
        else {
            task.task = task.task;
            task.start_date = task.start_date;
            task.end_date = task.end_date;
            task.priority = task.priority;
            task.parent = task.parent;
            task.status = "true";
            task.save().then(task => {
                res.json('Ended the task');
            }).catch(err => {
                res.status(400).send('End Task Failed!');
            });
        }
    });
});

// route or API for Parent Task
router.route('/parenttasks').get((req, res) => {
    //logger.info('Request Received for getting all Parent Tasks!');

    projmgr.Parent.find((err, ptasks) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(ptasks);
        }
    });
});

router.route('/parenttasks/:id').get((req, res) => {
    projmgr.Parent.findById(req.params.id, (err, ptask) => {
        if (err) {
            logger.info({ "message":"Error Getting the Parent Task",
                          "Parent ID": req.params.id,
                          "Error": err
                        });
            res.status(400).json({});
        } else {
            res.json(ptask);
        }
    });
});

router.route('/parenttask/add').post((req, res) => {
    logger.info('Request Received to add Parent Task!');
    logger.info({ "message":"Adding New Parent Task: ",
                  "req.body": req.body
                });    
    let ptask = new projmgr.Parent(req.body);
    ptask.save()
        .then(ptask => {
            res.status(200).json({'Parent': 'Added Successfully'});
            logger.info({ "message":"Adding Successfully"});
        })
        .catch(err => {
            res.status(400).send('Failed to create new Parent Task');
            logger.info({ "message":"Add Failed"});
        });
});

router.route('/parenttask/delete/:id').get((req, res) => {
    logger.info("Deleting Parent Task: ", req.params.id);
    projmgr.Parent.findByIdAndRemove({_id: req.params.id}, (err, ptask) => {
        if (err) {
            res.json('Error deleting Parent Task');
        } else {
            res.json('Parent Task Removed Successfully');
        }
    });
});

// route or API for Projects
router.route('/projects').get((req, res) => {
    logger.info('Request Received to Fetch Project!');
    projmgr.Project.find((err, projects) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json(projects);
        }
    });
});

router.route('/projects/:id').get((req, res) => {
    projmgr.Project.findById(req.params.id, (err, project) => {
        if (err) {
            logger.info({ "message":"Error Getting the project",
                          "project ID": req.params.id,
                          "Error": err
                        });
            res.status(400).json({});
        } else {
            res.json(project);
        }
    });
});

router.route('/project/add').post((req, res) => {
    logger.info({ "message":"Adding New Project: ",
                  "req.body": req.body
                });    
    let project = new projmgr.Project(req.body);
    project.save()
        .then(project => {
            res.status(200).json({'Project': 'Added Successfully'});
            logger.info({ "message":"Project Added Successfully"});
        })
        .catch(err => {
            res.status(400).send('Failed to create new Project');
            logger.info({ "message":"project Add Failed"});
        });
});

router.route('/project/update/:id').post((req, res) => {
    logger.info({ "message":"Updating Project: ",
                  "req.params.id": req.params.id,
                  "req.body": req.body
                });
    projmgr.Project.findById(req.params.id, (err, project) => {
        if (!project)
            return next(new Error('Could not load the Project document'));
        else {
            project.project_name = req.body.project_name;
            project.start_date = req.body.start_date;
            project.end_date = req.body.end_date;
            project.priority = req.body.priority;
            project.user = req.body.user;
            project.save().then(project => {
                res.status(200).json('Project Update Done');
            }).catch(err => {
                res.status(400).send('Project Update Failed!');
            });
        }
    });
});

router.route('/project/delete/:id').get((req, res) => {
    logger.info("Deleting Project: ", req.params.id);
    projmgr.Project.findByIdAndRemove({_id: req.params.id}, (err, project) => {
        if (err) {
            res.json('Error deleting Project');
        } else {
            res.json('Project Removed Successfully');
        }
    });
});


// Attach another middleware - router
app.use('/', router);

//app.get('/', (req, res) => res.send("My First Ever Node/Express Server: Hello World, I have Arrived!!"));

var server = app.listen(port, hostname, () => {
    logger.info(`My First ever Express Server running on Port ${hostname}:${port}`);
});

module.exports = server;