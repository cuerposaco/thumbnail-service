const { DB_HOST, DB_PORT, DB_NAME } = process.env;

export const MONGO_URI = `${DB_HOST}:${DB_PORT}/${DB_NAME}`;
export const connectionOptions = {};
