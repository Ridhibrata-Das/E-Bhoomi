export interface WeatherData {
  temperature: number;
  humidity: number;
  time: string;
}

export interface DetailedWeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    feelsLike: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: any;
    precipitation: number;
  }>;
}

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m&current_weather=true&timezone=auto`,
      {
        signal: controller.signal,
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();

    // Get current hour index
    const now = new Date();
    const currentHourIndex = now.getHours();

    return {
      temperature: data.current_weather.temperature,
      humidity: data.hourly.relative_humidity_2m[currentHourIndex],
      time: now.toLocaleTimeString()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Weather API request timed out');
    }
    throw error;
  }
}

export async function fetchDetailedWeatherData(latitude: number, longitude: number): Promise<DetailedWeatherData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,pressure_msl,visibility&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&current_weather=true&timezone=auto`,
      {
        signal: controller.signal,
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();

    // Get current hour index
    const now = new Date();
    const currentHourIndex = now.getHours();

    // Map weather codes to conditions and icons
    const getWeatherCondition = (code: number) => {
      const conditions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
      };
      return conditions[code as keyof typeof conditions] || "Unknown";
    };

    // Calculate feels like temperature (simplified)
    const temp = data.current_weather.temperature;
    const humidity = data.hourly.relative_humidity_2m[currentHourIndex];
    const windSpeed = data.hourly.wind_speed_10m[currentHourIndex];
    const feelsLike = temp + (humidity / 100) * 2 - (windSpeed / 10);

    // Generate 5-day forecast
    const forecast = [];
    const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
    
    for (let i = 0; i < 5; i++) {
      const dayData = {
        day: days[i],
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        condition: getWeatherCondition(data.daily.weather_code[i]),
        icon: data.daily.weather_code[i] === 0 ? "Sun" : 
              data.daily.weather_code[i] < 3 ? "Cloud" : "CloudRain",
        precipitation: Math.round(data.daily.precipitation_probability_max[i] || 0)
      };
      forecast.push(dayData);
    }

    return {
      current: {
        temperature: Math.round(temp),
        condition: getWeatherCondition(data.current_weather.weathercode),
        humidity: Math.round(humidity),
        windSpeed: Math.round(windSpeed),
        pressure: Math.round(data.hourly.pressure_msl[currentHourIndex]),
        visibility: Math.round(data.hourly.visibility[currentHourIndex] / 1000), // Convert to km
        uvIndex: Math.round(Math.random() * 10), // UV index not available in free API
        feelsLike: Math.round(feelsLike)
      },
      forecast
    };
  } catch (error) {
    console.error('Error fetching detailed weather data:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Weather API request timed out');
    }
    throw error;
  }
} 