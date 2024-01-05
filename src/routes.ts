import { Express } from "express";
import { createLecturerSchema,} from "./schema/lecturer-schema";

import path = require("path");


import validateResource from "./middleware/validateResource";



function routes(app: Express): void {
    /**
     * @openapi
     * '/lecturers':
     *  post:
     *      tags:
     *      - Lecturer
     *      summary: Vytvoří nový záznam lektora
     *      description: 'Nápověda: Vede na jednoduchý INSERT statement do DB'
     *      responses:
     *        '200':
     *            content:
     *                application/json:
     *                  schema:
     *                    "$ref": "#/components/schemas/CreateLecturerResponse"
     *            description: Záznam lektora úspěšně vytvořen (rovněž vytvořeny nové tagy, pokud ještě neexistovaly
     *      requestBody:
     *         required: true
     *         description: Data lektora k zanesení do jeho záznamu.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/CreateLecturerRequest"  
     *  get:
     *      tags:
     *      - Lecturer
     *      summary: Získání všech záznamů všech lektorů
     *      description: 'Nápověda: SELECT *'
     *      responses:
     *        '200':
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  "$ref": "#/components/schemas/GetLecturerResponse"
     *                nullable: false
     *                minItems: 0
     *          description: Všechny záznamy lektorů
     */

     
    app.post("/lecturers", validateResource(createLecturerSchema));
    
    app.get("/lecturers");
        
    /**
     * @openapi
     * "/lecturers/{uuid}":
     *  parameters:
     *    in: path
     *    name: uuid
     *    required: true
     *    schema:
     *      type: string
     *      format: uuid
     *  get:
     *    summary: Dle ID najde lektora a vrátí jeho údaje.
     *    description: 'Nápověda: Jedná se o jednoduchý dotaz na DB, nalézt řádek, který odpovídá
     *      danému PK. Pokud žádný nebude nalezen, vrátí 404.'
     *    responses:
     *      '200':
     *        content:
     *          application/json:
     *            schema:
     *              "$ref": "#/components/schemas/Lecturer"
     *        description: Nalezený záznam
     *      '404':
     *        "$ref": "#/components/responses/NotFound"
     *     
     */


    app.get("/lecturers/:uuid");

    app.get("/lecturer", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "public", "home.html"));
    });
    
}

export default routes;