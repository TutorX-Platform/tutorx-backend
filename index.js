const express = require("express");
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")("sk_test_51Ff6WELnesZei0UrDmZSK8th4AycDeItUDsOiEB2I1gKx2yaPp8BOWpb4P8FvX4bsewm6wbPHtioqr0eeb9hmaxD00Vh8PL3H8")
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
const { response } = require("express");

const app = express();

// middleware

app.use(express.json());
app.use(cors({ origin: '*' }));



//routes
app.get("/", (req, res) => {
    res.send("tutorx payment backend works");
})

app.get('/time', (req, res) => {
    const response = {
        time: Date.now(),
        status: 'success'
    }
    return res.status(200).send(response);
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
    res.header("Access-Control-Allow-Origin", "*");
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'sandunsameera25@gmail.com',
            pass: 'sandunsameeragmail'
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    var mailOptions = {
        from: 'sandunsameera25@gmail.com',
        to: req.body.toEmail,
        subject: req.body.subject,
        text: req.body.text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send({ error: "Email has not been sent..." });
            return console.log(error);
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
app.listen(5000, () => {
    console.log("Express Server started at port: " + process.env.PORT);
});