// // const express = require("express");

// // const cors = require("cors");
// // const session = require("express-session");
// // const bodyParser = require("body-parser");
// // const cookieParser = require("cookie-parser");
// // const dotenv = require("dotenv");
// // const db = require("./config/Database.js");
// // const SequelizeStore = require("connect-session-sequelize");
// // const UserRoute = require("./routes/UserRoute.js");
// // const CourseRoute = require("./routes/CourseRoute.js");
// // const AuthRoute = require("./routes/AuthRoute.js");
// // const StudentRoute = require("./routes/StudentRoute.js");
// // // const StudentLogin = require("./routes/StudentLogin.js");
// // const EnrollRoute = require("./routes/EnrollRoute.js");
// // const PaymentRoute = require("./routes/PaymentRoute.js");
// // const associateModels = require('./models/association.js');
// // const ContactUs = require("./models/ContactModel.js");
// // const Contact = require("./routes/Contact.js");
// // // const Student = require('./StudentModel.js');
// // // const Enrollment = require('./EnrollmentModel.js');
// // // const Course = require('./CourseModel.js');
// // // const StudyMaterial = require('./StudyMaterialModel.js');
// // // const Payments = require('./PaymentModel.js');

// // dotenv.config();

// // const sessionStore = SequelizeStore(session.Store);

// // const store = new sessionStore({
// //     db: db
// // });

// // const app = express();
// // app.use(express.json());
// // (async()=>{
// //     await db.sync();
// // })();
// // associateModels();
// // // app.use(cookieParser);

// // app.use(session({
// //     secret: process.env.SESS_SECRET,
// //     resave: false,
// //     saveUninitialized: true, //true
// //     store: store,
// //     cookie: {
// //         maxAge: 60 * 60 * 1000,
// //         secure: 'auto'
// //     }
// // }));

// // app.use(cors({
// //     credentials: true,
// //     origin: 'http://localhost:3000'
// // }));
// // app.use("",express.static("uploads"));
// // app.use(express.json());
// // app.use(UserRoute);
// // app.use(CourseRoute);
// // app.use(AuthRoute);
// // app.use(EnrollRoute);
// // app.use(StudentRoute);
// // app.use(PaymentRoute);
// // app.use(Contact);

// // app.use("../uploads",express.static("uploads"));
// // app.use("",express.static("public")); 

// // store.sync();

// // app.listen(process.env.APP_PORT, ()=> {
// //     console.log('Server up and running...');
// // });
// // // app.listen();
// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv");
// const db = require("./config/Database.js");
// const SequelizeStore = require("connect-session-sequelize");
// const UserRoute = require("./routes/UserRoute.js");
// const CourseRoute = require("./routes/CourseRoute.js");
// const AuthRoute = require("./routes/AuthRoute.js");
// const StudentRoute = require("./routes/StudentRoute.js");
// const EnrollRoute = require("./routes/EnrollRoute.js");
// const PaymentRoute = require("./routes/PaymentRoute.js");
// const associateModels = require('./models/association.js');
// const ContactUs = require("./models/ContactModel.js");
// const Contact = require("./routes/Contact.js");
// const EmailRoute = require("./routes/EmailRoute.js"); // New email route



// dotenv.config();

// const sessionStore = SequelizeStore(session.Store);

// const store = new sessionStore({
//     db: db
// });

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: false }));

// (async () => {
//     await db.sync();
// })();
// associateModels();

// // Session middleware
// app.use(session({
//     secret: process.env.SESS_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: store,
//     cookie: {
//         maxAge: 60 * 60 * 1000,
//         secure: 'auto'
//     }
// }));

// // CORS middleware
// app.use(cors({
//     credentials: true,
//     origin: 'http://localhost:3000'
// }));

// // Serve static files
// app.use(express.static("public"));

// // Routes
// app.use("/uploads", express.static("uploads")); // Serve uploads directory
// app.use(UserRoute);
// app.use(CourseRoute);
// app.use(AuthRoute);
// app.use(StudentRoute);
// app.use(EnrollRoute);
// app.use(PaymentRoute);
// app.use(Contact);
// app.use(EmailRoute); // Use the new email route


// // Fallback route to serve index.html
// app.get("*", (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

// // Sync session store and start the server
// store.sync().then(() => {
//     const PORT = process.env.APP_PORT || 3000;
//     app.listen(PORT, () => {
//         console.log(`Server up and running on port ${PORT}`);
//     });
// });
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("./config/Database.js");
const SequelizeStore = require("connect-session-sequelize");
const UserRoute = require("./routes/UserRoute.js");
const CourseRoute = require("./routes/CourseRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
const StudentRoute = require("./routes/StudentRoute.js");
const EnrollRoute = require("./routes/EnrollRoute.js");
const PaymentRoute = require("./routes/PaymentRoute.js");
const Contact = require("./routes/Contact.js");
const EmailRoute = require("./routes/EmailRoute.js");
 const BlogRoutes = require("./routes/blogRoutes.js");
const associateModels = require('./models/association.js');
const Fees = require('./models/Fees.js'); // Add Fees model
const Blog= require('./models/blog.js');
const amountRoutes = require('./routes/AmountRoutes.js');
const expensesRoutes = require('./routes/ExpensesRoutes.js');
const dueDateRoutes = require('./routes/DueDateRoute.js'); 

dotenv.config();
require('dotenv').config();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Increase limit for JSON body
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for JSON body
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Increase limit for URL-encoded body
app.use(cookieParser());
// await sequelize.sync({ force: false }); // `force: true` drops the table if it already exists

(async () => {
    // await db.sync({   alter: true });
})();
store.sync();

associateModels();

// Session middleware
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 3* 60 * 60 * 1000,
        secure: 'auto'
    }
}));

// CORS middleware
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

// Serve static files
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// Routes
 // Serve uploads directory
app.use(UserRoute);
app.use(CourseRoute);
app.use(AuthRoute);
app.use(StudentRoute);
app.use(EnrollRoute);
app.use(PaymentRoute);
app.use(Contact);
app.use(EmailRoute); // Use the new email route
app.use(BlogRoutes);
app.use('/amount', amountRoutes);
app.use('/expenses', expensesRoutes);
app.use(dueDateRoutes);

// Fallback route to serve index.html
// app.get("*", (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

app.get('/data', (req, res) => {
    const dummyData = {
        id: 1,
        name: 'John Doe',
        role: 'Software Developer',
        company: 'Tech Corp'
    };

    res.json(dummyData);
});

app.get('/', (req, res) => {
    res.send("from server side");
});

// Sync session store and start the server
// store.sync().then(() => {
//     const PORT = process.env.APP_PORT || 3000;
//     app.listen(PORT, () => {
//         console.log(`Server up and running on port ${PORT}`);
//     });
// });

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});
