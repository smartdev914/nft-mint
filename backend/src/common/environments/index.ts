import * as dotenv from 'dotenv';
dotenv.config();

const APP_NAME = process.env.APP_NAME || '';
const APP_PORT = process.env.APP_PORT || 3001;
const APP_URL = process.env.APP_URL || '';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

export { APP_NAME, APP_PORT, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, APP_URL };
