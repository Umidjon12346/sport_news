const express = require('express');
const config = require('config');
const mainRoute = require("./routes/index.routes")
const cookieParser = require("cookie-parser");

const PORT = config.get("port") || 3004

const app = express()
app.use(cookieParser()); 

app.use(express.json())
app.use("/api",mainRoute)


async function start() {
    try {
        app.listen(PORT,()=>{
            console.log(`Server http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()