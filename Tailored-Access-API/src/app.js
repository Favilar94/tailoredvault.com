import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
import filesRoutes from "./routes/files.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
const path = require("path");
const app = express();

//Settings
app.set("pkg", pkg);
app.set("port", 3001);

app.set("views", path.join(__dirname, "views")); //Only to debug
app.set("view engine", "ejs"); //Only to debug

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());   


//Routes
app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});

app.get("/apifoto", (req, res) => { //Only to debug
  res.render("fileform"); //Only to debug
}); //Only to debug

app.get("/userform", (req, res) => { //Only to debug
  res.render("userform"); //Only to debug
}); //Only to debug

app.get("/signin", (req, res) => { //Only to debug
  res.render("signin"); //Only to debug
}); //Only to debug

app.use("/api/files", filesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

userRoutes

//Static files
app.use(express.static(path.join(__dirname, "public")));

export default app;
