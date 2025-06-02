/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { CircleSVG } from "../../../assets/svgs/CircleSVG.tsx";
import { EmptyCircleSVG } from "../../../assets/svgs/EmptyCircleSVG.tsx";
import { styled } from "@mui/system";

interface Publish {
  resources: any[];
  action: string;
}

interface MultiplePublishProps {
  publishes: Publish;
  isOpen: boolean;
  onSubmit: () => void;
  onError: (message?: string) => void;
}
export const MultiplePublish = ({
  publishes,
  isOpen,
  onSubmit,
  onError,
}: MultiplePublishProps) => {
  const theme = useTheme();
  const listOfSuccessfulPublishesRef = useRef([]);
  const [listOfSuccessfulPublishes, setListOfSuccessfulPublishes] = useState<
    any[]
  >([]);
  const [listOfUnsuccessfulPublishes, setListOfUnSuccessfulPublishes] =
    useState<any[]>([]);
  const [currentlyInPublish, setCurrentlyInPublish] = useState(null);
  const hasStarted = useRef(false);
  const publish = useCallback(async (pub: any) => {
    const lengthOfResources = pub?.resources?.length;
    const lengthOfTimeout = lengthOfResources * 1200000;  // Time out in QR, Seconds = 20 Minutes
    return await qortalRequestWithTimeout(pub, lengthOfTimeout);
  }, []);
  const [isPublishing, setIsPublishing] = useState(true);

  const handlePublish = useCallback(
    async (pub: any) => {
      try {
        setCurrentlyInPublish(pub?.identifier);
        setIsPublishing(true);
        const res = await publish(pub);

        onSubmit();
        setListOfUnSuccessfulPublishes([]);
      } catch (error: any) {
        const unsuccessfulPublishes = error?.error?.unsuccessfulPublishes || [];
        if (error?.error === "User declined request") {
          onError();
          return;
        }

        if (error?.error === "The request timed out") {
          onError("The request timed out");

          return;
        }

        if (unsuccessfulPublishes?.length > 0) {
          setListOfUnSuccessfulPublishes(unsuccessfulPublishes);
        }
      } finally {
        setIsPublishing(false);
      }
    },
    [publish]
  );

  const retry = () => {
    const newlistOfMultiplePublishes: any[] = [];
    listOfUnsuccessfulPublishes?.forEach(item => {
      const findPub = publishes?.resources.find(
        (res: any) => res?.identifier === item.identifier
      );
      if (findPub) {
        newlistOfMultiplePublishes.push(findPub);
      }
    });
    const multiplePublish = {
      ...publishes,
      resources: newlistOfMultiplePublishes,
    };
    handlePublish(multiplePublish);
  };

  const startPublish = useCallback(
    async (pubs: any) => {
      await handlePublish(pubs);
    },
    [handlePublish, onSubmit, listOfSuccessfulPublishes, publishes]
  );

  useEffect(() => {
    if (publishes && !hasStarted.current) {
      hasStarted.current = true;
      startPublish(publishes);
    }
  }, [startPublish, publishes, listOfSuccessfulPublishes]);

  return (
    <Modal
      open={isOpen}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <ModalBody
        sx={{
          minHeight: "50vh",
        }}
      >
        {publishes?.resources?.map((publish: any) => {
          const unpublished = listOfUnsuccessfulPublishes.map(
            item => item?.identifier
          );
          return (
            <Box
              key={publish?.identifier}
              sx={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>{publish?.identifier}</Typography>
              {!isPublishing && hasStarted.current ? (
                <>
                  {!unpublished.includes(publish.identifier) ? (
                    <CircleSVG
                      color={theme.palette.text.primary}
                      height="24px"
                      width="24px"
                    />
                  ) : (
                    <EmptyCircleSVG
                      color={theme.palette.text.primary}
                      height="24px"
                      width="24px"
                    />
                  )}
                </>
              ) : (
                <CircularProgress size={16} color="secondary" />
              )}
            </Box>
          );
        })}
        {!isPublishing && listOfUnsuccessfulPublishes.length > 0 && (
          <>
            <Typography
              sx={{
                marginTop: "20px",
                fontSize: "16px",
              }}
            >
              Some files were not published. Please try again. It's important
              that all the files get published. Maybe wait a couple minutes if
              the error keeps occurring
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                retry();
              }}
            >
              Try again
            </Button>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export const ModalBody = styled(Box)(({ theme }) => ({
  position: "absolute",
  backgroundColor: theme.palette.background.default,
  borderRadius: "4px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  maxWidth: "900px",
  padding: "15px 35px",
  display: "flex",
  flexDirection: "column",
  gap: "17px",
  overflowY: "auto",
  maxHeight: "95vh",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 4px 5px 0px hsla(0,0%,0%,0.14),  0px 1px 10px 0px hsla(0,0%,0%,0.12),  0px 2px 4px -1px hsla(0,0%,0%,0.2)"
      : "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.paper,
  },
  "&::-webkit-scrollbar-track:hover": {
    backgroundColor: theme.palette.background.paper,
  },
  "&::-webkit-scrollbar": {
    width: "16px",
    height: "10px",
    backgroundColor: theme.palette.mode === "light" ? "#f6f8fa" : "#292d3e",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.mode === "light" ? "#d3d9e1" : "#575757",
    borderRadius: "8px",
    backgroundClip: "content-box",
    border: "4px solid transparent",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#b7bcc4" : "#474646",
  },
}));
