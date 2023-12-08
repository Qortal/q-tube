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
import { ModalBody } from "../../UploadVideo/Upload-styles";
import { CircleSVG } from "../../../assets/svgs/CircleSVG";
import { EmptyCircleSVG } from "../../../assets/svgs/EmptyCircleSVG";

export const MultiplePublish = ({ publishes, isOpen,  onSubmit }) => {
  const theme = useTheme();
  const listOfSuccessfulPublishesRef = useRef([])
  const [listOfSuccessfulPublishes, setListOfSuccessfulPublishes] = useState<
    any[]
  >([]);
  const [currentlyInPublish, setCurrentlyInPublish] = useState(null);
  const hasStarted = useRef(false);
  const publish = useCallback(async (pub: any) => {
    await qortalRequest(pub);
  }, []);
  const [isPublishing, setIsPublishing] = useState(true)

  const handlePublish = useCallback(
    async (pub: any) => {
      try {
        setCurrentlyInPublish(pub?.identifier);

        await publish(pub);

        setListOfSuccessfulPublishes((prev: any) => [...prev, pub?.identifier]);
        listOfSuccessfulPublishesRef.current = [...listOfSuccessfulPublishesRef.current, pub?.identifier]
      } catch (error) {
        console.log({ error });
        await new Promise<void>((res) => {
          setTimeout(() => {
            res();
          }, 5000);
        });
        // await handlePublish(pub);
      }
    },
    [publish]
  );

  const startPublish = useCallback(
    async (pubs: any) => {
      setIsPublishing(true)
      const filterPubs = pubs.filter((pub)=> !listOfSuccessfulPublishesRef.current.includes(pub.identifier))
      for (const pub of filterPubs) {
        await handlePublish(pub);
       
      }
      
      if(listOfSuccessfulPublishesRef.current.length === pubs.length){
        onSubmit()
      }
      setIsPublishing(false)
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
        {publishes.map((publish: any) => {
          return (
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>{publish?.title}</Typography>
              {publish?.identifier === currentlyInPublish ? (
                <CircularProgress
                  size={20}
                  thickness={2}
                  sx={{
                    color: theme.palette.secondary.main,
                  }}
                />
              ) : listOfSuccessfulPublishes.includes(publish.identifier) ? (
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
            </Box>
          );
        })}
      {!isPublishing && listOfSuccessfulPublishes.length !== publishes.length && (
        <>
           <Typography sx={{
            marginTop: '20px',
            fontSize: '16px'
           }}>Some files were not published. Please try again. It's important that all the files get published. Maybe wait a couple minutes if the error keeps occurring</Typography>
        <Button onClick={()=> {
          startPublish(publishes)
        }}>Try again</Button>
        </>
      )}
       
      </ModalBody>
    </Modal>
  );
};
