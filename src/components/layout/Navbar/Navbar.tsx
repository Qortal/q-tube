import React, { useState, useRef } from "react";
import { Box, Button, Input, Popover, useTheme } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { BlockedNamesModal } from "../../common/BlockedNamesModal/BlockedNamesModal";
import AddBoxIcon from "@mui/icons-material/AddBox";

import {
  AvatarContainer,
  CustomAppBar,
  DropdownContainer,
  DropdownText,
  AuthenticateButton,
  NavbarName,
  LightModeIcon,
  DarkModeIcon,
  ThemeSelectRow,
  LogoContainer,
} from "./Navbar-styles";
import { AccountCircleSVG } from "../../../assets/svgs/AccountCircleSVG";
import BackspaceIcon from "@mui/icons-material/Backspace";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

import { DownloadTaskManager } from "../../common/DownloadTaskManager";
import Logo from "../../../assets/img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  addFilteredVideos,
  setEditPlaylist,
  setFilterValue,
  setIsFiltering,
} from "../../../state/features/videoSlice";
import { RootState } from "../../../state/store";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { UploadVideo } from "../../UploadVideo/UploadVideo";
import { StyledButton } from "../../UploadVideo/Upload-styles";
import { Notifications } from "../../common/Notifications/Notifications";
interface Props {
  isAuthenticated: boolean;
  userName: string | null;
  userAvatar: string;
  authenticate: () => void;
  setTheme: (val: string) => void;
}

