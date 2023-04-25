require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const _ = require("lodash");
const multer = require("multer");
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
   
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadStr = multer({ storage: storage });
const uploadAct = multer({ storage: storage });

var connectionString = "mongodb+srv://" + process.env.USERNAME + ":" + process.env.MONGOSECRET + "@clustertraining.lt71w6j.mongodb.net/armadillo";
mongoose.connect(connectionString);

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String
});

userSchema.plugin(encrypt, {
    secret: process.env.USERSECRET,
    encryptedFields: ['password']
});

const User = mongoose.model("User", userSchema);

const structureSchema = new mongoose.Schema({
    name: String,
    address: String,
    place: String,
    country: String,
    classification: String,
    email: String,
    site: String,
    phone: String,
    levelDisability: [String],
    typeDisability: [String],
    source: String,
    note: String,
    pictures: [String]
 });

const Structure = mongoose.model("Structure", structureSchema);

const activitySchema = new mongoose.Schema({
    name: String,
    address: String,
    place: String,
    country: String,
    email: String,
    site: String,
    phone: String,
    levelDisability: [String],
    typeDisability: [String],
    reference: String,
    source: String,
    note: String,
    pictures: [String]
 });
const Activity = mongoose.model("Activity", activitySchema);

const clientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    place: String,
    country: String,
    email: String,
    phone: String,
    countPerson: Number,
    dateTrip: Date,
    levelDisability: [String],
    typeDisability: [String],
    specialNeeds: [String],
    specialNeedsOther: String,
    destination: [String],
    destinationOther: String,
    structure: [String],
    structureOther: String,
    services: [String],
    servicesOther: String,
    needs: String,
    pictures: [String]
 });
const Client = mongoose.model("Client", clientSchema);

app.get("/", (req,res) => {
    res.render("home", {
        active: "home"
    });
});

app.post("/clients-str", (req,res) => {
    if (req.body.levelDisabilityCli && req.body.typeDisabilityCli) {
        Structure.find({
            levelDisability: req.body.levelDisabilityCli,
            typeDisability: req.body.typeDisabilityCli
        }).then(el => {
            let structures = el;
            console.log(structures);
            res.render("clients", {
                active: "clients",
                structures: structures,
                activities: []
            })
        });    
    } else if (req.body.levelDisabilityCli) {
        Structure.find({
            levelDisability: req.body.levelDisabilityCli
        }).then(el => {
            let structures = el;
            res.render("clients", {
                active: "clients",
                structures: structures,
                activities: []
            });
        });
    } else if (req.body.typeDisabilityCli) {
        Structure.find({
            typeDisability: req.body.typeDisabilityCli
        }).then(el => {
            let structures = el;
            res.render("clients", {
                active: "clients",
                structures: structures,
                activities: []
            });    
        });
    }
});
app.post("/clients-act", (req,res) => {
    if (req.body.levelDisabilityCli && req.body.typeDisabilityCli) {
        Activity.find({
            levelDisability: req.body.levelDisabilityCli,
            typeDisability: req.body.typeDisabilityCli
        }).then(el => {
            let activities = el;
            console.log(activities);
            res.render("clients", {
                active: "clients",
                structures: [],
                activities: activities
            });    
        });
    } else if (req.body.levelDisabilityCli) {
        Activity.find({
            levelDisability: req.body.levelDisabilityCli
        }).then(el => {
            let activities = el;
            console.log(activities);
            res.render("clients", {
                active: "clients",
                structures: [],
                activities: activities
            });    
        });
    } else if (req.body.typeDisabilityCli) {
        Activity.find({
            typeDisability: req.body.typeDisabilityCli
        }).then(el => {
            let activities = el;
            console.log(activities);
            res.render("clients", {
                active: "clients",
                structures: [],
                activities: activities
            });    
        });
    }
});
app.route("/clients")
    .get((req,res) => {
        res.render("clients", {
            active: "clients",
            structures: [],
            activities: []
    })
    })
    .post((req,res) => {
        const newClient = new Client({
            name: req.body.nameCli,
            firstName: req.body.firstNameCli,
            address: req.body.addrCli,
            place: req.body.placeCli,
            email: req.body.emailCli,
            phone: req.body.phoneCli,
            countPerson: req.body.countCli,
            dateTrip: req.body.dateTripCli,
            levelDisability: req.body.levelDisabilityCli,
            typeDisability: req.body.typeDisabilityCli,
            specialNeeds: req.body.specialNeedsCli,
            specialNeedsOther: req.body.specialNeedsOtherCli,
            destination: req.body.destinationCli,
            specialNeedsOther: req.body.destinationOtherCli,
            structure: req.body.structureCli,
            structureOther: req.body.structureOtherCli,
            services: req.body.serviceCli,
            servicesOther: req.body.serviceOtherCli,
        });
        newClient.save().then(() => {
            res.render("clients", {
                active: "clients",
                structures: [],
                activities: []
            });    
        });    
    
        console.log(req.body);
    });
