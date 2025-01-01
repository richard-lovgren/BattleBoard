"use client";

import { FC, useEffect, useState } from "react";

interface Props {
  langcode: string;
}

const CountryFlag: FC<Props> = ({ langcode }) => {
  const [data, setData] = useState<string>("🌐");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        console.log("Fetching flags.json...");

        const flagsModule = await import("@/public/flags.json");
        console.log("Flags module imported:", flagsModule);

        const flags = flagsModule.default;
        console.log("Parsed flags:", flags);

        const country = flags.find(
          (country: any) =>
            country.code === langcode.slice(3, 5)
        );
        console.log("Matched country:", country);

        console.log("Slice: ", langcode.slice(3, 5))

        if (!country) {
          throw new Error(`No country found for langcode: ${langcode}`);
        }

        setData(country.flag);
      } catch (err) {
        console.error("Error in fetchFlag:", err);
        setError((err as Error).message);
      }
    };

    fetchFlag();
  }, [langcode]);

  return (
    <div>
      <h1 className="text-4xl">{data}</h1>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CountryFlag;
