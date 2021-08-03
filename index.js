const cors = require("cors");
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")("sk_test_51Ff6WELnesZei0Uruf1G7kolU3wK7Skh1eZc5t69eiX7Qst52l1xmXlRicvITG1B7RDnKtGKMWqjE63ijQfSbin400hLsoJ2ea")
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

const app = express();

// middleware

app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://tutorx-frontend.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


//routes
app.get("/", (req, res) => {
    res.send("tutorx payment backend works");
})

app.post("/payment", (req, res) => {

    const { product, token } = req.body;
    const idempontencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token.id,
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'USD',
            customer: customer.id,
            description: `Purchase of ${product.name}`,
            receipt_email: product.email
        })
    }).then((result) => {
        const response = {
            status: 200
        }
        res.status(200).json(response)
    }).catch(err => {
        const response = {
            status: 400
        }
        res.status(400).json(response)
    })
});

app.post("/email", async (req, res) => {
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'sandunsameera25@gmail.com',
            pass: 'sandunsameeragmail'
        }
    }));

    var mailOptions = {
        from: req.body.fromEmail,
        to: req.body.toEmail,
        subject: req.body.subject,
        text: req.body.text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            const response = {
                status: 200,
                message: "email sent"
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json(response)
        }
    });
})


// listen
app.listen(process.env.PORT || 5000, () => {
    console.log("Express Server started at port: " + process.env.PORT);
});