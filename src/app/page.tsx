'use client'
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useQuery } from "react-query";

export default function Home() {
  interface WeatherDetail {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }
  interface WeatherData {
    cod: string;
    message: number;
    cnt: number;
    list: WeatherDetail[];
    city: {
      id: number;
      name: string;
      coord: {
        lat: number;
        lon: number;
      };
      country: string;
      population: number;
      timezone: number;
      sunrise: number;
      sunset: number;
    };
  }

  /*const { isLoading, error, data } = useQuery<WeatherData>('repoData',
    async () => {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=${process.env.API_WEATHER}`)
      return data;
    });

  console.log("data", data?.city);

  if (isLoading) return 'Loading...'*/


  return (

    <div className='flex flex-col gap-4 bg-violet-200 min-h-screen'>
      <Navbar />
    </div>
  );
}
