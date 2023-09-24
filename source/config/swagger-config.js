import swaggerJSDoc from "swagger-jsdoc";
import { sourceDirname } from "./dirname-config.js";

const swaggerOptions = {
	definition: {
		openapi: "3.0.1",
		info: {
			title: "Documentation of the Alejandro Sanz's E-commerce",
			description: "This is an e-commerce website for an educational project in CoderHouse",
		},
	},
	apis: [`${sourceDirname}/docs/**/*.yaml`],
};

export const specs = swaggerJSDoc(swaggerOptions);


