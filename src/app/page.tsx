'use client'
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useQuery } from "react-query";
import { format, parseISO } from "date-fns";
import { KelvinToCelsius } from "@/utils/KelvinToCelsius";
import { useEffect } from "react";
import WeatherIcon from "@/components/WeatherIcon";

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


export default function Home() {

  const { isLoading, error, data, refetch } = useQuery<WeatherData>("repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=Buenos+Aires,ar&appid=${process.env.NEXT_PUBLIC_API_WEATHER}&cnt=56`
      );
      return data;
    });
  useEffect(() => {
    refetch();
  }, [refetch]);

  console.log("data", data, "url", process.env.NEXT_PUBLIC_API_WEATHER);
  const firstData = data?.list[0];
  console.log("firstData", firstData);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">An error has ocurred </p>
      </div>
    );

  return (
    <div className='flex flex-col gap-4 bg-violet-200 min-h-screen overflow-hidden'>
      <Navbar />
      <main className="px-3 max-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        <section>
          <div>
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
              </p>
            </h2>
            <div
              className='w-full bg-violet-100 border rounded-xl flex py-4 shadow-sm'>
              <div className="gap-10 px-6 items-center">

                <div className="flex flex-col px-4">
                  <span className="text-5xl">
                    {KelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                  </span>
                  <p className="text-sm space-x-1 whitespace-nowrap">
                    <span>Feels Like </span>
                    <span>
                      {KelvinToCelsius(firstData?.main.feels_like ?? 0)}°
                    </span>
                  </p>
                  <p className="text-xs space-x-2">
                    <span>
                      {KelvinToCelsius(firstData?.main.temp_min ?? 0)}
                      °↓{" "}
                    </span>
                    <span>
                      {" "}
                      {KelvinToCelsius(firstData?.main.temp_max ?? 0)}
                      °↑
                    </span>
                  </p>
                </div>


                <div className="flex gap-10 sm:gap-16 w-full max-w-full justify-between pr-3 overflow-x-auto">
                  {data?.list.map((d, i) => (
                    <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                      <p className="whitespace-nowrap">
                        {format(parseISO(d.dt_txt), "h:mm a")}
                      </p>
                       <WeatherIcon iconName={d.weather[0].icon} />
                      <p>{KelvinToCelsius(d?.main.temp ?? 0)}°</p>

                    </div>
                  ))}
                </div>



              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
