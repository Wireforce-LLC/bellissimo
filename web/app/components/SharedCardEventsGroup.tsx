import _ from "lodash"
import string from "~/localization/polyglot"
import Card from "./Card"
import ProgressMini from "./ProgressMini"

interface Props {
  readonly eventGrouped?: any[]
}

export default function SharedCardEventsGroup({ eventGrouped }: Props) {
  const colors = ["#f44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B", "#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#039BE5", "#00ACC1", "#00897B", "#43A047", "#C0CA33", "#FDD835", "#FB8C00"]

  return <Card title={string("events.grid.grouped.title")} className="border-none min-h-[200px]">
    {
      _.take(_.toPairs(eventGrouped), 8)?.map((event, index) => (
        <div className="w-full flex flex-row gap-2 justify-center place-items-center">
          <span className="text-gray-600 text-xs m-0 line-clamp-none">{event[0]}</span>

          <ProgressMini
            bgColor={colors[index]}
            value={event[1].countEvents}
            progress={event[1].percentOfOthers} />

          {event[1].percentOfOthers > 50 && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-lime-500 animate-pulse">
            <path fill-rule="evenodd" d="M9.58 1.077a.75.75 0 0 1 .405.82L9.165 6h4.085a.75.75 0 0 1 .567 1.241l-6.5 7.5a.75.75 0 0 1-1.302-.638L6.835 10H2.75a.75.75 0 0 1-.567-1.241l6.5-7.5a.75.75 0 0 1 .897-.182Z" clip-rule="evenodd" />
          </svg>}
        </div>
      ))
    }
  </Card>
}
