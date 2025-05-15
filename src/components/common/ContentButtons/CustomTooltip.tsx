import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { JSX } from "react";

export const TooltipLine = styled("div")(({ theme }) => ({
  fontSize: "18px",
}));

const CustomWidthTooltipStyles = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 600,
  },
});

export const CustomTooltip = ({ title, ...props }: TooltipProps) => {
  if (typeof title === "string") title = <TooltipLine>{title}</TooltipLine>;

  return <CustomWidthTooltipStyles title={title} {...props} />;
};
