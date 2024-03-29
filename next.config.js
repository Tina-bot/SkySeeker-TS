module.exports = {
    reactStrictMode: true,
    env: {
      API_WEATHER: process.env.NEXT_PUBLIC_API_WEATHER,
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "openweathermap.org",
        }
      ]
    }
  }