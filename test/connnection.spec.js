import { MongoClient } from "mongodb"

describe("MongoClient", () => {
  test("Client initialized with URI", async () => {
    let testClient
    try {
      testClient = await MongoClient.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
      })
      
      expect(testClient).not.toBeNull()

      const clientOptions = testClient.s.options
      expect(clientOptions).not.toBeUndefined()
    } catch (e) {
      expect(e).toBeNull()
    } finally {
      testClient.close()
    }
  })
})
