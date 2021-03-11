const { json } = require("express");
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
var router = express.Router();
const hbs = require("hbs");
const mongoose = require("mongoose");
require("../src/db/conn");
const Employee = require("../src/models/employee");

const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(partials_path));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

router.get("/", (req, res) => {
    res.render("addOrEdit", {
    viewTitle: "Insert Employee",
  });
});


//user
router.post("/", (req, res) => {
  if (req.body._id == "") insertRecord(req, res);
  else updateRecord(req, res);
});

function insertRecord(req, res) {
  var employee = new Employee();
  employee.fullName = req.body.fullName;
  employee.email = req.body.email;
  employee.mobile = req.body.mobile;
  employee.city = req.body.city;
  employee.save((err, doc) => {
    if (!err) res.redirect("employee/list");
    else {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
        res.render("addOrEdit", {
          viewTitle: "Insert Employee",
          employee: req.body,
        });
      } else console.log("Error during record insertion : " + err);
    }
  });
}

function updateRecord(req, res) {
  Employee.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("employee/list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("addOrEdit", {
            viewTitle: "Update Employee",
            employee: req.body,
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}



//user list
router.get("/list", (req, res) => {
  Employee.find((err, docs) => {
    if (!err) {
      res.render("list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieving employee list :" + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "fullName":
        body["fullNameError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}
// admin
router.get("/admin", (req, res) => {
  Employee.find((err, docs) => {
    if (!err) {
      res.render("adminlist", {
        list: docs,
      });
    } else {
      console.log("Error in retrieving employee list :" + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "fullName":
        body["fullNameError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}


router.post("/list", (req, res) => {
  Employee.find((err, docs) => {
    if (!err) {
      res.render("list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieving employee list :" + err);
    }
  });
});


router.get("/:id", (req, res) => {
  Employee.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("addOrEdit", {
        viewTitle: "Update Employee",
        employee: doc,
      });
    }
  });
});



router.get('/delete/:id', (req, res) => {
  Employee.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          res.redirect("/employee/list");
      }
      else { console.log('Error in employee delete :' + err); }
  });
});

module.exports = router;
