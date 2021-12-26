const express = require("express");
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")("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")
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
const { response } = require("express");
const cors = require("cors");
var generator = require('./utils/generator')
var replacements = require('./replacements');

const app = express();
const hbs = require('nodemailer-express-handlebars');
const DeviceDetector = require("device-detector-js");
const bodyParser = require("body-parser");
const firebase = require('./db');
const question = require('./models/question');
const firestore = firebase.firestore();
var fs = require('fs');
var handlebars = require('handlebars');

var api_key = '01cf879ace282abd0111ae714dc21dfa-2bf328a5-3af313e4';
var domain = 'tutetory.com';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain, host: 'api.eu.mailgun.net' });

var data = {
    from: "sandunsameera25@gmail.com",
    to: 'tharindu.prf@gmail.com',
    subject: 'hello',
    text: "welcome to tutetory"
}




// middleware
// var whitelist = ['https://tutetory.com']
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }

app.use(express.json());
// app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.json());


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
});

app.post('/email', (req, res) => {
    mailgun.messages().send(data, function (error, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(body, "sent mail");
        }
        // console.log(body, "abc");
    })

})

app.post("/payment", (req, res) => {
    const resp = {};
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
            status: 200,
            resp: resp
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


app.post("/question", async (req, res) => {
    try {
        var abc = new Date(req.body.dueDate)
        var data = req.body;
        data.dueDate = abc;
        await firestore.collection('question').doc(data.id).set(data);
        const response = {
            staus: 200
        }
        res.status(200).send(response);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.post("/mail", async (req, res) => {
    try {
        var replace = require('./replacements');
        const replacements = req.body.replacement;
        const filePath = './views/' + req.body.fileName;
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);
        const htmlToSend = template(replacements);
        var api_key = '0031faca3939ed12a071f6e275ce1506-2ac825a1-1322dfe9';
        var domain = 'sandbox67b0de9ada694876b232dec5723f3e27.mailgun.org';
        var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

        var data = {
            from: "noreply@tutetory.com",
            to: req.body.toEmail,
            subject: req.body.subject,
            html: htmlToSend
        };

        mailgun.messages().send(data, function (error, body) {
            if (error) {
                res.send({ error: "Email has not been sent...", request: req.body, error: error });
                return console.log(error);
            } else {
                const response = {
                    status: 200,
                    message: "email sent"
                }
                res.status(200).json(response);
            }
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
});




// listen
app.listen(5000, () => {
    console.log("Express Server started at port: " + process.env.PORT);
});