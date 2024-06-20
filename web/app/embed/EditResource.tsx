import _ from "lodash";
import { useEffect, useState } from "react";
import BigInput from "~/components/BigInput";
import Button from "~/components/Button";
import ErrorString from "~/components/ErrorString";
import Input from "~/components/Input";
import Select from "~/components/Select";
import webConfig, { ApiPathEnum, DRIVERS } from "~/web.config";

interface Props {
  readonly resourceId?: string;
  readonly onEditResource?: (resource: ResourceData) => void;
}

interface ResourceData {
  readonly resourceId?: string;
  readonly driver?: string;
  readonly content?: string;
  readonly fileUri?: string;
}

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
}: Props) {
  // State hook for the content of the resource being edited.
  const [modalEditResourceRawContent, setModalEditResourceRawContent] =
    useState<string | undefined>();

  const [driver, setDriver] = useState<string | undefined>();

  const [errorString, setErrorString] = useState<string | undefined>();
  const [filesPlaceholder, setFilesPlaceholder] = useState<
    string[] | undefined
  >(undefined);
  const [modelFileUri, setModelFileUri] = useState<string | undefined>();
  const [host, setHost] = useState<string | undefined>();
  const [protocol, setProtocol] = useState<string | undefined>("http");

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

      let path =
        webConfig.apiEndpointFactory(ApiPathEnum.GetResource) +
        "/" +
        resourceId;

      webConfig.axiosFactory("PRIVATE").then((i) => {
        i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllFilesShort)).then(
          (res) => {
            setFilesPlaceholder(res.data.value);

            if (res.data.value) {
              setModelFileUri(res.data.value[0]);
            }
          }
        );
      });

      webConfig.axiosFactory("PRIVATE").then((i) => {
        i.get(path)
          .then((res) => {
            if (res.status == 200) {
              setModalEditResourceRawContent(res.data.value.raw_content);
              setDriver(res.data.value.driver);

              if (res.data.value.file_uri) {
                setModelFileUri(res.data.value.file_uri);
              }
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
    }
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
        onChangeValue={setDriver} // The function to update the select field value.
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
        onChangeValue={setModelFileUri}
      />

      {/* Render the BigInput component for editing the resource content. */}
      <BigInput
        label="Regular content" // The label for the input field.
        value={modalEditResourceRawContent} // The current value of the input field.
        onChangeValue={setModalEditResourceRawContent} // The function to update the input field value.
      />

      {/* Render the error message if it exists. */}
      {errorString && <ErrorString>{errorString}</ErrorString>}

      {/* Render the Save button. */}
      <Button onPress={onSubmit}>Save</Button>
    </div>
  );
}
