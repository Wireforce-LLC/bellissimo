import * as d3 from "d3";
import _ from "lodash";
import features from "../../public/map-features.json";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  TCountryCode,
  getCountryData,
  getCountryDataList
} from "countries-list";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule
} from "react-simple-maps";

type CountryRecord = Record<string, string>;

export default function WidgetMapWithHighTrafficEmbed() {
  const [data, setData] = useState<CountryRecord>({});
  const [tooltipContent, setTooltipContent] = useState("");

  const scaleLinear = useMemo(() => {
    if (!data) {
      return () => "#e9ecef";
    }
    const max = _.max(
      _.values(data).map((i) => parseInt(i as string))
    ) as number;
    const min = _.min(
      _.values(data).map((i) => parseInt(i as string))
    ) as number;

    return d3.scaleLinear([min, max], ["#ffea00", "#ff7b00"]);
  }, [data]);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.post(webConfig.apiEndpointFactory(ApiPathEnum.Playground), {
        function: "get_requests_by_country",
        argv: {
          window_days: "900",
        },
      }).then((res) => {
        if (res.data.value) {
          setData(res.data.value);
        }
      });
    });
  }, []);

  useEffect(() => fether(), [fether]);

  const getCountryIso2ByIso3 = (code: string): string => {
    const country = getCountryDataList().find((c) => c.iso3 === code);
    return country?.iso2 || "";
  };

  return (
    <div>
      <ComposableMap
        projectionConfig={
          {
            //   rotate: [-10.0, -53.0, 0],
            //   scale: 1200,
          }
        }
      >
        <Graticule scale={1} stroke="#dee2e6" />

        <Geographies geography={features}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoRecord: string | null = _.get(
                data,
                getCountryIso2ByIso3(geo.id),
                null
              );
              const geoCount = geoRecord ? parseInt(geoRecord as string) : null;

              console.log();
              return (
                <Geography
                  fill={geoCount ? scaleLinear(geoCount) : "black"}
                  strokeWidth={1}
                  onMouseEnter={() => {
                    setTooltipContent(`${geo.properties.name}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  stroke={"#f8f9fa"}
                  key={geo.rsmKey}
                  geography={geo}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div>
        {data &&
          _.take(
            _.toPairs(data).sort((a, b) => parseInt(b[1]) - parseInt(a[1])),
            5
          ).map((i) => (
            <div className="text-xs" key={i[0]}>
              <span>{getCountryData(i[0] as TCountryCode)?.name}</span>
              <span className="float-right">
                {parseInt(i[1]).toLocaleString()} requests
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
