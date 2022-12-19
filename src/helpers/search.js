/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";

export default function useSearch(queryAPI, fullList, debounce = 1000) {
  const [result, setResult] = useState({ exist: false, list: [] });
  const [initial, setInitial] = useState(true);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({});

  const renderedList = result.exist ? result.list : fullList;
  const arabicReg = useMemo(() => /[\u0621-\u064A]/g, []);

  useEffect(() => {
    // console.log("search hook start");
    if (initial) {
      setInitial(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const isArabic = arabicReg.test(query);

      const { data } = await queryAPI({
        ...(!isArabic && { "name.en": query }),
        ...(isArabic && { "name.ar": query }),
        ...(Object.keys(params).length && params),
      });

      setResult({ exist: true, list: data.records });
      setLoading(false);
    }, debounce);

    return () => clearTimeout(timer);
  }, [arabicReg, debounce, params, query, queryAPI]);

  return { loading, renderedList, setQuery, setParams, setLoading };
}