app.get("/structures", (req,res) => {

    Structure.find({}).then(el => {
        let structures = el;
        console.log(structures);
        res.render("structures", {
            active: "structures",
            structures: structures
        });
    
    })
});
app.get("/activities", (req,res) => {
    Activity.find({}).then(el => {
        let activities = el;
        console.log(activities);
        res.render("activities", {
            active: "activities",
            activities: activities
        });
    });
});
app.route("/register")
    .get((req,res) => {
        res.render("register");
    })
    .post((req,res) => {

        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        });
        newUser.save().then(() => {
            res.render("form");
        });    
    });
app.route("/login")
    .get((req,res) => {
        res.render("login");
    })
    .post((req,res) => {
        User.findOne({email: req.body.email}).then(el => {
            if (el) {
                if (el.password === req.body.password) {
                    res.render("form-str");
                } else {
                    res.render("login");
                }
            } else {
                res.render("register");
            }
        });
    });

app.route("/form-str")
    .get((req,res) => {
        res.render("form-str");
    })
    .post(uploadStr.array('picsStr', 10), (req, res, next) => {
    const files = req.files
    console.log(files);
    let pictures = [];
    if (files) {
        files.forEach(el => {
            pictures.push(el.path);
        });    
    }
    const newStructure = new Structure({
        name: req.body.nameStr,
        address: req.body.addrStr,
        place: req.body.placeStr,
        country: req.body.countryStr,
        classification: req.body.classStr,
        email: req.body.emailStr,
        site: req.body.siteStr,
        phone: req.body.phoneStr,
        levelDisability: req.body.levelDisabilityStr,
        typeDisability: req.body.typeDisabilityStr,
        source: req.body.sourceStr,
        note: req.body.noteStr,
        pictures: pictures
    });
    newStructure.save().then(() => {
        res.render("form-str");
    });    
});

app.route("/form-act")
    .get((req,res) => {
        res.render("form-act");
    })
    .post(uploadAct.array('picsAct', 10), (req, res, next) => {
        const files = req.files
        console.log(req.files);
        let pictures = [];
        if (files) {
            files.forEach(el => {
                pictures.push(el.path);
            });    
        }
        const newActivity = new Activity({
            name: req.body.nameAct,
            address: req.body.addrAct,
            place: req.body.placeAct,
            country: req.body.countryAct,
            classification: req.body.classAct,
            email: req.body.emailAct,
            site: req.body.siteAct,
            phone: req.body.phoneAct,
            levelDisability: req.body.levelDisabilityAct,
            typeDisability: req.body.typeDisabilityAct,
            reference: req.body.referenceAct,
            source: req.body.sourceAct,
            note: req.body.noteAct,
            pictures: pictures
        });
        newActivity.save().then(() => {
            res.render("form-act");
        });
    });

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on port 3000");
});

