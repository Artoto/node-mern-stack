const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectionDB = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");

dotenv.config();
app.use(express.json());
connectionDB();

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

// Use the cors middleware with the specified options
app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

const port = process.env.BASE_PORT ?? 5000;
app.listen(port, () => {
  console.log(`Server is running.....`);
});
