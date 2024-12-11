import { request } from "http";
import { url } from "inspector";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function useCountryLocaleFlag(url: string): {
  data: string;
  error: string;
} {
  const [data, setData] = useState<string>("");

  const [error, setError] = useState<string>("");

  useEffect(() => {
    const request = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.text();

        setData(responseData);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    request();
  }, [url]);

  return { data, error };
}
