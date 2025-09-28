import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 16,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="1" width="22" height="22" rx="6" fill="white" />
          <rect
            x="3.5"
            y="3.5"
            width="17"
            height="17"
            rx="5.5"
            stroke="black"
          />
          <rect x="6" y="6" width="6" height="6" rx="3" fill="black" />
          <rect
            x="12"
            y="12"
            width="6"
            height="6"
            rx="3"
            fill="black"
            fill-opacity="0.2"
          />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
