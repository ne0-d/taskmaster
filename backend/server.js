import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import UserRoute from "./UserRoute.js"

//Routes
const app = express();

//to serve images for public
app.use(express.static("public"));
app.use("/images", express.static("images"));

//Middlewre
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
dotenv.config();

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    // console.log("DB connected successfully")
    app.listen(process.env.PORT, () =>
      console.log(`Listening at port ${process.env.PORT}`)
    );
  })
  .catch((error) => console.log(error));

//usage routes
app.use("/user", UserRoute)