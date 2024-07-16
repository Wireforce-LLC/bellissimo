import BigInput from "~/components/BigInput";
import Button from "~/components/Button";
import ErrorString from "~/components/ErrorString";
import Input from "~/components/Input";
import Select from "~/components/Select";
import toast from "react-hot-toast";
import webConfig, { ApiPathEnum, DRIVERS } from "~/web.config";
import { useCallback, useEffect, useState } from "react";

interface Props {
  readonly resourceId?: string;
  readonly onEditResource?: (resource: ResourceData) => void;
  readonly onDeletedResource?: (resourceId: string) => void;
}

interface ResourceData {
  readonly resourceId?: string;
  readonly driver?: string;
  readonly content?: string;
  readonly fileUri?: string;
}

const resourceDeleted = (
  <div className="w-full h-[250px] flex flex-col items-center justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6 mb-4"
    >
      <path
        fill-rule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
        clip-rule="evenodd"
      />
    </svg>

    <h3 className="font-medium text-sm">Resource deleted</h3>
    <p className="font-normal text-xs">
      The resource has been successfully deleted.
    </p>
  </div>
);

const resourceCorrupted = (
  <div className="w-full h-[250px] flex flex-col items-center justify-center">
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      className="size-6 mb-4"
    >
      <path d="M21.512 6.112l-3.89 3.889-3.535-3.536 3.889-3.889a6.501 6.501 0 00-8.484 8.486l-6.276 6.275a.999.999 0 000 1.414l2.122 2.122a.999.999 0 001.414 0l6.275-6.276a6.501 6.501 0 007.071-1.414 6.504 6.504 0 001.414-7.071z" />
    </svg>

    <h3 className="font-medium text-sm">Resource corrupted</h3>
    <p className="font-normal text-xs">
      The resource corrupted.
    </p>
  </div>
)

/**
 * Renders the EditResourceEmbed component.
 *
 * @param {Props} props - The props object.
 * @param {string} props.resourceId - The ID of the resource being edited.
 * @returns {JSX.Element} The rendered EditResourceEmbed component.
 */
