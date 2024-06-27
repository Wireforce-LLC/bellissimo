import { useState } from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";

interface Submit {
  readonly filterId: string;
  readonly filterName: string;
}

// This is the top - level interface that we'll use to create the
interface Props {
  readonly onSubmit: (submit: Submit) => void;
}

/**
* Embed for the filter name input. It is used to create a new filter and set its name to the value of modelFilterName
* 
* @param Props - Props object with properties to pass to the component
* 
* @return { JSX. Element } The embed to show in the form of a filter name input with a
*/
export default function CreateFilterNameEmbed({ onSubmit }: Props) {
  // The state variables for the filter ID and filter name inputs
  const [modelFilterName, setModelFilterName] = useState<string | undefined>();
  const [modelFilterId, setModelFilterId] = useState<string | undefined>();

  return (
    // The main container for the component
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex items-center justify-center flex-col">
        {/* The filter image */}
        <img src="/filter.png" alt="" className="h-40" />

        {/* The title */}
        <h2 className="text-lg font-medium">
          <b>FilterEngine.</b> Factory of new filters.
        </h2>

        {/* The description */}
        <p className="text-xs text-gray-500 text-center w-[400px]">
          Creating a filter to distribute traffic between resources. In the
          future, you will be able to reference the same filter multiple times
        </p>

        {/* The form */}
        <div className="space-y-2 w-1/2 min-w-[400px] mt-8">
          <Input
            label="Filter ID"
            value={modelFilterId}
            onChangeValue={setModelFilterId}
          />

          <Input
            label="Filter name"
            value={modelFilterName}
            onChangeValue={setModelFilterName}
          />

          {/* The submit button */}
          <Button
            onPress={() => {
              // Submit the form when both filter ID and filter name are provided.
              if (modelFilterId && modelFilterName) {
                // Submit the form when both filter ID and filter name are provided
                onSubmit({
                  filterId: modelFilterId,
                  filterName: modelFilterName,
                });
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
