import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Popover, PopoverProps, SxProps, Theme } from "@mui/material";
import {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useState,
} from "react";
import { AvatarContainer } from "../layout/Navbar/Navbar-styles.tsx";

export interface PopMenuProps {
  MenuHeader: React.ReactNode;
  containerSX?: SxProps<Theme>;
  showExpandIcon?: boolean;
  popoverProps?: PopoverProps;
}

export type PopMenuRefType = {
  closePopover: () => void;
};

export const PopMenu = forwardRef<
  PopMenuRefType,
  PropsWithChildren<PopMenuProps>
>(
  (
    {
      containerSX,
      popoverProps,
      MenuHeader,
      showExpandIcon = true,
      children,
    }: PropsWithChildren<PopMenuProps>,
    ref
  ) => {
    const [isOpenUserDropdown, setIsOpenUserDropdown] =
      useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const openPopover = (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.currentTarget as unknown as HTMLButtonElement | null;

      setAnchorEl(target);
      setIsOpenUserDropdown(true);
    };

    const closePopover = () => {
      setAnchorEl(null);
      setIsOpenUserDropdown(false);
    };

    useImperativeHandle(ref, () => ({
      closePopover: () => closePopover(),
    }));

    return (
      <>
        <AvatarContainer sx={containerSX} onClick={openPopover}>
          {MenuHeader}
          {showExpandIcon && <ExpandMoreIcon sx={{ color: "#ACB6BF" }} />}
        </AvatarContainer>
        <Popover
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          {...popoverProps}
          open={isOpenUserDropdown}
          anchorEl={anchorEl}
          onClose={closePopover}
        >
          <Box sx={{ display: "contents" }}>{children}</Box>
        </Popover>
      </>
    );
  }
);
