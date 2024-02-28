'use client'
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useQuery } from "react-query";
import { format, fromUnixTime, parseISO } from "date-fns";
import { KelvinToCelsius } from "@/utils/KelvinToCelsius";
import { useEffect, useState } from "react";
import WeatherIcon from "@/components/WeatherIcon";
import { DayOrNightIcon } from "@/utils/DayOrNightIcon";
import Forecast from "@/components/Forecast";
import WeatherDetails from "@/components/WeatherDetails";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertWindSpeed } from "@/utils/ConvertWindSpeed";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";

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
const [place, setPlace] = useAtom(placeAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>("repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_API_WEATHER}&cnt=56`
      );
      return data;
    });
  useEffect(() => {
    refetch();
  }, [place, refetch]);

  console.log("data", data, "url", process.env.NEXT_PUBLIC_API_WEATHER);
  const firstData = data?.list[0];
  console.log("firstData", firstData);
  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });


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
      <Navbar location={data?.city.name}/>
      <main className="px-12 max-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        <section>
          <div>
            <h2 className="flex gap-1 text-2xl items-end pb-2">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
              </p>
            </h2>
            <div
              className='w-full bg-violet-50 border rounded-xl flex py-4 shadow-sm flex-col'>
              <div className="gap-10 px-6 items-center flex">

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
                    <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold mb-4">
                      <p className="whitespace-nowrap">
                        {format(parseISO(d.dt_txt), "h:mm a")}
                      </p>
                      <WeatherIcon iconName={DayOrNightIcon(d.weather[0].icon, d.dt_txt)} />
                      <p>{KelvinToCelsius(d?.main.temp ?? 0)}°</p>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <div className="bg-violet-50 border rounded-xl flex py-4 shadow-sm w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">{firstData?.weather[0].description}</p>
              <WeatherIcon iconName={DayOrNightIcon(firstData?.weather[0].icon ?? "", firstData?.dt_txt ?? "")} />

            </div>
            <div className="w-full bg-violet-400 text-violet-50 border rounded-xl flex py-4 shadow-sm px-6 justify-between gap-4 overflow-x-auto">
              <WeatherDetails
                visability={metersToKilometers(
                  firstData?.visibility ?? 10000
                )}
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452), "H:mm")}
                sunset={format(fromUnixTime(data?.city.sunset ?? 1702517657), "H:mm")}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
              />
            </div>

          </div>
        </section>
        <section className="flex w-full flex-col gap-4 bg-violet-200 rounded-lg ">
          <p className="text 2xl"> Forecast (7Days)  </p>
          {firstDataForEachDate.map((d, i) => (
            <Forecast
              key={i}
              description={d?.weather[0].description ?? ""}
              weatehrIcon={d?.weather[0].icon ?? "01d"}
              date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
              day={d ? format(parseISO(d.dt_txt), "dd.MM") : "EEEE"}
              feels_like={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              airPressure={`${d?.main.pressure} hPa `}
              humidity={`${d?.main.humidity}% `}
              sunrise={format(
                fromUnixTime(data?.city.sunrise ?? 1702517657),
                "H:mm"
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1702517657),
                "H:mm"
              )}
              visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
              windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
