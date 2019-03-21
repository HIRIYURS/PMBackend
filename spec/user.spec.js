var Request = require("request");
var origTimeOut;
var userIDToDel;

describe("Test Project Manager Backend APIs",() => {
    var server;
    beforeAll(() => {
        console.log("Opening The Server");
        server = require("../server");
        origTimeOut = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

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
        var userIDToDel;
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
            // Save ID to be used for delete user test case
            userIDToDel = data.body[0]._id;
            userEmpIDToDel = data.body[0].employee_id;
            console.log("User ID: ", userIDToDel);
            console.log("Employee ID: ", userEmpIDToDel);
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
});