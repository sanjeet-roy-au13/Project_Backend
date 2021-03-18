const employeeController = require("../controllers/employeeController.js");

var nodemailer = require("nodemailer");


const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");
const { log } = require("console");
const { nextTick } = require("process");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get('/admin', (req, res) => {
  register.find({}, function(err, movies) {
      res.render('admin', {
          registerList: registers
      })
  })
})

// create a new user in our database
app.post("/register", async (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "roymicky880@gmail.com",
      pass: "sanchit111.",
    },
  });

  var mailOptions = {
    from: "roymicky880@gmail.com",
    to: req.body.email,
    subject: "Email Verification For login",
    html: "<h1>Your Verification code is <b> UniT </h1>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        address: req.body.address,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });

      console.log("the success part" + registerEmployee);

      const token = await registerEmployee.generateAuthToken();
      console.log("the token part" + token);

      const registered = await registerEmployee.save();
      console.log("the page part" + registered);

      res.status(201).render("verification");
    } else {
      res.send("password are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
    console.log("the error part page ", error);
  }
});
app.post("/otp", (req, res) => {
  if (req.body.verify == "UniT") {
    res.render("login");
  } else {
    res.render("verification");
  }
});
// login check for user
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, useremail.password);

    const token = await useremail.generateAuthToken();
    if (isMatch) {
      res.status(201).render("list");
    } else {
      res.send("invalid Password Details");
    }
  } catch (error) {
    res.status(400).send("invalid login Details");
  }
});

// login for Admin
app.post("/login/admin", async (req, res) => {
  try {
    const adminEmail = req.body.adminEmail;
    const adminPassword = req.body.adminPassword;

    const useremail = await Register.findOne({ email: adminEmail });

    const isMatch = await bcrypt.compare(adminPassword, useremail.password);

    const token = await useremail.generateAuthToken();
    if (isMatch && useremail.role =="admin") {
      res.status(201).render("adminlist");
    } else {
      res.send("Not An Admin Please Try to logIn from User Login Form");
    }
  } catch (error) {
    res.status(400).send("invalid login Details");
  }
});


app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
app.use("/employee", employeeController);
