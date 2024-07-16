import Card from "~/components/Card";
import FunnelClicksDate from "~/embed/FunnelClicksDate";
import FunnelClicksEmbed from "~/embed/FunnelClicks";

export default function Funnels() {
    return <div className="w-full h-full">
        <div className="grid lg:grid-cols-2 grid-cols-1">
            {/* <div className="min-h-64 border border-zinc-200 bg-white">
                <FunnelClicksEmbed/>
            </div> */}

            <Card
              title={"Funnel Clicks"}
              description={"We collected information about all the routes of users who sent their events through clicks to Bellissimo. We combined them into routes. Here's what we got"}
              className={"min-h-64 bg-white overflow-x-auto"}>
                <FunnelClicksEmbed isHideShortSchemas/>
            </Card>

            <Card  title={"Funnel Clicks Date"} description={"Make a date range"} className={"min-h-64 bg-white overflow-x-auto"}>
                <FunnelClicksDate/>
            </Card>

        
        </div>
    </div>
}