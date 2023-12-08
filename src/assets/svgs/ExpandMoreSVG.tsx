import { IconTypes } from "./IconTypes";
export const ExpandMoreSVG: React.FC<IconTypes> = ({
  color,
  height,
  width,
  className,
  onClickFunc
}) => {
  return (
    <svg
      onClick={onClickFunc}
      height={height}
      width={width}
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path d="M480-345 240-585l43-43 197 198 197-197 43 43-240 239Z" />
    </svg>
  );
};
