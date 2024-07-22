import Button from "~/components/Button";
import Input from "~/components/Input";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useMemo, useState } from "react";

interface Props {
    readonly funcId?: string;   
}

export default function CreateTriggerEmbed({funcId} : Props) {
    const [triggerId, setTriggerId] = useState("");
    const [functionId, setFunctionId] = useState(funcId || "")
    const [triggerEvent, setTriggerEvent] = useState("");

    const fether = useCallback(() => {
        webConfig.axiosFactory("PRIVATE").then((i) => {
            i.post(webConfig.apiEndpointFactory(ApiPathEnum.CreateTrigger), {
                trigger_id: triggerId,
                function_id: functionId,
                trigger_event: triggerEvent
            }).then(() => {
                //   fether();
            });
        })
    }, [triggerId, functionId, triggerEvent]);

    const triggerTip = useMemo(() => {
        if (triggerId === "" || functionId === "" || triggerEvent === "") {
            return <p className="text-xs text-gray-500">Trigger id, function id and trigger event are required.</p>
        }

        if (triggerEvent.startsWith("click::") && triggerEvent.length > 7) {
            return <p className="text-xs text-gray-500">
                When the click with '<b>{triggerEvent.replace("click::", "")}</b>' event occurs, the function will be triggered.
            </p>
        }

        if (triggerEvent.startsWith("dataset::") && triggerEvent.length > 9) {
            return <p className="text-xs text-gray-500">
                When the dataset with '<b>{triggerEvent.replace("dataset::", "")}</b>' append item, the function will be triggered.
            </p>
        }

        if (triggerEvent.startsWith("schedule::") && triggerEvent.length > 10) {
            return <p className="text-xs text-gray-500">
                <p>When the schedule with '<b>{triggerEvent.replace("schedule::", "")}</b>' occurs, the function will be triggered.</p>
                <p>Available schedules:</p>
                <ul>
                    <li>schedule::(12:00pm) - The function will be triggered at 12:00pm</li>
                    <li>schedule::(6:00pm) - The function will be triggered at 6:00pm</li>
                    <li>schedule::(6:00am) - The function will be triggered at 6:00am</li>
                </ul>
            </p>
        }

        if (triggerEvent.startsWith("every::") && triggerEvent.length > 7) {
            if (triggerEvent.replace("every::", "") === "minute") {
                return <p className="text-xs text-gray-500">
                    The function will be triggered every '<b>1</b>' minutes.
                </p>
            } 

            if (triggerEvent.replace("every::", "") === "hour") {
                return <p className="text-xs text-gray-500">
                    The function will be triggered every '<b>1</b>' hour.
                </p>
            }
            
            if (parseInt(triggerEvent.replace("every::", ""))) {
                return <p className="text-xs text-gray-500">
                    The trigger will fire every '<b>{triggerEvent.replace("every::", "")}</b>' minutes of every hour.
                </p>
            }
        }

        return <p className="text-xs text-gray-500">
            Use 'click::' or 'dataset::' or 'schedule::' or 'every::' to set trigger event.
        </p>
    }, [triggerId, functionId, triggerEvent]);

    return <div className="space-y-2">
        <Input
            label="Trigger id"
            placeholder="Enter trigger id"
            value={triggerId}
            onChangeValue={setTriggerId}
        />
        <Input
            label="Function id"
            placeholder="Enter function id"
            value={functionId}
            onChangeValue={setFunctionId}
        />
        <Input
            label="Trigger event"
            placeholder="Enter trigger event"
            value={triggerEvent}
            onChangeValue={setTriggerEvent}
        />

        <div className="px-2 py-1 bg-zinc-100">
        {
            triggerTip
        }
        </div>

        <Button onPress={fether}>
            Create
        </Button>
    </div>
}