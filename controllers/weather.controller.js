const weatherDAO = require("../dao/weatherDAO");

const Bluebird = require("bluebird");
const fetch = require("node-fetch");

fetch.Promise = Bluebird;

async function fetchAPIData() {
  try {
    let latestWeather = await fetch(
      `${process.env.WEATHER_API}&APPID=${process.env.WEATHER_API_KEY}`,
      {
        method: "GET",
        "Cache-Control": "no-cache",
      }
    ).then((res) => res.json());

    if (latestWeather && !latestWeather.id) {
      return null;
    }
    return latestWeather;
  } catch (e) {
    console.log("could not send api request");

    return null;
  }
}
class WeatherController {
  async getWeather(req, res, next) {
    try {
      let latestWeather = await fetchAPIData();
      console.log("updating to ", latestWeather);

      if (latestWeather) {
        const updatedWeather = await weatherDAO.updateWeather(latestWeather);
        return res.json({ status: "success", data: updatedWeather });
      } else {
        let latestWeather = await weatherDAO.getWeather();
        return res.json({ status: "success", data: latestWeather });
      }
    } catch (e) {
      console.log("EE", e);
      return res.status(500).json({ status: "error", message: e });
    }
  }
}
let weatherController = new WeatherController();
module.exports = { weatherController };
