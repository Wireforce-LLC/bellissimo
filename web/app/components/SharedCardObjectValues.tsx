import _ from "lodash"
import string from "~/localization/polyglot"
import Card from "./Card"
import ProgressMini from "./ProgressMini"
import { useEffect, useState } from "react"
import { RFC_2822 } from "moment"

interface Props {
  readonly object?: any,
  readonly title?: any,
}

export default function SharedCardObjectValues({ object, title }: Props) {
  const colors = ["#f44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B", "#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#039BE5", "#00ACC1", "#00897B", "#43A047", "#C0CA33", "#FDD835", "#FB8C00"]
  const [sumAllValues, setSumAllValues] = useState(0)

  useEffect(() => {
    const sum = _.sum(_.toPairs(object).map(item => item[1]))

    setSumAllValues(sum)
  }, [object])


  return <Card title={title} className="border-none min-h-[200px]">
    {
      _.toPairs(object)?.map((record, index) => (
        <div className="w-full flex flex-row gap-2 justify-center place-items-center">
          <h6 className="text-gray-600 text-xs m-0 line-clamp-none">{record[0]}</h6>

          <ProgressMini
            bgColor={colors[index]}
            value={parseInt(record[1])}
            progress={_.round(parseInt(record[1]) / sumAllValues * 100)} />
        </div>
      ))
    }
  </Card>
}
