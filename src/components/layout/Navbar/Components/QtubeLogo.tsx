import { useNavigate } from "react-router-dom";
import Logo from "../../../../assets/img/logo.webp";
import {
  addFilteredVideos,
  setFilterValue,
  setIsFiltering,
} from "../../../../state/features/videoSlice.ts";
import { LogoContainer, ThemeSelectRow } from "../Navbar-styles.tsx";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";

export const QtubeLogo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isScreenSmall = !useMediaQuery(`(min-width:600px)`);

  return (
    <ThemeSelectRow>
      <LogoContainer
        onClick={() => {
          navigate("/");
          dispatch(setIsFiltering(false));
          dispatch(setFilterValue(""));
          dispatch(addFilteredVideos([]));
        }}
      >
        <img
          src={Logo}
          style={{
            width: isScreenSmall ? "50px" : "auto",
            height: "45px",
            padding: "2px",
            marginTop: "5px",
          }}
        />
      </LogoContainer>
    </ThemeSelectRow>
  );
};
