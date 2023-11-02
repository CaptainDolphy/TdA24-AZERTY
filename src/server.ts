import express from "express";
import config from "config";
import swaggerDocs from "../swagger";
import routes from "./routes";


const port = config.get<number>("port");

const app = express();

app.use(express.json());
 


app.listen(port, async () => {
    console.log(`App is running at https://localhost:${port}`);

    routes(app)

    swaggerDocs(app, port);
});