import express from "express";


const headerFields = { "Content-Type": "text/html" };
const app = express();
const port = 3260;
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/client"));