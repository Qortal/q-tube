import { Box, Tooltip, TooltipProps } from "@mui/material";
import { PropsWithChildren } from "react";
import { fontSizeSmall } from "../constants/Misc";

export interface CustomFontTooltipProps extends TooltipProps {
  fontSize?: string;
}
export const CustomFontTooltip = ({
  fontSize,
  title,
  children,
  ...props
}: PropsWithChildren<CustomFontTooltipProps>) => {
  if (!fontSize) fontSize = "160%";
  const text = <Box sx={{ fontSize: fontSize }}>{title}</Box>;

  //   put controls into individual components
  return (
    <Tooltip title={text} {...props} sx={{ display: "contents", ...props.sx }}>
      <div>{children}</div>
    </Tooltip>
  );
};
