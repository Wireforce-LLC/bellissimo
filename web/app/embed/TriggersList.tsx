import Button from "~/components/Button";
import EazyModal from "~/components/EazyModal";
import Table2 from "~/components/Table2";
import humanizeString from "humanize-string";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useState } from "react";

interface Props {
    
}

interface Trigger {
    readonly  trigger_id: string;
    readonly  function_id: string;
    readonly trigger_event: string;
}

export default function TriggersListEmbed({}: Props) {
    const [data, setData] = useState<Trigger[]>([]);
    const [deleteTriggerModal, setDeleteTriggerModal] = useState<string|undefined>();
    
    const fether = useCallback(() => {
        webConfig.axiosFactory("PRIVATE").then((i) => {
            i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllTriggersList)).then((res) => {
                if (res.data.value) {
                    setData(res.data.value);
                }
            });
        })    
    }, []);

    useEffect(() => fether(), [fether]);

    const deleteTrigger = useCallback(() => {
        webConfig.axiosFactory("PRIVATE").then((i) => {
            i.delete(webConfig.apiEndpointFactory(ApiPathEnum.DeleteTrigger), {
                params: {
                    id: deleteTriggerModal
                }
            }).then(() => {
                fether();
                setDeleteTriggerModal(undefined);
            });
        });
    }, [deleteTriggerModal]);

    return (
        <>
        <Table2
            onSelectedItem={(index, data) => {
                setDeleteTriggerModal(data.trigger_id);
            }}
            headerTransformer={{
                any(it: string) {
                    return humanizeString(it);
                }
            }}
            valueTransformer={{
                trigger_event(it: string) {
                    if (it.includes("::")) {
                        return <span>
                            <span className="font-bold">{it.split("::").at(0)}</span>
                            <span>::</span>
                            <span className="text-zinc-500">{it.split("::").at(1)}</span>
                        </span>
                    }

                    return it
                }
            }}
            dataset={data}
        />

        <EazyModal
            title="Confirm delete"
            zIndex={5}
            isVisible={deleteTriggerModal !== undefined}
            intent={() => setDeleteTriggerModal(undefined)}
        >
            <div className="space-y-4">
                {/* <Input
                    placeholder="Enter 'delete' to confirm"
                    value={deleteTriggerModal}
                    onChangeValue={setDeleteTriggerModal}
                /> */}

                <Button
                    variant="delete"
                    onPress={() => deleteTrigger() }
                >
                    Delete
                </Button>   
            </div>
        </EazyModal>
        </>
    );
}