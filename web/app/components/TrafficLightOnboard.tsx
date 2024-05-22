import ButtonSecondary from "./ButtonSecondary";
import Link from "./Link";

export default function TrafficLightOnboard() {
  return <div className="w-full flex flex-items justify-center py-16">
    <div className="flex flex-col items-center">
      <img src="/traffic.png" className="w-36 h-36 mb-6" />

      <h1 className="font-semibold leading-7 mb-1 text-2xl max-w-[500px] text-center">
        Connect your open source TrafficLight server to monitor the direction of your traffic.
      </h1>

      <p className="text-center w-full leading-5 text-md text-gray-400 max-w-96">TrafficLight in conjunction with Paper Analytics will help you with</p>

      <div className="w-[400px] mt-6">
        <ul className="list-disc space-y-1">
          <li className="font-medium text-sm">Direct different traffic sources to different offers</li>
          <li className="font-medium text-sm">Deliver different types of content to users from different countries, with different ASNs: JSON, HTML, files</li>
          <li className="font-medium text-sm">Create links between TrafficLight and Paper Analytics to export information to your advertising account for advertising optimization</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-2">
        <Link href="/traffic/link">
          <ButtonSecondary>
            Link TrafficLight
          </ButtonSecondary>
        </Link>
        <Link href="https://github.com/Wireforce-LLC/trafficlight">
          Go to TrafficLight GitHub
        </Link>
      </div>

    </div>
  </div>
}
