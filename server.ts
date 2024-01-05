import express from "express";
import config from "config";
import swaggerDocs from "./swagger";
import routes from "./src/routes";
import connect  from "./utils/connect";

import cors from 'cors';


const port = config.get<number>("port");

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));


app.use(express.static("public"));


app.listen(port, async () => {
    console.log(`App is running at https://localhost:${port}`);

    connect();

    routes(app);

    swaggerDocs(app, port);
});
