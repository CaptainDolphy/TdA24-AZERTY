import { Express, Request, Response} from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "./package.json"  

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.2",
        info: {
            title: "REST API Docs",
            version,
        },
        
    },
    apis: ['./src/routes.ts'],

};

const swaggerSpec = swaggerJsDoc(options)

function swaggerDocs(app: Express, port: number) {
    // Swagger page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    // Docs in JSON format
    app.get('docs.json', (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`Docs available at http://localhost:${port}/docs`);

}

export default swaggerDocs;