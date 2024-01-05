import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateLecturerRequest:
 *      type: object
 *      properties:
 *        uuid:
 *          type: string
 *          format: uuid
 *          description: UUID lektora
 *          readOnly: true
 *          nullable: false
 *          example: 67fda282-2bca-41ef-9caf-039cc5c8dd69
 *        title_before:
 *          type: string
 *          description: Titul před jménem
 *          nullable: true
 *          example: Mgr.
 *        first_name:
 *          type: string
 *          description: Křestní jméno
 *          nullable: false
 *          example: Petra
 *        middle_name:
 *          type: string
 *          description: Střední jména
 *          nullable: true
 *          example: Swil
 *        last_name:
 *          type: string
 *          description: Příjmení
 *          nullable: false
 *          example: Plachá
 *        title_after:
 *          type: string
 *          description: Titul za jménem
 *          nullable: true
 *          example: MBA
 *        picture_url:
 *          type: string
 *          format: url
 *          description: URL obrázku
 *          nullable: true
 *          example: https://picsum.photos/200
 *        location:
 *          type: string
 *          format: address
 *          description: Lokalita, kde daný lektor působí
 *          nullable: true
 *          example: Brno
 *        claim:
 *          type: string
 *          description: Osobní citát
 *          nullable: true
 *          example: Bez dobré prezentace je i nejlepší myšlenka k ničemu.
 *        bio:
 *          type: string
 *          description: Životopis lektora
 *          nullable: true
 *          example: "<b>Formátovaný text</b> s <i>bezpečnými</i> tagy."
 *        tags:
 *          type: array
 *          items:
 *            "$ref": "#/components/schemas/Tag"
 *          uniqueItems: true
 *          description: Seznam tagů daného lektora
 *          nullable: false
 *          minItems: 0
 *        price_per_hour:
 *          type: integer
 *          minimum: 0
 *          description: Cena (v celých korunách) za hodinu práce
 *          exclusiveMinimum: false
 *          nullable: true
 *          example: 720
 *        contact:
 *          "$ref": "#/components/schemas/Contact_info"
 *      required:
 *      - first_name
 *      - last_name
 *    CreateLecturerResponse:
 *      type: object
 *      properties:
 *        uuid:
 *          type: string
 *        title_before:
 *          type: string
 *        first_name:
 *          type: string
 *        middle_name:
 *          type: string
 *        last_name:
 *          type: string
 *        title_after:
 *          type: string 
 *    GetLecturerResponse:
 *      type: array
 *      items:
 *        type: object
 *        required:
 *          - uuid
 *          - first_name
 *          - middle_name
 *          - last_name
 *        properties:
 *          uuid:
 *            type: string
 *          title_before:
 *            type: string
 *          first_name:
 *            type: string
 *          middle_name:
 *            type: string
 *          last_name:
 *            type: string
 *          title_after:
 *            type: string
 *          picture_url:
 *            type: string
 *          location:
 *            type: string
 *          claim:
 *            type: string
 *          bio:
 *            type: string
 *          tags:
 *            type: array
 *            items:
 *              "$ref": "#/components/schemas/Tag"
 *          price_per_hour:
 *            type: integer
 *          contact:
 *            "$ref": "#/components/schemas/Contact_info"
 *                
 */

export const createLecturerSchema = object ({
  body: object({
      first_name: string({
        required_error: "First name is required",
      }),
      last_name: string({
        required_error: "Last name is required",
      })
  }),
});

export type CreateUserInput = 
  TypeOf<typeof createLecturerSchema>;



