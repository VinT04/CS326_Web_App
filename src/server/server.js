import express from "express";
import open from "open";
import * as db from "./db.js";


const headerFields = { "Content-Type": "application/json" };
const app = express();
const port = 3260;
app.use(express.static("src/client"));
app.use(express.json());


const MethodNotAllowedHandler = async (request, response) => {
    response.writeHead(405, { "Content-Type": "text/plain" });
    response.end("Method Not Allowed"); 
  };  

async function getData(response, name) {
    try {
        const data = await db.loadData(name);
        response.writeHead(200, headerFields);
        response.write(JSON.stringify(data));
        response.end();
    } catch (err) {
        response.writeHead(500, headerFields);
        response.write("Error with retrieving data");
        response.end();
    }
}

async function saveData(response, name, value) {
    try {
        await db.saveData(name, value);
        response.writeHead(200, headerFields);
        response.write(JSON.stringify("Successfully saved data"));
        response.end();
    } catch (err) {
        response.writeHead(500, headerFields);
        response.write("Error with saving data");
        response.end();
    }
}

async function updateData(response, name, value) {
    try {
        const data = await db.loadData(name);
        data.value = value;
        await db.modifyData(data);
        response.writeHead(200, headerFields);
        response.write(JSON.stringify("Successfully modified data"));
        response.end();
    } catch (err) {
        response.writeHead(500, headerFields);
        response.write("Error with modifying data");
        response.end();
    }
}

async function deleteData(response, name) {
    try {
        await db.removeData(name);
        response.writeHead(200, headerFields);
        response.write(JSON.stringify("Successfully deleted data"));
        response.end();
    } catch (err) {
        response.writeHead(500, headerFields);
        response.write("Error with deleting data");
        response.end();
    }
}

async function getAllData(response) {
    try {
        const data = await db.loadAllData();
        response.writeHead(200, headerFields);
        response.write(JSON.stringify(data));
        response.end();
    } catch (err) {
        response.writeHead(500, headerFields);
        response.write("Error with retrieving all data");
        response.end();
    }
}

app.route("/getData").get(async (req, resp) => {
    const name = req.query.name;
    await getData(resp, name);
}).all(MethodNotAllowedHandler);

app.route("/saveData").post(async (req, resp) => {
    const name = req.body.name;
    const val = req.body.value;
    await saveData(resp, name, val);
}).all(MethodNotAllowedHandler);

app.route("/updateData").put(async (req, resp) => {
    const name = req.body.name;
    const val = req.body.value;
    await updateData(resp, name, val);
}).all(MethodNotAllowedHandler);

app.route("/deleteData").delete(async (req, resp) => {
    const name = req.body.name;
    await deleteData(resp, name);
}).all(MethodNotAllowedHandler);

app.route("/getAll").get(async (req, resp) => {
    await getAllData(resp);
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    open("http://localhost:3260");
});
