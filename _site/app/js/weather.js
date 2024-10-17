require("dotenv").config(); // Load environment variables at the top
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const cacheFile = path.join(__dirname, "weatherCache.json");
const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds

module.exports = async function () {
  const apiKey = process.env.WEATHER_API_KEY; // Get API key from environment variables
  const city = "Seattle"; // Replace with your preferred city
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

  try {
    // Check if cached data exists and is still valid
    if (fs.existsSync(cacheFile)) {
      const cache = JSON.parse(fs.readFileSync(cacheFile));
      const isCacheValid =
        new Date().getTime() - cache.timestamp < cacheDuration;

      if (isCacheValid) {
        console.log("Serving weather data from cache");
        return cache.data;
      }
    }

    // If cache is not valid or doesn't exist, fetch new data
    console.log(`Fetching weather data from API: ${url}`); // Log the URL being called
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather data fetch failed");
    const data = await response.json();

    // Cache the new data with a timestamp
    const weatherData = {
      temperature: data.current.temp_c,
      description: data.current.condition.text,
      city: data.location.name,
    };

    fs.writeFileSync(
      cacheFile,
      JSON.stringify({
        timestamp: new Date().getTime(),
        data: weatherData,
      })
    );

    return weatherData;
  } catch (error) {
    console.error(error);
    // Fallback if there's an issue with fetching the data
    return {
      temperature: "N/A",
      description: "Unable to fetch weather data",
      city: "Unknown",
    };
  }
};
