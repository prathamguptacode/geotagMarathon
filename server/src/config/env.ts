import 'dotenv/config'
import * as z from 'zod'


const EnvSchema = z.object({
    PORT: z.coerce.number().int().min(1000).default(8080),
    MONGO_URI: z.string(),
    CLIENT_URL: z.string(),
    CLOUDINARY_URL: z.string(),
})

const parsedData = EnvSchema.safeParse(process.env)

if (!parsedData.success) {
    console.error("Environment varaibles are missing/invalid, exiting now...", parsedData.error)
    process.exit(1)
}

const env = parsedData.data

export default env
