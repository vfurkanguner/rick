import { SVGProps } from "react";

const IconCaretDown = (props: SVGProps<SVGSVGElement>) => {
  const { width, height, stroke } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3L9 9L12 6L15 3H3Z"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default IconCaretDown;
