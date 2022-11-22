const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID;
suite('Functional Tests', function() {

  suite('./api/issues/apitest POST', function() {

    test("Issue with every field", function(done) {
      chai
          .request(server)
          .post("/api/issues/projects")
          .send({
            issue_title: "Test 1",
            issue_text: "First Test",
            created_by: "FCC",
            assigned_to: "Someone",
            status_text: "New",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            deleteID = res.body._id;
            assert.equal(res.body.issue_title, "Test 1");
            assert.equal(res.body.assigned_to, "Someone");
            assert.equal(res.body.created_by, "FCC");
            assert.equal(res.body.status_text, "New");
            assert.equal(res.body.issue_text, "First Test");
            done();
          });
      });

    test("Issue with required fields", function(done) {
      chai
          .request(server)
          .post("/api/issues/projects")
          .send({
            issue_title: "Test 1",
            issue_text: "First Test",
            created_by: "FCC",
            assigned_to: "",
            status_text: "",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            deleteID = res.body._id;
            assert.equal(res.body.issue_title, "Test 1");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.created_by, "FCC");
            assert.equal(res.body.status_text, "");
            assert.equal(res.body.issue_text, "First Test");
            done();
          });
      });

    test("Issue with missing required fields", function(done) {
      chai
          .request(server)
          .post("/api/issues/projects")
          .send({
            issue_title: "Test 1",
            issue_text: "",
            created_by: "",
            assigned_to: "",
            status_text: "",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "required field(s) missing");
            done();
          });
      });
 })

 suite('./api/issues/apitest GET', function() {
   
    test("View issues on a project", function (done) {
        chai
          .request(server)
          .get("/api/issues/apitest")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 5);
            done();
          });
      });
   
    test("View issues on a project with one filter", function (done) {
        chai
          .request(server)
          .get("/api/issues/apitest")
          .query({_id: "637bc9c70f8fbb7b6e160746"})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              issue_title: "Test1",
              issue_text: "first project; second project",
              created_on:"2022-11-21T18:56:07.686Z",
              updated_on:"2022-11-21T18:56:07.686Z",
              created_by: "Renata",
              assigned_to: "you",
              open: true,
              status_text:"new",
              _id: "637bc9c70f8fbb7b6e160746",
            });
            done();
          });
      });

   test("View issues on a project with multiple filters", function (done) {
        chai
          .request(server)
          .get("/api/issues/apitest")
          .query({created_by: "re", issue_text: "third test"})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              issue_title: "test2",
              issue_text: "third test",
              created_on:"2022-11-22T01:28:58.658Z",
              updated_on:"2022-11-22T01:28:58.658Z",
              created_by: "re",
              assigned_to: "you",
              open: true,
              status_text:"new",
              _id: "637c25daf0dab5ef2c0bf9f7",
            });
            done();
          });
      });
    })

   suite('./api/issues/apitest PUT', function() {

      test("Update one field on an issue", function (done) {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: "637cd05c3b52d144d6b66600",
            issue_title: "new title",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "637cd05c3b52d144d6b66600");

            done();
          });
      });

     test("Update multiple fields on an issue", function (done) {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: "637cd0403b52d144d6b665f8",
            issue_title: "new title",
            issue_text: "new text",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "637cd0403b52d144d6b665f8");

            done();
          });
      });

     test("Update an issue with missing _id", function (done) {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            issue_title: "new title",
            issue_text: "new text",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");

            done();
          });
      });

     test("Update an issue with no fields to update", function (done) {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: "637c25daf0dab5ef2c0bf9f7"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");

            done();
          });
      });

     test("Update an issue with invalid_id", function (done) {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: "123456",
            issue_title: "new",
            issue_text: "new",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");

            done();
          });
      });

   })
 
 
 suite('./api/issues/projects DELETE', function() {

   test("Delete an issue", function (done) {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({
            _id: deleteID,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");

            done();
          });
      });
 
 
    test("Delete an issue with invalid _id", function (done) {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({
            _id: "123456",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not delete");

            done();
          });
      });

   
    test("Delete an issue with missing _id", function (done) {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");

            done();
          });
      });
 


 })
   


  
});
