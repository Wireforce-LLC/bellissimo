import { useMemo, useState } from "react";
import Select from "./Select";
import type {
  ICountry,
  ICountryData,
  ILanguage,
  TContinentCode,
  TCountryCode,
  TLanguageCode,
} from 'countries-list'
import { continents, countries, languages } from 'countries-list'
import _ from "lodash";
import Input from "./Input";
import moment, { Moment } from "moment";

interface Props {
  readonly onFilterColumnIntent: () => void;
  readonly onChangeCountry: (value: string | undefined) => void;
  readonly onChangeDate: (value: Moment | undefined) => void;
}

export default function FilterRequests({ onFilterColumnIntent, onChangeCountry, onChangeDate }: Props) {
  const [country, setCountry] = useState<string | undefined>();
  const [date, setDate] = useState<string | undefined>();

  const countriesList = useMemo(() => {
    const list = _.toPairs(countries).map((item) => {
      return {
        value: item[0],
        name: item[1].name + " (" + item[0] + ")",
      }
    })

    return _.orderBy(list, ['name'], ['asc']);
  }, [])

  return (
    <div className="sticky top-2 space-y-4">
      <Select
        label="Country"
        value={country}
        onChangeValue={it => {
          setCountry(it);
          onChangeCountry(it);
        }}
        values={countriesList}
      />

      <Input label="Date" type="date" onChangeValue={it => {
        setDate(it)
        onChangeDate(moment(it).isValid()? moment(it) : undefined)
      }} value={date}/>

      <button
        className="w-full text-[#003049] bg-zinc-100 text-xs font-medium cursor-pointer py-2"
        onClick={onFilterColumnIntent}
      >
        Select colums
      </button>
    </div>
  );
}
