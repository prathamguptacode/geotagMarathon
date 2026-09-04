import express from "express"
import env from "./config/env"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongoConnect"
import errorHandler from "./middlewares/errorHandler"
import responseHandler from "./middlewares/responseHandler"

await connectDB()

const app = express();

app.use(express.json())
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}))
app.use(cookieParser())
app.use(responseHandler)


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
