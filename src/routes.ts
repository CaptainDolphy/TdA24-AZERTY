import { Express } from "express";
import { createLecturerSchema,} from "./schema/lecturer-schema";


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
     *                    "$ref": "#/components/schemas/CreateLecturerRequest"
     *            description: Záznam lektora úspěšně vytvořen (rovněž vytvořeny nové tagy, pokud ještě neexistovaly
     *      requestBody:
     *         required: true
     *         description: Data lektora k zanesení do jeho záznamu.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/CreateLecturerRequest"  
     */
    app.post("/lecturers", validateResource(createLecturerSchema));
    
}

export default routes;