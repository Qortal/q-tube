import ShareIcon from "@mui/icons-material/Share";
import { Box, ButtonBase } from "@mui/material";
import { CustomTooltip } from "./CustomTooltip.tsx";
import { setNotification } from "../../../state/features/notificationsSlice";
import { useDispatch } from "react-redux";

export interface CopyLinkButtonProps {
  link: string;
  tooltipTitle: string;
}
export const CopyLinkButton = ({ link, tooltipTitle }: CopyLinkButtonProps) => {
  const dispatch = useDispatch();
  return (
    <CustomTooltip title={tooltipTitle} placement={"top"} arrow>
      <Box
        sx={{
          cursor: "pointer",
        }}
      >
        <ButtonBase
          onClick={() => {
            navigator.clipboard.writeText(link).then(() => {
              dispatch(
                setNotification({
                  msg: "Copied to clipboard!",
                  alertType: "success",
                })
              );
            });
          }}
        >
          <ShareIcon />
        </ButtonBase>
      </Box>
    </CustomTooltip>
  );
};
