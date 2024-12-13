import { useDispatch } from "react-redux";
import { headerIconSize, menuIconSize } from "../../../../constants/Misc.ts";
import { setEditPlaylist } from "../../../../state/features/videoSlice.ts";
import { StyledButton } from "../../../Publish/PublishVideo/PublishVideo-styles.tsx";
import { PublishVideo } from "../../../Publish/PublishVideo/PublishVideo.tsx";
import {
  AvatarContainer,
  DropdownContainer,
  DropdownText,
  NavbarName,
} from "../Navbar-styles.tsx";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { PopMenu, PopMenuRefType } from "../../../common/PopMenu.tsx";
import { useRef } from "react";
import { useMediaQuery } from "@mui/material";

export interface PublishButtonsProps {
  isDisplayed: boolean;
}
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

export const PublishMenu = ({ isDisplayed }: PublishButtonsProps) => {
  const dispatch = useDispatch();
  const popMenuRef = useRef<PopMenuRefType>(null);

  const isScreenSmall = !useMediaQuery(`(min-width:600px)`);
  return (
    <>
      {isDisplayed && (
        <PopMenu
          MenuHeader={
            <>
              {!isScreenSmall && (
                <NavbarName sx={{ marginRight: "5px" }}>Publish</NavbarName>
              )}
              <AddBoxIcon
                sx={{
                  color: "DarkGreen",
                  width: headerIconSize,
                  height: headerIconSize,
                }}
              />
            </>
          }
          ref={popMenuRef}
        >
          <DropdownContainer>
            <PublishVideo afterClose={popMenuRef?.current?.closePopover} />
          </DropdownContainer>
          <DropdownContainer onClick={popMenuRef?.current?.closePopover}>
            <StyledButton
              color="primary"
              startIcon={
                <PlaylistAddIcon
                  sx={{
                    color: "#00BFFF",
                    width: menuIconSize,
                    height: menuIconSize,
                  }}
                />
              }
              onClick={() => {
                dispatch(setEditPlaylist({ mode: "new" }));
              }}
            >
              Playlist
            </StyledButton>
          </DropdownContainer>
        </PopMenu>
      )}
    </>
  );
};
