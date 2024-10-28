const city = "Seattle"; // Set the city you want
const apiKey = ""; // Hard-coded for local development
const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

// Function to display current time for a specific time zone
function updateTime(timeZone) {
  const now = new Date();
  const options = {
    timeZone: timeZone, // Set the desired time zone
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use true for 12-hour format
  };
  const timeString = new Intl.DateTimeFormat([], options).format(now);
  document.getElementById("time").innerText = timeString + "," + " ";
}

// Function to fetch weather data
async function getWeather() {
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      document.getElementById("weather").innerHTML = ` 
              ${data.current.condition.text} 
              <img src="${data.current.condition.icon}" alt="weather icon" />
          `;
    } else {
      console.error("Error fetching weather data:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Set Los Angeles as the desired time zone
const desiredTimeZone = "America/Los_Angeles"; // Using Los Angeles as the time zone
updateTime(desiredTimeZone); // Call the function immediately to display the time
getWeather(); // Fetch the weather data

// Set interval to update the time every minute
setInterval(() => updateTime(desiredTimeZone), 60000); // 60000 ms = 1 minute
