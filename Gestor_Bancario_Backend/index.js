"use strict";

import "dotenv/config";
import app from "./configs/app.js";
import { dbConnection } from "./configs/db.js";
import { startPromotionStatusCron } from "./helpers/promotion-status-cron.js";

const PORT = process.env.PORT || 3000;

await dbConnection();

// Iniciar cron job de mantenimiento de estados después de la conexión a MongoDB
startPromotionStatusCron();

app.listen(PORT, () => {
	console.log(`API escuchando en puerto ${PORT}`);
});
