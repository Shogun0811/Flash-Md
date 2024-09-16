const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQUQ3YWNMSlJvRkJ1WDZTT280SHRCaEY4MzJnNUdKWEZicTRnSlJ0aFUyTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRXpvVW9EelhBcFBwTmc3SXl3a0VXaEk0TjhIT3Z3OGx6WUptWHc0NHZSdz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLSmtmQzR2Vmt3aDJtTlhWZ052YTZGTmZFWTZZZ1lXRUhPWU5FWnoyYkZNPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJwRTJnNUdyNUFXb2pYd0NOLzV3S2w5TFdGYUdDMkE1eE8zVEFIbEE4dlFBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNCNXVLZFEwTVlXck9URUdhUnFCMVFCamtnNTdGSUhEejV1em1CUW5zVnc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNXN3RQWXZ3a0o3TXpVMnVkWmZtMU5sWDJDZmhGcDV1Vm5mcTIvbk85Mk09In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidU1Ub2V3TzNNak5KT3lUdEZjdXh1OWFLRlh0bWtIeDdOU1V4c2U0UG9tcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUVcvWlFOUUFLbGNzenpRczFzNzBUK09NV01OYjlZUTNtK2hScVB4bkMzRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InhGNzNGaDA1YjdlZWd6cGJQMHRTY3N5eEtPekQ2ZGdnazJwQjZDNUhTQ2FjSlJRVVEybGk1UnRNN2NXZkdvU3dMelp1UUw4eG8yZTB2Q2tISUJFNmp3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTk0LCJhZHZTZWNyZXRLZXkiOiJCdldFbVlhZ0psdkVqT1o2OW1tbTNXUnhxRDBYbXBVOVdIWGxiYnF4bDE4PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJQRDFHVzhzYVJ0ZXExakd4YnBvempBIiwicGhvbmVJZCI6IjI5MzE2ZjU3LWRlNDktNGQxMC1iNDNiLWMwNDgwNzA5NDIwNiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrVW9jSGhLNGZjbThBQ2lKakpSK0tGOFhWamM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWGJBWHVsdDhmNnU2RVViNERKY3VSMFI4N3RJPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ik05NUZRVEg4IiwibWUiOnsiaWQiOiIyMjE3NjAyNjM2MzE6NjZAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoi44OT44O844Kz44Oe44OrLvCdmbHwnZqS8J2ajPCdmpjwnZqW8J2aivCdmpvwnZqeLvCdmoLwnZqR8J2amPCdmpDwnZqe8J2al/CdmorEqyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTjdmdHlVUXE1dWd0d1lZQVNBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoidUNvUm1MakNwdVVacy9lWFkzWHp2NG5tWHdSWE1jQ1NkRWZnOEtoL2RUUT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiYUNaYTllcC9LMko2RHVENVYxUXdGK1E0Z1MzVUY4d3FDemh4cnIzbG1NcHlEaWcvYXJsQlZOcmZxanlUeFhEdUFQei9ZRFQ0ajNsM21yTjg4eEwvQlE9PSIsImRldmljZVNpZ25hdHVyZSI6Ik1YRW1RNHY1cEtLNUQveHkzVjNWQ3BXYVJQOVlUQUk4NEU0eWdCTGFPSHJteVphQ0lxQXJoYUE5MzdQUk05cEdSNW93d0FITzNQWXFmYlBmUk9HTWd3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjIxNzYwMjYzNjMxOjY2QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmJncUVaaTR3cWJsR2JQM2wyTjE4NytKNWw4RVZ6SEFrblJINFBDb2YzVTAifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjY0ODM4OTcsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQjQyIn0=',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "France King",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254105915061",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