export default function EditResourceEmbed({
  resourceId,
  onEditResource,
  onDeletedResource,
}: Props) {
  // State hook for the content of the resource being edited.
  const [modalEditResourceRawContent, setModalEditResourceRawContent] =
    useState<string | undefined>();

  const [isDeletedResource, setIsDeletedResource] = useState<boolean>(false);

  const [driver, setDriver] = useState<string | undefined>();
  const [isModified, setModified] = useState<boolean>(false);

  const [errorString, setErrorString] = useState<string | undefined>();
  const [filesPlaceholder, setFilesPlaceholder] = useState<
    string[] | undefined
  >(undefined);
  const [modelFileUri, setModelFileUri] = useState<string | undefined>();
  const [host, setHost] = useState<string | undefined>();
  const [protocol, setProtocol] = useState<string | undefined>("http");
  const [errorCode, setErrorCode] = useState<string | undefined>();

  useEffect(() => {
    setHost(window.location.hostname);
    setProtocol(window.location.protocol.replace(":", ""));
  }, []);

  /**
   * Fetches the resource content from the API based on the resourceId.
   */
  useEffect(() => {
    if (resourceId) {
      setErrorString(undefined);
      setErrorCode(undefined);

      let path =
        webConfig.apiEndpointFactory(ApiPathEnum.GetResource) +
        "/" +
        resourceId;

      webConfig.axiosFactory("PRIVATE").then((i) => {
        i.get(path)
          .then((res) => {
            if (res.status == 200) {
              setModalEditResourceRawContent(res.data.value.raw_content);
              setDriver(res.data.value.driver);

              if (res.data.value.file_uri) {
                setModelFileUri(res.data.value.file_uri);
              }

              webConfig.axiosFactory("PRIVATE").then((i) => {
                i.get(
                  webConfig.apiEndpointFactory(ApiPathEnum.GetAllFilesShort)
                ).then((res) => {
                  setFilesPlaceholder(res.data.value);

                  if (res.data.value) {
                    setModelFileUri(res.data.value[0]);
                  }
                });
              });
            }
          })
          .catch((err) => {
            if (err.response.status == 404) {
              setErrorString("Resource not found");
            }

            if (err.response.status == 500) {
              setErrorString("Internal server error");
            }

            if (err.response.message) {
              setErrorString(err.response.message);
            }

            setErrorString("Unknown error");
            setErrorCode("RESOURCE_CORRUPTED");
          });
      });
    }
  }, [resourceId]);

  const onDeleteResource = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.delete(
        webConfig.apiEndpointFactory(ApiPathEnum.Resource) + "/" + resourceId
      )
        .then((res) => {
          if (res.status == 200) {
            toast.success("Resource deleted");
            setIsDeletedResource(true);
            onDeletedResource?.(resourceId!!);
          }
        })
        .catch((err) => {
          if (err.response.status == 404) {
            setErrorString("Resource not found");
          }

          if (err.response.status == 500) {
            setErrorString("Internal server error");
          }

          if (err.response.message) {
            setErrorString(err.response.message);
          }

          setErrorString("Unknown error");
        });
    });
  }, [resourceId]);

  /**
   * Handles the form submission.
   * Validates the form inputs and calls the onEditResource callback function
   * with the edited resource data.
   */
  const onSubmit = () => {
    // Check if the driver is selected
    if (!driver) {
      setErrorString("Driver is required"); // Set the error message
      return; // Exit the function
    }

    // Check if either the file or content is provided
    if (!modelFileUri && !modalEditResourceRawContent) {
      setErrorString("File or content is required"); // Set the error message
      return; // Exit the function
    }

    // Check if both the file and content are provided
    if (modelFileUri && modalEditResourceRawContent) {
      setErrorString("Only one of the two fields should be filled"); // Set the error message
      return; // Exit the function
    }

    // Clear the error message
    setErrorString(undefined);

    // Call the onEditResource callback function with the edited resource data
    if (resourceId && onEditResource) {
      onEditResource({
        resourceId: resourceId, // The resource ID
        driver: driver, // The selected driver
        content: modalEditResourceRawContent, // The edited content
        fileUri: modelFileUri, // The edited file URI
      });
    }
  };

  if (isDeletedResource) {
    return resourceDeleted;
  }

  if (errorCode == "RESOURCE_CORRUPTED") {
    return resourceCorrupted;
  }

  // Render the EditResourceEmbed component.
  return (
    <div className="space-y-4">
      <Input
        label="Primary Link" // The label for the input field.
        value={protocol + "://" + host + "/object/get/" + resourceId} // The current value of the input field.
        isDisabled
      />

      {/* Render the Input component for displaying the resource ID. */}
      <Input
        label="Resource ID" // The label for the input field.
        value={resourceId} // The current value of the input field.
        isDisabled
      />

      {/* Render the Select component for selecting the driver. */}
      <Select
        label="Driver" // The label for the select field.
        value={driver} // The current value of the select field.
        onChangeValue={(it) => {
          setModified(true);
          setDriver(it);
        }} // The function to update the select field value.
        values={DRIVERS.map((driver) => ({
          name: driver.name,
          value: driver.value,
        }))} // The list of values to be displayed in the select field.
      />

      {/* Render the Select component for selecting the file. */}
      <Select
        label="File"
        values={[{ name: "Without file", value: "" }].concat(
          filesPlaceholder?.map((i: string) => ({ name: i, value: i })) || []
        )}
        value={modelFileUri}
        onChangeValue={(it) => {
          setModelFileUri(it);
          setModified(true);
        }}
      />

      {/* Render the BigInput component for editing the resource content. */}
      <BigInput
        label="Regular content" // The label for the input field.
        value={modalEditResourceRawContent} // The current value of the input field.
        onChangeValue={(it) => {
          setModalEditResourceRawContent(it);
          setModified(true);
        }} // The function to update the input field value.
      />

      {/* Render the error message if it exists. */}
      {errorString && <ErrorString>{errorString}</ErrorString>}

      {/* Render the Save button. */}
      <div className="gap-2 flex">
        <Button variant="delete" onPress={onDeleteResource}>
          Delete resource
        </Button>
        <Button disabled={!isModified} onPress={onSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
}
