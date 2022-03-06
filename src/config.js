import { config } from "dotenv"
config()

export default {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    SECRET: process.env.SECRET
}