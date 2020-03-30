import config from "../config"

export default {
    BACKEND_ADDR: config.BACKEND_ADDR || process.env.BACKEND_ADDR || 'localhost:3500',
    OAUTH_ADDR: config.OAUTH_ADDR || process.env.OAUTH_ADDR || 'localhost:3000'
}