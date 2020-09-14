let reports;

class weatherDAO {
  static async injectDB(conn) {
    if (reports) {
      return;
    }
    try {
      reports = await conn.db(process.env.DB_NAME).collection("reports");
    } catch (e) {
      console.error(`Unable to establish connection : ${e}`);
    }
  }
  static async getWeather() {
    try {
      return await reports.findOne({ name: "Hong Kong" });
    } catch (e) {
      console.error(`Unable to get report: ${e}`);
      return { error: e };
    }
  }

  static async updateWeather(report) {
    try {
      if (!report) {
        throw "Error: Empty object";
      }

      let reportDoc = report;

      reportDoc._id = report.id;
      let result = await reports.findOneAndUpdate(
        { _id: reportDoc.id },
        { $set: reportDoc },
        {
          upsert: true,
          returnOriginal: false,
        }
      );
      let updatedWeather = result.value;
      if (result) {
        return updatedWeather;
      } else {
        throw new Error(`Could not parse data`);
      }
    } catch (e) {
      console.error(`Unable to update report: ${e}`);
      throw new Error(`Unable to update report ${e}`);
    }
  }
}

module.exports = weatherDAO;
