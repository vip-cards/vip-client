/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useSearch(queryAPI, fullList, debounce = 1000) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState({ exist: false, list: [] });
  const [initial, setInitial] = useState(true);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});

  const renderedList = result.exist ? result.list : fullList;
  const arabicReg = /[\u0621-\u064A]/g;
  const currentParams = Object.fromEntries([...searchParams]);

  useEffect(() => {
    (async () => {
      if (Object.keys(currentParams).length > 0) {
        const queryObj = {
          ...currentParams,
          ...(Object.keys(params).length && params),
        };
        setLoading(true);

        const { data } = await queryAPI(queryObj);

        setResult({ exist: true, list: data.records });
        setLoading(false);
      }
    })();
  }, []);
  useEffect(() => {
    if (initial) {
      setInitial(false);
      return;
    }
    const isArabic = arabicReg.test(query);
    const queryObj = {
      ...(!isArabic && { "name.en": query }),
      ...(isArabic && { "name.ar": query }),
      ...(Object.keys(params).length && params),
    };
    setSearchParams(queryObj);
    const timer = setTimeout(async () => {
      setLoading(true);

      const { data } = await queryAPI(queryObj);

      setResult({ exist: true, list: data.records });
      setLoading(false);
    }, debounce);

    return () => clearTimeout(timer);
  }, [params, query, queryAPI, searchParams]);

  return { loading, renderedList, setQuery, setParams, setLoading };
}
