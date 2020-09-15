const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const mongodb = require("mongodb")
const weatherRouter = require("./routes/weather")
const userRouter = require("./routes/users")
const usersDAO = require("./dao/usersDAO")
const weatherDAO = require("./dao/weatherDAO")
const morgan = require("morgan")
const bodyParser = require("body-parser")

require("dotenv").config("")

let app_port = process.env.PORT || 4500
const MongoClient = mongodb.MongoClient

const app = express()
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}
app.use(bodyParser.json())

app.use(helmet())
app.use(cors())
app.use("/api/v1/weather", weatherRouter)
app.use("/api/v1/user", userRouter)

MongoClient.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  wtimeout: 50,
})
  .catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async (client) => {
    console.log("Database Connected...")
    await weatherDAO.injectDB(client)
    await usersDAO.injectDB(client)

    app.listen(app_port, () => {
      console.log(`starting app on port ${app_port}`)
    })
  })
