const weatherDAO = require("../dao/weatherDAO")

describe("Connection", () => {
  beforeAll(async () => {
    await weatherDAO.injectDB(global.dbClient)
  })

  test("Can access weather data", async () => {
    console.log(global.dbClient)
    const mflix = global.dbClient.db(process.env.MONGO_URL)
    const collections = await mflix.listCollections().toArray()
    const collectionNames = collections.map((elem) => elem.name)
    expect(collectionNames).toContain("weather")
    expect(collectionNames).toContain("users")
  })
})
