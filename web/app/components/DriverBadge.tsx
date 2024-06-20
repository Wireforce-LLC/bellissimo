import { DRIVERS } from "~/web.config";

/**
 * The component props.
 */
interface Props {
  readonly driver?: string;
}

/**
 * Renders a driver badge based on the provided driver value.
 *
 * @param props - The component props.
 * @param props.driver - The driver value (string).
 * @returns The rendered driver badge.
 */
export default function DriverBadge({ driver }: Props): JSX.Element {
  if (driver == undefined) {
    return (
      <div className="flex flex-row items-center gap-2">
        <span>Unknown driver</span>
      </div>
    );
  }

  if (!DRIVERS?.map((i) => i.value).includes(driver)) {
    return (
      <div className="flex flex-row items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          height="1em"
          width="1em"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
          />
        </svg>

        <span>{driver}</span>
      </div>
    );
  }

  if (driver.startsWith("redirect::")) {
    return (
      <div className="flex flex-row items-center gap-2">
        <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
        </svg>

        <span>Redirect ({driver.replace("redirect::", "")})</span>
      </div>
    );
  }

  if (driver.startsWith("proxy::")) {
    return (
      <div className="flex flex-row items-center gap-2">
        <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
          <path d="M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6 16.59c0 .705-.646 1.29-1.529 1.29-.631 0-1.351-.255-1.801-.81l-6-7.141v6.66c0 .721-.57 1.29-1.274 1.29H7.32c-.721 0-1.29-.6-1.29-1.29V7.41c0-.705.63-1.29 1.5-1.29.646 0 1.38.255 1.83.81l5.97 7.141V7.41c0-.721.6-1.29 1.29-1.29h.075c.72 0 1.29.6 1.29 1.29v9.18H18z" />
        </svg>

        <span>Proxy ({driver.replace("proxy::", "")})</span>
      </div>
    );
  }

  switch (driver) {
    case "json":
      return (
        <div className="flex flex-row items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
            <path d="M12.043 23.968c.479-.004.953-.029 1.426-.094a11.805 11.805 0 003.146-.863 12.404 12.404 0 003.793-2.542 11.977 11.977 0 002.44-3.427 11.794 11.794 0 001.02-3.476c.149-1.16.135-2.346-.045-3.499a11.96 11.96 0 00-.793-2.788 11.197 11.197 0 00-.854-1.617c-1.168-1.837-2.861-3.314-4.81-4.3a12.835 12.835 0 00-2.172-.87h-.005c.119.063.24.132.345.201.12.074.239.146.351.225a8.93 8.93 0 011.559 1.33c1.063 1.145 1.797 2.548 2.218 4.041.284.982.434 1.998.495 3.017.044.743.044 1.491-.047 2.229-.149 1.27-.554 2.51-1.228 3.596a7.475 7.475 0 01-1.903 2.084c-1.244.928-2.877 1.482-4.436 1.114a3.916 3.916 0 01-.748-.258 4.692 4.692 0 01-.779-.45 6.08 6.08 0 01-1.244-1.105 6.507 6.507 0 01-1.049-1.747 7.366 7.366 0 01-.494-2.54c-.03-1.273.225-2.553.854-3.67a6.43 6.43 0 011.663-1.918c.225-.178.464-.333.704-.479l.016-.007a5.121 5.121 0 00-1.441-.12 4.963 4.963 0 00-1.228.24c-.359.12-.704.27-1.019.45a6.146 6.146 0 00-.733.494c-.211.18-.42.36-.615.555-1.123 1.153-1.768 2.682-2.022 4.256-.15.973-.15 1.96-.091 2.95.105 1.395.391 2.787.945 4.062a8.518 8.518 0 001.348 2.173 8.14 8.14 0 003.132 2.23 7.934 7.934 0 002.113.54c.074.015.149.015.209.015zm-2.934-.398a4.102 4.102 0 01-.45-.228 8.5 8.5 0 01-2.038-1.534c-1.094-1.137-1.827-2.566-2.247-4.08a15.184 15.184 0 01-.495-3.172 12.14 12.14 0 01.046-2.082c.135-1.257.495-2.501 1.124-3.58a6.889 6.889 0 011.783-2.053 6.23 6.23 0 011.633-.9 5.363 5.363 0 013.522-.045c.029 0 .029 0 .045.03.015.015.045.015.06.03.045.016.104.045.165.074.239.12.479.271.704.42a6.294 6.294 0 012.097 2.502c.42.914.615 1.934.631 2.938.014 1.079-.18 2.157-.645 3.146a6.42 6.42 0 01-2.638 2.832c.09.03.18.045.271.075.225.044.449.074.688.074 1.468.045 2.892-.66 3.94-1.647.195-.18.375-.375.54-.585.225-.27.435-.54.614-.823.239-.375.435-.75.614-1.154a8.112 8.112 0 00.509-1.664c.196-1.004.211-2.022.149-3.026-.135-2.022-.673-4.045-1.842-5.724a9.054 9.054 0 00-.555-.719 9.868 9.868 0 00-1.063-1.034 8.477 8.477 0 00-1.363-.915 9.927 9.927 0 00-1.692-.598l-.3-.06c-.209-.03-.42-.044-.634-.06a8.453 8.453 0 00-1.015.016c-.704.045-1.412.16-2.112.337C5.799 1.227 2.863 3.566 1.3 6.67A11.834 11.834 0 00.238 9.801a11.81 11.81 0 00-.104 3.775c.12 1.02.374 2.023.778 2.977.227.57.511 1.124.825 1.648 1.094 1.783 2.683 3.236 4.51 4.24.688.39 1.408.69 2.157.944.226.074.45.15.689.21z" />
          </svg>

          <span>JSON</span>
        </div>
      );

    case "webmanifest":
      return (
        <div className="flex flex-row items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
            <path d="M20.597 7.482L24 16.518h-2.51L20.91 14.9h-3.246l.694-1.754h2.002l-.95-2.66 1.188-3.004zm-8.111 0l1.772 5.84 2.492-5.84h2.415l-3.643 9.036H13.14l-1.64-5.237-1.72 5.237H7.404L6.17 14.402l1.214-3.742 1.342 2.661 1.903-5.839h1.857zm-8.746 0c1.064 0 1.872.305 2.424.917a2.647 2.647 0 01.28.368L5.37 12.08l-.385 1.185c-.352.1-.753.151-1.204.151H2.293v3.102H0V7.482zM3.16 9.235h-.866v2.428h.86c.557 0 .94-.12 1.148-.358.19-.215.284-.506.284-.873 0-.364-.107-.654-.323-.871-.216-.217-.583-.326-1.103-.326z" />
          </svg>

          <span>WebManifest</span>
        </div>
      );

    case "php":
      return (
        <div className="flex flex-row items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
            <path d="M2.15 16.78h1.57a.14.14 0 00.14-.12l.35-1.82h1.22a4.88 4.88 0 001.51-.2A2.79 2.79 0 008 14a3.18 3.18 0 00.67-.85 3.43 3.43 0 00.36-1 2.43 2.43 0 00-.41-2.16 2.64 2.64 0 00-2.09-.78h-3a.16.16 0 00-.15.13L2 16.6a.19.19 0 000 .13.17.17 0 00.15.05zM5 10.62h1a1.45 1.45 0 011.08.29c.17.18.2.52.11 1a1.81 1.81 0 01-.57 1.12 2.17 2.17 0 01-1.33.33h-.8zm9.8-.95a2.7 2.7 0 00-1.88-.51h-1.19l.33-1.76a.15.15 0 000-.13.16.16 0 00-.11 0h-1.57a.14.14 0 00-.14.12l-1.38 7.27a.13.13 0 000 .12.13.13 0 00.11.06h1.54a.14.14 0 00.14-.13l.77-4.07h1.11c.45 0 .61.1.66.16a.81.81 0 010 .62l-.61 3.24a.13.13 0 000 .12.14.14 0 00.11.06h1.56a.16.16 0 00.15-.13l.64-3.4a1.7 1.7 0 00-.24-1.64zm4.52-.51h-3.13a.14.14 0 00-.15.13l-1.46 7.31a.16.16 0 000 .13.14.14 0 00.11.05h1.63a.14.14 0 00.15-.12l.37-1.82h1.27a5.28 5.28 0 001.56-.2 3 3 0 001.18-.64 3.31 3.31 0 00.7-.85 3.45 3.45 0 00.37-1 2.38 2.38 0 00-.42-2.16 2.81 2.81 0 00-2.18-.83zm.62 2.77a1.83 1.83 0 01-.6 1.12 2.28 2.28 0 01-1.37.33h-.8l.54-2.76h1a1.6 1.6 0 011.13.29c.16.18.16.52.1 1.02z" />
          </svg>

          <span>PHP</span>
        </div>
      );

    case "html":
      return (
        <div className="flex flex-row items-center gap-2">
          <svg
            viewBox="0 0 384 512"
            fill="currentColor"
            height="1em"
            width="1em"
          >
            <path d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z" />
          </svg>

          <span>Single HTML</span>
        </div>
      );
  }

  return <></>;
}