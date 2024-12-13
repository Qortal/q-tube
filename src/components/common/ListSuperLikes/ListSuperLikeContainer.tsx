import { Box, Tooltip, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { PopMenu } from "../PopMenu.tsx";
import ListSuperLikes from "./ListSuperLikes";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
export const ListSuperLikeContainer = () => {
  const superlikelist = useSelector(
    (state: RootState) => state.global.superlikelistAll
  );

  const isScreenLarge = useMediaQuery("(min-width:1200px)");
  const superlikeListComponent = (
    <>
      <Typography
        sx={{
          fontSize: "18px",
          color: "gold",
        }}
      >
        Recent Super likes
      </Typography>
      <ListSuperLikes superlikes={superlikelist} />
    </>
  );

  // @ts-ignore
  return (
    <Box sx={{ paddingLeft: "5px" }}>
      {isScreenLarge ? (
        <>{superlikeListComponent}</>
      ) : (
        <PopMenu
          showExpandIcon={false}
          popoverProps={{
            open: undefined,
            sx: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            anchorReference: "none",
          }}
          MenuHeader={
            <Tooltip title={"Show recent Superlikes"} placement={"left"} arrow>
              <Box
                sx={{
                  padding: "5px",
                  borderRadius: "7px",
                  outline: "1px gold solid",
                  height: "53px",
                  position: "absolute",
                  top: "60px",
                  right: "2%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ThumbUpIcon
                  style={{
                    color: "gold",
                  }}
                />
              </Box>
            </Tooltip>
          }
        >
          {superlikeListComponent}
        </PopMenu>
      )}
    </Box>
  );
};
