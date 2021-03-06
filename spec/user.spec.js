var Request = require("request");
var mongoose = require('mongoose');
var origTimeOut;
var userIDToDel;

describe("Test Project Manager Backend APIs",() => {
    var server;
    beforeAll(() => {
        console.log("Opening The Server");
        server = require("../server");
        origTimeOut = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    });
    afterAll(() => {
        console.log("Closing The Server");
        server.close();
    });

    beforeEach(() => {
        origTimeOut = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeOut;
    });

    describe("Get All users", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:9001/users", (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Response Status", () => {
            expect(data.status).toBe(200);
        });
        it("Response Message", () => {
            expect(data.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET Existent User By ID", () => {
        var data = {};
        //var userID = "5c904861924c0c298918ee6c";
        var userID = "5c92894c1c9d4400005e88a2";
        var APIurl = "http://localhost:9001/users/" + userID;
        beforeAll((done) => {
            Request.get(APIurl,
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Found User", () => {
            expect(data.status).toBe(200);
        });
        it("Test Body", () => {
            expect(data.body._id).toEqual(userID);
        });
    });

    describe("GET Non Existent User By ID", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:9001/users/123",
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Can not find User", () => {
            expect(data.status).toBe(400);
        });
        it("Response Message", () => {
            expect(data.body).toEqual({});
        });
    });
    
    describe("Add a New User", () => {
        var data = {};
        var last_name = "Unit Test Last Name";
        var employee_id = Math.floor(Math.random()* (9000-1000)+1000);
        var first_name = "My Unit Test User" + employee_id;
        beforeAll((done) => {
            Request.post("http://localhost:9001/user/add", 
                         {
                            json: {
                                "first_name": first_name,
                                "last_name": last_name,
                                "employee_id": employee_id
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(JSON.stringify(body));
                done();
            });
        });

        it("Add User Request Status", () => {
            expect(data.status).toBe(200);
        });
        it("Add User Message Body", () => {
             expect(data.body.User).toEqual("Added Successfully");
        });
    });

    describe("Try Adding a existing User", () => {
        var data = {};
        var last_name = "Unit Test Last Name";
        var employee_id = 12345;
        var first_name = "My Unit Test User" + employee_id;
        beforeAll((done) => {
            Request.post("http://localhost:9001/user/add", 
                         {
                            json: {
                                "first_name": first_name,
                                "last_name": last_name,
                                "employee_id": employee_id
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(JSON.stringify(body));
                done();
            });
        });

        it("Try Adding Existing User Request Status", () => {
            expect(data.status).toBe(400);
        });
    });

    describe("GET Existent User By Employee ID", () => {
        var data = {};
        var employeeID = "12345";
        var APIurl = "http://localhost:9001/getuserbyempid/" + employeeID;
        beforeAll((done) => {
            Request.get(APIurl,
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Found User", () => {
            expect(data.status).toBe(200);
        });
        it("Test Body", () => {
            var strEmpID = data.body.employee_id.toString();
            expect(strEmpID).toEqual(employeeID);
        });
    });

    describe("Delete a non-existent User", () => {
        var data = {};
        userIDToDel = "5c92881ed0edb5594b49a46b";
        var APIurl = "http://localhost:9001/user/delete/" + userIDToDel;
        beforeAll((done) => {
            Request.get(APIurl,
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Delete non-existing User Response Code", () => {
            expect(data.status).toBe(200);
        });
    });
    
    /////////////////////////////
    // Project API Test Cases  //
    /////////////////////////////
    describe("Get All Projects", () => {
        var data = {};
        var userIDToDel;
        beforeAll((done) => {
            Request.get("http://localhost:9001/projects", (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Response Status", () => {
            expect(data.status).toBe(200);
        });
        it("Response Message", () => {
            expect(data.body.length).toBeGreaterThan(0);
        });
    });

    describe("Get Existent Project By ID", () => {
        var data = {};
        //var userID = "5c904861924c0c298918ee6c";
        var projID = "5c9401a01c9d4400001350a2";
        var APIurl = "http://localhost:9001/projects/" + projID;
        beforeAll((done) => {
            Request.get(APIurl,
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Found Project", () => {
            expect(data.status).toBe(200);
        });
        it("Response Body", () => {
            expect(data.body._id).toEqual(projID);
        });
    });

    describe("Get Non Existent Project By ID", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:9001/projects/123",
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Can not find Project", () => {
            expect(data.status).toBe(400);
        });
        it("Response Message", () => {
            expect(data.body).toEqual({});
        });
    });
    
    describe("Add a New Project", () => {
        var data = {};
        var project_id = Math.floor(Math.random()* (9000-1000)+1000);
        var project_name = "Unit Test Project Name" + project_id;
        var start_date = new Date();
        var end_date = new Date();
        end_date.setDate(end_date.getDate() + 1);
        var priority = 3;
        var user = "5c92894c1c9d4400005e88a2";
        beforeAll((done) => {
            Request.post("http://localhost:9001/project/add", 
                         {
                            json: {
                                "project_name": project_name,
                                "start_date": start_date,
                                "end_date": end_date,
                                "priority": priority,
                                "user": user
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(JSON.stringify(body));
                done();
            });
        });

        it("Add Project Request Status", () => {
            expect(data.status).toBe(200);
        });
        it("Add Project Message Body", () => {
             expect(data.body.Project).toEqual("Added Successfully");
        });
    });

    describe("Try Adding a existing Project", () => {
        var data = {};
        var project_name = "My First Project";
        var start_date = new Date();
        var end_date = new Date();
        end_date.setDate(end_date.getDate() + 1);
        var priority = 3;
        var user = "5c92894c1c9d4400005e88a2";
        beforeAll((done) => {
            Request.post("http://localhost:9001/project/add", 
                         {
                            json: {
                                "project_name": project_name,
                                "start_date": start_date,
                                "end_date": end_date,
                                "priority": priority,
                                "user": user
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(JSON.stringify(body));
                done();
            });
        });

        it("Add Project Request Status", () => {
            expect(data.status).toBe(400);
        });
    });

    ///////////////////////////
    // Tasks APIs            //
    ///////////////////////////
    describe("Get All Task", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:9001/tasks", (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Response Status", () => {
            expect(data.status).toBe(200);
        });
        it("Response Message", () => {
            expect(data.body.length).toBeGreaterThan(0);
        });
    });

    describe("Get Existent Task By ID", () => {
        var data = {};
        var taskID = "5c959fc61c9d440000845fca";
        var APIurl = "http://localhost:9001/tasks/" + taskID;
        beforeAll((done) => {
            Request.get(APIurl,
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Found Tasks", () => {
            expect(data.status).toBe(200);
        });
        it("Response Body", () => {
            expect(data.body._id).toEqual(taskID);
        });
    });

    describe("Get Existent Task By Project", () => {
        var data = {};
        var projID = "5c96c1b51c9d4400001b5628";
        var taskID = "5c959fc61c9d440000845fca";
        var APIurl = "http://localhost:9001/gettasksbyproj/" + projID;
        beforeEach((done) => {
            Request.get(APIurl,
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Found Tasks", (done) => {
            expect(data.status).toBe(200);
            expect(data.body[0]._id).toEqual(taskID);
            done();
        });
    });    

    describe("Add a New Task", () => {
        var data = {};
        var task_id = Math.floor(Math.random()* (9000-1000)+1000);
        var task = "Unit Test Task Name" + task_id;
        var start_date = new Date();
        var end_date = new Date();
        end_date.setDate(end_date.getDate() + 1);
        var priority = 10;
        var status = false;
        var user = mongoose.Types.ObjectId("5c92894c1c9d4400005e88a2");
        var project = mongoose.Types.ObjectId("5c9401a01c9d4400001350a2");
        var parent = mongoose.Types.ObjectId("5c959cf91c9d440000845fc8");
        beforeAll((done) => {
            Request.post("http://localhost:9001/task/add", 
                         {
                            json: {
                                "task": task,
                                "start_date": start_date,
                                "end_date": end_date,
                                "priority": priority,
                                "status": status,
                                "user": user,
                                "project": project,
                                "parent": parent
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(JSON.stringify(body));
                done();
            });
        });
        it("Added Task", () => {
            expect(data.status).toBe(200);
        });
    });

    describe("Try to Add an Existing Task", () => {
        var data = {};
        var task = "My First Task";
        var start_date = new Date();
        var end_date = new Date();
        end_date.setDate(end_date.getDate() + 1);
        var priority = 10;
        var status = false;
        var user = mongoose.Types.ObjectId("5c92894c1c9d4400005e88a2");
        var project = mongoose.Types.ObjectId("5c9401a01c9d4400001350a2");
        var parent = mongoose.Types.ObjectId("5c959cf91c9d440000845fc8");
        beforeAll((done) => {
            Request.post("http://localhost:9001/task/add", 
                         {
                            json: {
                                "task": task,
                                "start_date": start_date,
                                "end_date": end_date,
                                "priority": priority,
                                "status": status,
                                "user": user,
                                "project": project,
                                "parent": parent
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(JSON.stringify(body));
                done();
            });
        });
        it("Tring to Add existing Task", () => {
            expect(data.status).toBe(400);
        });
    });

    ///////////////////////////
    // Parent Tasks APIs     //
    ///////////////////////////
    describe("Get All Parent Tasks", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:9001/parenttasks", (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Response Status", () => {
            expect(data.status).toBe(200);
        });
        it("Response Message", () => {
            expect(data.body.length).toBeGreaterThan(0);
        });
    });

    describe("Get Existent Parent Task By ID", () => {
        var data = {};
        var taskID = "5c959cf91c9d440000845fc8";
        var APIurl = "http://localhost:9001/parenttasks/" + taskID;
        beforeAll((done) => {
            Request.get(APIurl,
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Found Tasks", () => {
            expect(data.status).toBe(200);
        });
        it("Response Body", () => {
            expect(data.body._id).toEqual(taskID);
        });
    });    

    describe("Add a New Parent Task", () => {
        var data = {};
        var task_id = Math.floor(Math.random()* (9000-1000)+1000);
        var task = "Unit Test Parent Task" + task_id;

        beforeAll((done) => {
            Request.post("http://localhost:9001/parenttask/add", 
                         {
                            json: {
                                "parent_task": task
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(JSON.stringify(body));
                done();
            });
        });

        it("Add Parent Task Request Status", () => {
            expect(data.status).toBe(200);
        });
        it("Add Parent Task Message Body", () => {
             expect(data.body.Parent).toEqual("Added Successfully");
        });
    });

    describe("Try Adding an Existing Parent Task", () => {
        var data = {};
        var task = "First Parent Task";

        beforeAll((done) => {
            Request.post("http://localhost:9001/parenttask/add", 
                         {
                            json: {
                                "parent_task": task
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(JSON.stringify(body));
                done();
            });
        });

        it("Add Parent Task Request Status", () => {
            expect(data.status).toBe(400);
        });

    });

    describe("Delete an Existing Parent Task", () => {
        var data = {};
        var ptaskToDel;
        var counter = 1;
        beforeEach((done) => {
            if (counter == 1) {
                Request.get("http://localhost:9001/parenttasks", (err, response, body) => {
                    data.status = response.statusCode;
                    data.body = JSON.parse(body);
                    counter++;
                    done();
                });
            } 
            if (counter == 2) {
                var APIurl = "http://localhost:9001/parenttask/delete/" + ptaskToDel;
                Request.get(APIurl, (err, response, body) => {
                    data.status = response.statusCode;
                    data.body = JSON.parse(body);
                    done();
                });
            }
        });

        it("Response Status", (done) => {
            ptaskToDel = data.body[3]._id;
            expect(data.status).toBe(200);
            done();            
        });

        it("Delete Response Status", (done) => {
            expect(data.status).toBe(200);
            done();            
        });
    });    

    ////////////////////////////////
    // Delete APIs                //
    ////////////////////////////////
    describe("Delete an Existing Task", () => {
        var data = {};
        var taskToDel;
        var counter = 1;
        beforeEach((done) => {
            if (counter == 1) {
                Request.get("http://localhost:9001/tasks", (err, response, body) => {
                    data.status = response.statusCode;
                    data.body = JSON.parse(body);
                    counter++;
                    done();
                });
            } 
            if (counter == 2) {
                var APIurl = "http://localhost:9001/task/delete/" + taskToDel;
                Request.get(APIurl, (err, response, body) => {
                    data.status = response.statusCode;
                    data.body = JSON.parse(body);
                    done();
                });
            }
        });

        it("Response Status", (done) => {
            taskToDel = data.body[3]._id;
            expect(data.status).toBe(200);
            done();            
        });

        it("Delete Response Status", (done) => {
            expect(data.status).toBe(200);
            done();            
        });
    });        

    // describe("Delete an Existing User", () => {
    //     var data = {};
    //     var userToDel;
    //     var ucounter = 1;
    //     beforeEach((done) => {
    //         if (ucounter == 1) {
    //             console.log("Getting ALL USERS");
    //             Request.get("http://localhost:9001/users", (err, response, body) => {
    //                 data.status = response.statusCode;
    //                 data.body = JSON.parse(body);
    //                 ucounter++;
    //                 done();
    //             });
    //         } 
    //         if (ucounter == 2) {
    //             console.log("User to Delete: ", userToDel);
    //             var APIurl = "http://localhost:9001/user/delete/" + userToDel;
    //             Request.get(APIurl, (err, response, body) => {
    //                 data.status = response.statusCode;
    //                 data.body = JSON.parse(body);
    //                 done();
    //             });
    //         }
    //     });

    //     it("Response Status", (done) => {
    //         expect(data.status).toBe(200);
    //         console.log("data.status: ", data.status);
    //         if (data.status == 200) {
    //             userToDel = data.body[3]._id;
    //         }
    //         done();            
    //     });

    //     it("Delete Response Status", (done) => {
    //         expect(data.status).toBe(200);
    //         done();            
    //     });
    // });            

    describe("Delete an Existing Project", () => {
        var data = {};
        var projToDel;
        var counter = 1;
        beforeEach((done) => {
            if (counter == 1) {
                Request.get("http://localhost:9001/projects", (err, response, body) => {
                    data.status = response.statusCode;
                    data.body = JSON.parse(body);
                    counter++;
                    done();
                });
            } 
            if (counter == 2) {
                var APIurl = "http://localhost:9001/project/delete/" + projToDel;
                Request.get(APIurl, (err, response, body) => {
                    data.status = response.statusCode;
                    data.body = JSON.parse(body);
                    done();
                });
            }
        });

        it("Response Status", (done) => {
            expect(data.status).toBe(200);
            if (data.status == 200) {
                projToDel = data.body[3]._id;
            }
            done();            
        });

        it("Delete Response Status", (done) => {
            expect(data.status).toBe(200);
            done();            
        });
    });    

    ////////////////////////////////
    // Update APIs                //
    ////////////////////////////////
    describe("Update an Existing Task", () => {
        var data = {};
        var taskID = "5c959fc61c9d440000845fca";
        var APIurl = "http://localhost:9001/task/update/" + taskID;
        var task = "My First Task";
        var start_date = new Date();
        var end_date = new Date();
        end_date.setDate(end_date.getDate() + 1);
        var priority = 17;
        var status = false;
        var user = mongoose.Types.ObjectId("5c92894c1c9d4400005e88a2");
        var project = mongoose.Types.ObjectId("5c96c1b51c9d4400001b5628");
        var parent = mongoose.Types.ObjectId("5c959cf91c9d440000845fc8");

        beforeAll((done) => {
            Request.post(APIurl, 
                         {
                            json: {
                                "task": task,
                                "start_date": start_date,
                                "end_date": end_date,
                                "priority": priority,
                                "status": status,
                                "user": user,
                                "project": project,
                                "parent": parent
                            }
                         },
                         (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(JSON.stringify(body));
                done();
            });
        });
        it("Update existing Task", () => {
            expect(data.status).toBe(200);
        });
    });    

});