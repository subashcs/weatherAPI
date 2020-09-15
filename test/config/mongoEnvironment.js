const MongoClient = require("mongodb").MongoClient
const NodeEnvironment = require("jest-environment-node")

module.exports = class MongoEnvironment extends NodeEnvironment {
  async setup() {
    if (!this.global.dbClient) {
      this.global.dbClient = await MongoClient.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      await super.setup()
    }
  }

  async teardown() {
    await this.global.dbClient.close()
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}
