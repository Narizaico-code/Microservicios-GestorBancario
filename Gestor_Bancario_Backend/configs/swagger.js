import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.3",
    info: {
        title: "Gestor Bancario API Completa",
        version: "1.0.0",
        description: "Documentación de la API principal para gestión de cuentas, transacciones y favoritos."
    },
    servers: [
        {
            url: "http://localhost:3006/gestionBancaria/api/v1",
            description: "Servidor Gestor Bancario local"
        }
    ],
    tags: [
        {
            name: "Accounts",
            description: "Gestión de cuentas bancarias"
        },
        {
            name: "Transactions",
            description: "Operaciones de depósitos, retiros y transferencias"
        },
        {
            name: "Favorites",
            description: "Cuentas favoritas de los usuarios"
        },
        {
            name: "Services",
            description: "Catalogo de productos y servicios exclusivos"
        },
        {
            name: "Promotions",
            description: "Promociones globales exclusivas"
        }
    ],
    paths: {
        "/account/create": {
            post: {
                tags: ["Accounts"],
                summary: "Crea una nueva cuenta bancaria (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                $ref: "#/components/schemas/AccountCreateRequest"
                            }
                        },
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AccountCreateRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Cuenta creada exitosamente" },
                    "400": { description: "Datos inválidos" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            }
        },
        "/account/get": {
            get: {
                tags: ["Accounts"],
                summary: "Obtiene una lista de cuentas (Paginada)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
                    { name: "misCuentas", in: "query", description: "Si es true, solo devuelve las cuentas del usuario logueado", schema: { type: "boolean" } }
                ],
                responses: {
                    "200": { description: "Lista de cuentas obtenida exitosamente" }
                }
            }
        },
        "/transactions/create": {
            post: {
                tags: ["Transactions"],
                summary: "Realiza una nueva transacción",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                $ref: "#/components/schemas/TransactionCreateRequest"
                            }
                        },
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TransactionCreateRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Transacción creada exitosamente" },
                    "400": { description: "Fondos insuficientes o límite excedido" },
                    "403": { description: "No autorizado o intento de depósito sin ser Admin" },
                    "404": { description: "Cuenta origen o destino no encontrada" }
                }
            }
        },
        "/transactions/get": {
            get: {
                tags: ["Transactions"],
                summary: "Listar transacciones del usuario",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
                ],
                responses: {
                    "200": { description: "Transacciones obtenidas" }
                }
            }
        },
        "/transactions/get/{id}": {
            get: {
                tags: ["Transactions"],
                summary: "Buscar transacción por ID (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Transacción obtenida" },
                    "403": { description: "No autorizado" },
                    "404": { description: "No encontrada" }
                }
            }
        },
        "/transactions/update/{id}": {
            put: {
                tags: ["Transactions"],
                summary: "Actualizar o Cancelar Transacción (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    content: {
                        "multipart/form-data": {
                            schema: {
                                $ref: "#/components/schemas/TransactionUpdateRequest"
                            }
                        },
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TransactionUpdateRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Actualizada o cancelada correctamente" },
                    "400": { description: "Fuera de límite de tiempo para cancelar (1 minuto)" }
                }
            }
        },
        "/favorites": {
            post: {
                tags: ["Favorites"],
                summary: "Agregar una cuenta a favoritos",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FavoriteCreateRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Favorito agregado" },
                    "409": { description: "Ya existe en favoritos" }
                }
            },
            get: {
                tags: ["Favorites"],
                summary: "Obtener lista de favoritos del usuario",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Lista obtenida" }
                }
            }
        },
        "/favorites/{id}": {
            delete: {
                tags: ["Favorites"],
                summary: "Eliminar una cuenta de favoritos",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Eliminado correctamente" }
                }
            }
        },
        "/favorites/{id}/transfer": {
            post: {
                tags: ["Favorites"],
                summary: "Preparar transferencia rápida a un favorito",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FavoriteTransferRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Transferencia rápida preparada" }
                }
            }
        },
        "/services": {
            post: {
                tags: ["Services"],
                summary: "Crea un producto o servicio (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ServiceCreateRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Servicio creado" },
                    "400": { description: "Datos inválidos" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            },
            get: {
                tags: ["Services"],
                summary: "Lista productos y servicios",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "type", in: "query", schema: { type: "string", enum: ["PRODUCT", "SERVICE"] } },
                    { name: "category", in: "query", schema: { type: "string" } },
                    { name: "active", in: "query", schema: { type: "boolean" } },
                    { name: "q", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Lista de servicios" }
                }
            }
        },
        "/services/{id}": {
            get: {
                tags: ["Services"],
                summary: "Obtiene un servicio por ID",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Servicio encontrado" },
                    "404": { description: "No encontrado" }
                }
            },
            put: {
                tags: ["Services"],
                summary: "Actualiza un producto o servicio (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ServiceUpdateRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Servicio actualizado" },
                    "400": { description: "Datos inválidos" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            },
            delete: {
                tags: ["Services"],
                summary: "Elimina un producto o servicio (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Servicio eliminado" },
                    "403": { description: "No autorizado (Requiere Admin)" },
                    "404": { description: "No encontrado" }
                }
            }
        },
        "/promotions": {
            post: {
                tags: ["Promotions"],
                summary: "Crea una promocion global (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PromotionCreateRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Promocion creada" },
                    "400": { description: "Datos inválidos" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            },
            get: {
                tags: ["Promotions"],
                summary: "Lista promociones",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "active", in: "query", schema: { type: "boolean" } },
                    { name: "q", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Lista de promociones" }
                }
            }
        },
        "/promotions/{id}": {
            get: {
                tags: ["Promotions"],
                summary: "Obtiene una promocion por ID",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Promocion encontrada" },
                    "404": { description: "No encontrada" }
                }
            },
            put: {
                tags: ["Promotions"],
                summary: "Actualiza una promocion (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PromotionUpdateRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Promocion actualizada" },
                    "400": { description: "Datos inválidos" },
                    "403": { description: "No autorizado (Requiere Admin)" }
                }
            },
            delete: {
                tags: ["Promotions"],
                summary: "Elimina una promocion (Requiere Rol Admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Promocion eliminada" },
                    "403": { description: "No autorizado (Requiere Admin)" },
                    "404": { description: "No encontrada" }
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
            AccountCreateRequest: {
                type: "object",
                required: ["userId", "tipoCuenta", "saldo", "moneda"],
                properties: {
                    userId: {
                        type: "string",
                        example: "ID_DEL_USUARIO"
                    },
                    tipoCuenta: {
                        type: "string",
                        example: "AHORRO",
                        enum: ["AHORRO", "MONETARIA"]
                    },
                    saldo: {
                        type: "number",
                        example: 1500.75
                    },
                    moneda: {
                        type: "string",
                        example: "GTQ",
                        enum: ["GTQ", "USD", "EUR"]
                    }
                }
            },
            TransactionCreateRequest: {
                type: "object",
                required: ["tipoTransaccion", "monto", "moneda"],
                properties: {
                    tipoTransaccion: {
                        type: "string",
                        example: "TRANSFERENCIA",
                        enum: ["DEPOSITO", "TRANSFERENCIA", "RETIRO"]
                    },
                    monto: {
                        type: "number",
                        example: 250.5
                    },
                    moneda: {
                        type: "string",
                        example: "GTQ",
                        enum: ["GTQ", "USD", "EUR", "MXN", "COP", "JPY"]
                    },
                    cuentaOrigen: {
                        type: "string",
                        example: "8493012934",
                        description: "Número de cuenta de origen (10 dígitos)"
                    },
                    cuentaDestino: {
                        type: "string",
                        example: "1234567890",
                        description: "Número de cuenta de destino (10 dígitos)"
                    },
                    descripcion: {
                        type: "string",
                        example: "Pago de servicio"
                    }
                }
            },
            TransactionUpdateRequest: {
                type: "object",
                properties: {
                    estado: {
                        type: "string",
                        example: "CANCELADA",
                        enum: ["CANCELADA", "COMPLETADA"]
                    },
                    descripcion: {
                        type: "string",
                        example: "Cancelado por error"
                    },
                    monto: {
                        type: "number",
                        example: 300,
                        description: "Solo aplicable para modificar depósitos"
                    }
                }
            },
            FavoriteCreateRequest: {
                type: "object",
                required: ["cuenta", "tipo", "alias"],
                properties: {
                    cuenta: {
                        type: "string",
                        example: "1234567890"
                    },
                    tipo: {
                        type: "string",
                        example: "AHORRO"
                    },
                    alias: {
                        type: "string",
                        example: "Juan Perez"
                    }
                }
            },
            FavoriteTransferRequest: {
                type: "object",
                required: ["monto", "moneda"],
                properties: {
                    monto: {
                        type: "number",
                        example: 500
                    },
                    moneda: {
                        type: "string",
                        example: "GTQ"
                    },
                    descripcion: {
                        type: "string",
                        example: "Pago de cena"
                    }
                }
            },
            Discount: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: ["PERCENT", "AMOUNT"],
                        example: "PERCENT"
                    },
                    value: {
                        type: "number",
                        example: 10
                    },
                    startAt: {
                        type: "string",
                        format: "date-time"
                    },
                    endAt: {
                        type: "string",
                        format: "date-time"
                    },
                    minAmount: {
                        type: "number",
                        example: 100
                    },
                    maxUses: {
                        type: "number",
                        example: 50
                    },
                    terms: {
                        type: "string",
                        example: "Valido en sucursales participantes"
                    }
                }
            },
            ServiceCreateRequest: {
                type: "object",
                required: ["name", "description", "type", "price"],
                properties: {
                    name: {
                        type: "string",
                        example: "Corte de cabello premium"
                    },
                    description: {
                        type: "string",
                        example: "Servicio exclusivo para clientes"
                    },
                    category: {
                        type: "string",
                        example: "Belleza"
                    },
                    type: {
                        type: "string",
                        enum: ["PRODUCT", "SERVICE"],
                        example: "SERVICE"
                    },
                    price: {
                        type: "number",
                        example: 150
                    },
                    active: {
                        type: "boolean",
                        example: true
                    },
                    imageUrl: {
                        type: "string",
                        example: "https://example.com/servicio.jpg"
                    },
                    terms: {
                        type: "string",
                        example: "Sujeto a disponibilidad"
                    },
                    validFrom: {
                        type: "string",
                        format: "date-time"
                    },
                    validTo: {
                        type: "string",
                        format: "date-time"
                    },
                    discount: {
                        $ref: "#/components/schemas/Discount"
                    }
                }
            },
            ServiceUpdateRequest: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    description: {
                        type: "string"
                    },
                    category: {
                        type: "string"
                    },
                    type: {
                        type: "string",
                        enum: ["PRODUCT", "SERVICE"]
                    },
                    price: {
                        type: "number"
                    },
                    active: {
                        type: "boolean"
                    },
                    imageUrl: {
                        type: "string"
                    },
                    terms: {
                        type: "string"
                    },
                    validFrom: {
                        type: "string",
                        format: "date-time"
                    },
                    validTo: {
                        type: "string",
                        format: "date-time"
                    },
                    discount: {
                        $ref: "#/components/schemas/Discount"
                    }
                }
            },
            PromotionCreateRequest: {
                type: "object",
                required: ["name"],
                properties: {
                    name: {
                        type: "string",
                        example: "Semana del cliente"
                    },
                    description: {
                        type: "string",
                        example: "Beneficios exclusivos para clientes"
                    },
                    terms: {
                        type: "string",
                        example: "Aplican restricciones"
                    },
                    active: {
                        type: "boolean",
                        example: true
                    },
                    validFrom: {
                        type: "string",
                        format: "date-time"
                    },
                    validTo: {
                        type: "string",
                        format: "date-time"
                    },
                    imageUrl: {
                        type: "string",
                        example: "https://example.com/promo.jpg"
                    },
                    conditions: {
                        type: "object",
                        example: { "segment": "VIP" }
                    }
                }
            },
            PromotionUpdateRequest: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    description: {
                        type: "string"
                    },
                    terms: {
                        type: "string"
                    },
                    active: {
                        type: "boolean"
                    },
                    validFrom: {
                        type: "string",
                        format: "date-time"
                    },
                    validTo: {
                        type: "string",
                        format: "date-time"
                    },
                    imageUrl: {
                        type: "string"
                    },
                    conditions: {
                        type: "object"
                    }
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