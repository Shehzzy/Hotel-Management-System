const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./utils/connection");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const authRouter = require("./Routes/auth-router");
const roomRouter = require("./Routes/auth-router");
const bookingRouter = require("./Routes/booking-router");

app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/booking", bookingRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
