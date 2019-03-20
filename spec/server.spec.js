var Request = require("request");

describe("Test Project Manager Backend APIs",() => {
    var server;
    beforeAll(() => {
        console.log("Opening The Server");
        server = require("../server");
    });
    afterAll(() => {
        console.log("Closing The Server");
        server.close();
    });

    describe("GET /users", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:9001/users", (err, response, body) => {
                data.status = response.statusCode;
                data.body = JSON.parse(body);
                done();
            });
        });

        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("Test Body", () => {
            expect(data.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET Existent User By ID", () => {
        var data = {};
        var userID = "5c904861924c0c298918ee6c";
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
        it("Test Body", () => {
            expect(data.body).toEqual({});
        });
    });
    
    describe("Add User", () => {
        var data = {};
        var first_name = "My Unit Test User";
        var last_name = "Unit Test Last Name";
        var employee_id = Math.floor(Math.random()* (2000-1000)+1000);
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
});