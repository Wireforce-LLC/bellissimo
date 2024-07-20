import Card from "~/components/Card";
import FunnelClicksDate from "~/embed/FunnelClicksDate";
import FunnelClicksEmbed from "~/embed/FunnelClicks";

/**
 * A component that renders two cards:
 * 1. Funnel clicks card with a graph
 * 2. Funnel clicks date card with a date picker
 */
export default function Widgets() {
  return (
    <div className="w-full h-full">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 p-2">
        <Card
          title={"Funnel Clicks"}
          isCanBeFullScreen
          description={
            "We collected information about all the routes of users who sent their events through clicks to Bellissimo. We combined them into routes. Here's what we got"
          }
          className={"min-h-64 bg-white overflow-x-auto"}
        >
          <FunnelClicksEmbed isHideShortSchemas />
        </Card>

        <Card
          title={"Funnel Clicks Date"}
          description={"Make a date range"}
          isCanBeFullScreen
          className={"min-h-64 bg-white overflow-x-auto"}
        >
          {/* The content of the second card */}
          <FunnelClicksDate />
        </Card>
      </div>
    </div>
  );
}
