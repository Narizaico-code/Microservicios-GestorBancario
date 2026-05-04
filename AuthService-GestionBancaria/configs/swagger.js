import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.3",
    info: {
        title: "AuthService Gestor Bancario API",
        version: "1.0.0",
        description: "Documentación del Microservicio de Autenticación, Registro y Perfiles."
    },
    servers: [
        {
            url: "http://localhost:3005/api/v1",
            description: "Servidor AuthService local"
        }
    ],
    tags: [
        {
            name: "Authentication",
            description: "Endpoints para el inicio de sesión y recuperación"
        },
        {
            name: "Registration (Admin)",
            description: "Flujos de registro directo y aprobaciones por Administrador"
        },
        {
            name: "Registration (Public)",
            description: "Flujos de solicitudes de registro públicas"
        },
        {
            name: "Profile",
            description: "Endpoints de perfil de usuario"
        }
    ],
    paths: {
        "/auth/login": {
            post: {
                tags: ["Authentication"],
                summary: "Autentica un usuario",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthLoginRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Login exitoso" },
                    "401": { description: "Credenciales inválidas" },
                    "423": { description: "Cuenta bloqueada temporalmente" }
                }
            }
        },
        "/auth/register": {
            post: {
                tags: ["Registration (Admin)"],
                summary: "Registra un usuario directamente (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                $ref: "#/components/schemas/AuthRegisterRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Usuario registrado exitosamente" },
                    "400": { description: "Errores de validación" },
                    "403": { description: "No autorizado" },
                    "409": { description: "Email ya existe" }
                }
            }
        },
        "/auth/signup-request": {
            post: {
                tags: ["Registration (Public)"],
                summary: "Crea una solicitud de registro pública (Suceptible a aprobación)",
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                $ref: "#/components/schemas/AuthRegisterRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Solicitud creada exitosamente, en espera de aprobación" },
                    "400": { description: "Errores de validación" },
                    "409": { description: "Email ya existe o ya hay solicitud pendiente" }
                }
            }
        },
        "/auth/signup-requests": {
            get: {
                tags: ["Registration (Admin)"],
                summary: "Listar todas las solicitudes de registro pendientes",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Lista de solicitudes" },
                    "403": { description: "No autorizado" }
                }
            }
        },
        "/auth/signup-requests/{id}/approve": {
            post: {
                tags: ["Registration (Admin)"],
                summary: "Aprobar una solicitud de registro",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Solicitud aprobada y usuario creado" },
                    "403": { description: "No autorizado" },
                    "404": { description: "Solicitud no encontrada" }
                }
            }
        },
        "/auth/signup-requests/{id}/reject": {
            post: {
                tags: ["Registration (Admin)"],
                summary: "Rechazar una solicitud de registro",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Solicitud rechazada" },
                    "403": { description: "No autorizado" },
                    "404": { description: "Solicitud no encontrada" }
                }
            }
        },
        "/auth/verify-email": {
            post: {
                tags: ["Authentication"],
                summary: "Verifica el correo electrónico de la cuenta (token de URL)",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthTokenRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Email verificado" },
                    "400": { description: "Token inválido o expirado" }
                }
            }
        },
        "/auth/forgot-password": {
            post: {
                tags: ["Authentication"],
                summary: "Inicia el flujo de recuperación de contraseña",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthEmailRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Instrucciones enviadas" },
                    "404": { description: "Usuario no encontrado" }
                }
            }
        },
        "/auth/reset-password": {
            post: {
                tags: ["Authentication"],
                summary: "Cambia la contraseña utilizando el token de recuperación",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthResetPasswordRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Contraseña restablecida" },
                    "400": { description: "Token inválido o expirado" }
                }
            }
        },
        "/auth/profile": {
            get: {
                tags: ["Profile"],
                summary: "Obtiene el perfil del usuario autenticado (Token JWT)",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Perfil del usuario" },
                    "401": { description: "Token inválido o no provisto" }
                }
            }
        },
        "/users/me": {
            patch: {
                tags: ["Profile"],
                summary: "Solicita una actualización de perfil",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        "multipart/form-data": {
                            schema: {
                                $ref: "#/components/schemas/UserProfileUpdateRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Solicitud de actualización registrada" },
                    "401": { description: "No autorizado" }
                }
            }
        },
        "/users/update-requests": {
            get: {
                tags: ["Registration (Admin)"],
                summary: "Lista las solicitudes de actualización de perfil",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] } }
                ],
                responses: {
                    "200": { description: "Lista de peticiones" }
                }
            }
        },
        "/users/{id}/role": {
            put: {
                tags: ["Registration (Admin)"],
                summary: "Cambia el rol de un usuario existente",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    roleName: { type: "string", example: "ADMIN_ROLE" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Rol actualizado" }
                }
            }
        }
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            AuthRegisterRequest: {
                type: "object",
                required: ["name", "email", "password", "phone"],
                properties: {
                    name: { type: "string", example: "Juan Perez" },
                    email: { type: "string", format: "email", example: "juan@email.com" },
                    password: { type: "string", minLength: 8, example: "S3gura123!" },
                    phone: { type: "string", example: "12345678" },
                    profilePicture: { type: "string", format: "binary", description: "Formatos permitidos: jpg, jpeg, png, webp, jfif" }
                }
            },
            AuthLoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "juan@email.com" },
                    password: { type: "string", example: "S3gura123!" }
                }
            },
            AuthTokenRequest: {
                type: "object",
                required: ["token"],
                properties: {
                    token: { type: "string", example: "token_verificacion" }
                }
            },
            AuthEmailRequest: {
                type: "object",
                required: ["email"],
                properties: {
                    email: { type: "string", format: "email", example: "juan@email.com" }
                }
            },
            AuthResetPasswordRequest: {
                type: "object",
                required: ["token", "newPassword"],
                properties: {
                    token: { type: "string", example: "token_reset" },
                    newPassword: { type: "string", minLength: 8, example: "NuevaClave123!" }
                }
            },
            UserProfileUpdateRequest: {
                type: "object",
                properties: {
                    name: { type: "string", example: "Juan M." },
                    email: { type: "string", example: "nuevo@email.com" },
                    phone: { type: "string", example: "87654321" },
                    profilePicture: { type: "string", format: "binary" }
                }
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};

const options = {
    definition: swaggerDefinition,
    apis: ["./src/**/*.routes.js"]
};

export default swaggerJSDoc(options);