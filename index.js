const cors = require("cors");
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")(process.env.publishable_key)
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

const app = express();

// middleware

app.use(express.json());
app.use(cors());


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
    }).catch(err => console.log(err))
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
        from: 'somerealemail@gmail.com',
        to: 'sandunsameera25@gmail.com',
        subject: 'Sending Email using Node.js[nodemailer]',
        text: 'That was easy!'
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
app.listen(8282, () => console.log("listning at port 8282"));