const NavBar: React.FC<Props> = ({
  isAuthenticated,
  userName,
  userAvatar,
  authenticate,
  setTheme,
}) => {
  const windowSize = useWindowSize();
  const searchValRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openUserDropdown, setOpenUserDropdown] = useState<boolean>(false);
  const [isOpenBlockedNamesModal, setIsOpenBlockedNamesModal] =
    useState<boolean>(false);

  const [anchorElNotification, setAnchorElNotification] =
    React.useState<HTMLButtonElement | null>(null);
  const filterValue = useSelector(
    (state: RootState) => state.video.filterValue
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget as unknown as HTMLButtonElement | null;
    setAnchorEl(target);
  };
  const openNotificationPopover = (event: any) => {
    const target = event.currentTarget as unknown as HTMLButtonElement | null;
    setAnchorElNotification(target);
  };
  const closeNotificationPopover = () => {
    setAnchorElNotification(null);
  };

  const openPopover = Boolean(anchorElNotification);
  const idNotification = openPopover
    ? "simple-popover-notification"
    : undefined;

  const handleCloseUserDropdown = () => {
    setAnchorEl(null);
    setOpenUserDropdown(false);
  };

  const onCloseBlockedNames = () => {
    setIsOpenBlockedNamesModal(false);
  };

  return (
    <CustomAppBar position="sticky" elevation={2}>
      <ThemeSelectRow>
        <LogoContainer
          onClick={() => {
            navigate("/");
            dispatch(setIsFiltering(false));
            dispatch(setFilterValue(""));
            dispatch(addFilteredVideos([]));
            searchValRef.current = "";
            if (!inputRef.current) return;
            inputRef.current.value = "";
          }}
        >
          <img
            src={Logo}
            style={{
              width: "auto",
              height: "55px",
              padding: "2px",
            }}
          />
        </LogoContainer>
      </ThemeSelectRow>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* {windowSize.width <= 600 ? (
           <Box
           sx={{
             display: 'flex',
             alignItems: 'center',
             gap: 1
           }}
           className="myClassOver600"
          
         
         >
         <Box  onClick={openNotificationPopover}>
         <SearchIcon
             sx={{
               cursor: 'pointer',
               display: 'flex'
             }}
             
           />
         </Box>
          {filterValue && (
             <BackspaceIcon
             sx={{
               cursor: 'pointer'
             }}
             onClick={() => {
               dispatch(setIsFiltering(false))
               dispatch(setFilterValue(''))
               dispatch(addFilteredVideos([]))
               searchValRef.current = ''
               if (!inputRef.current) return
               inputRef.current.value = ''
             }}
           />
          )}
         
         </Box>
        ): (
          <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          className="myClassUnder600"
        >
          <Input
            id="standard-adornment-name"
            inputRef={inputRef}
            onChange={(e) => {
              searchValRef.current = e.target.value
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.keyCode === 13) {
                if (!searchValRef.current) {
                  dispatch(setIsFiltering(false))
                  dispatch(setFilterValue(''))
                  dispatch(addFilteredVideos([]))
                  searchValRef.current = ''
                  if (!inputRef.current) return
                  inputRef.current.value = ''
                  return
                }
                navigate('/')
                dispatch(setIsFiltering(true))
                dispatch(addFilteredVideos([]))
                dispatch(setFilterValue(searchValRef.current))
              }
            }}
            placeholder="Search"
            sx={{
              '&&:before': {
                borderBottom: 'none'
              },
              '&&:after': {
                borderBottom: 'none'
              },
              '&&:hover:before': {
                borderBottom: 'none'
              },
              '&&.Mui-focused:before': {
                borderBottom: 'none'
              },
              '&&.Mui-focused': {
                outline: 'none'
              },
              fontSize: '18px'
            }}
          />

          <SearchIcon
            sx={{
              cursor: 'pointer'
            }}
            onClick={() => {
              if (!searchValRef.current) {
                dispatch(setIsFiltering(false))
                dispatch(setFilterValue(''))
                dispatch(addFilteredVideos([]))
                searchValRef.current = ''
                if (!inputRef.current) return
                inputRef.current.value = ''
                return
              }
              navigate('/')
              dispatch(setIsFiltering(true))
              dispatch(addFilteredVideos([]))
              dispatch(setFilterValue(searchValRef.current))
            }}
          />
          {filterValue && (
             <BackspaceIcon
             sx={{
               cursor: 'pointer'
             }}
             onClick={() => {
               dispatch(setIsFiltering(false))
               dispatch(setFilterValue(''))
               dispatch(addFilteredVideos([]))
               searchValRef.current = ''
               if (!inputRef.current) return
               inputRef.current.value = ''
             }}
           />
          )}
         
        </Box>
        )} */}

        <Popover
          id={idNotification}
          open={openPopover}
          anchorEl={anchorElNotification}
          onClose={closeNotificationPopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: "5px",
            }}
          >
            <Input
              id="standard-adornment-name"
              inputRef={inputRef}
              onChange={(e) => {
                searchValRef.current = e.target.value;
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.keyCode === 13) {
                  if (!searchValRef.current) {
                    dispatch(setIsFiltering(false));
                    dispatch(setFilterValue(""));
                    dispatch(addFilteredVideos([]));
                    searchValRef.current = "";
                    if (!inputRef.current) return;
                    inputRef.current.value = "";
                    return;
                  }
                  navigate("/");
                  dispatch(setIsFiltering(true));
                  dispatch(addFilteredVideos([]));
                  dispatch(setFilterValue(searchValRef.current));
                }
              }}
              placeholder="Search"
              sx={{
                "&&:before": {
                  borderBottom: "none",
                },
                "&&:after": {
                  borderBottom: "none",
                },
                "&&:hover:before": {
                  borderBottom: "none",
                },
                "&&.Mui-focused:before": {
                  borderBottom: "none",
                },
                "&&.Mui-focused": {
                  outline: "none",
                },
                fontSize: "18px",
              }}
            />

            <SearchIcon
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                if (!searchValRef.current) {
                  dispatch(setIsFiltering(false));
                  dispatch(setFilterValue(""));
                  dispatch(addFilteredVideos([]));
                  searchValRef.current = "";
                  if (!inputRef.current) return;
                  inputRef.current.value = "";
                  return;
                }
                navigate("/");
                dispatch(setIsFiltering(true));
                dispatch(addFilteredVideos([]));
                dispatch(setFilterValue(searchValRef.current));
              }}
            />
            <BackspaceIcon
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch(setIsFiltering(false));
                dispatch(setFilterValue(""));
                dispatch(addFilteredVideos([]));
                searchValRef.current = "";
                if (!inputRef.current) return;
                inputRef.current.value = "";
              }}
            />
          </Box>
        </Popover>
        {isAuthenticated && userName && (
          <Notifications />
        )}

        <DownloadTaskManager />
        {isAuthenticated && userName && (
          <>
            <AvatarContainer
              onClick={(e: any) => {
                handleClick(e);
                setOpenUserDropdown(true);
              }}
            >
              <NavbarName>{userName}</NavbarName>
              {!userAvatar ? (
                <AccountCircleSVG
                  color={theme.palette.text.primary}
                  width="32"
                  height="32"
                />
              ) : (
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  width="32"
                  height="32"
                  style={{
                    borderRadius: "50%",
                  }}
                />
              )}
              <ExpandMoreIcon id="expand-icon" sx={{ color: "#ACB6BF" }} />
            </AvatarContainer>
          </>
        )}
        <AvatarContainer>
          {isAuthenticated && userName && (
            <>
            <UploadVideo />
          <StyledButton
              color="primary"
              startIcon={<AddBoxIcon />}
              onClick={() => {
                dispatch(setEditPlaylist({mode: 'new'}))
              }}
            >
              create playlist
            </StyledButton>
            </>
          )}
          
          
        </AvatarContainer>

        <Popover
          id={"user-popover"}
          open={openUserDropdown}
          anchorEl={anchorEl}
          onClose={handleCloseUserDropdown}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <DropdownContainer
            onClick={() => {
              setIsOpenBlockedNamesModal(true);
              handleCloseUserDropdown();
            }}
          >
            <PersonOffIcon
              sx={{
                color: "#e35050",
              }}
            />
            <DropdownText>Blocked Names</DropdownText>
          </DropdownContainer>
        </Popover>
        {isOpenBlockedNamesModal && (
          <BlockedNamesModal
            open={isOpenBlockedNamesModal}
            onClose={onCloseBlockedNames}
          />
        )}
      </Box>
    </CustomAppBar>
  );
};

export default NavBar;
