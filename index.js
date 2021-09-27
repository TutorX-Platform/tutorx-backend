const express = require("express");
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")("sk_test_51Ff6WELnesZei0UrDmZSK8th4AycDeItUDsOiEB2I1gKx2yaPp8BOWpb4P8FvX4bsewm6wbPHtioqr0eeb9hmaxD00Vh8PL3H8")
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
const { response } = require("express");
const cors = require("cors");
var generator = require('./utils/generator')

const app = express();
const hbs = require('nodemailer-express-handlebars');
const DeviceDetector = require("device-detector-js");

// middleware
var whitelist = ['https://tutetory.com']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(express.json());
app.use(cors(corsOptions));



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
            message: "payment success",
            result: result,
            status: 200
        }
        res.status(200).json(response)
    }).catch(err => {
        const response = {
            error: err,
            status: 400
        }
        res.status(400).json(response)
    })
});

app.post("/email", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    var transporter = nodemailer.createTransport({
        host: 'smtppro.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: 'noreply@tutetory.com',
            pass: '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'
        },
        tls: {
            rejectUnauthorized: false,
        },
    });


    var mailOptions = {
        from: 'noreply@tutetory.com',
        to: req.body.toEmail,
        subject: req.body.subject,
        text: req.body.text,
        html: { path: './views/main.handlebars' }
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send({ error: "Email has not been sent...", request: req.body, error: error });
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
});

app.get("/id", (req, res) => {
    var seqId = generator.generate();
    const response = {
        status: 200,
        message: seqId
    }
    res.status(200).json(response);
})

app.get("/validate", (req, res) => {
    const deviceDetector = new DeviceDetector();
    const userAgent = req.headers['user-agent'];
    const device = deviceDetector.parse(userAgent);
    let response = {};
    if (device.client != null && device.client.type === 'browser') {
        response = {
            status: 200,
            message: true
        }
        res.status(200).json(response);
    } else {
        response = {
            status: 400,
            message: false
        }
        res.status(400).json(response);
    }
})



// listen
app.listen(5000, () => {
    console.log("Express Server started at port: " + process.env.PORT);
});