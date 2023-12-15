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
  const [listOfUnsuccessfulPublishes, setListOfUnSuccessfulPublishes] = useState<
  any[]
>([]);
  const [currentlyInPublish, setCurrentlyInPublish] = useState(null);
  const hasStarted = useRef(false);
  const publish = useCallback(async (pub: any) => {
    const lengthOfResources = pub?.resources?.length
    const lengthOfTimeout = lengthOfResources * 30000
    return await qortalRequestWithTimeout(pub, lengthOfTimeout);
  }, []);
  const [isPublishing, setIsPublishing] = useState(true)

  const handlePublish = useCallback(
    async (pub: any) => {
      try {
        setCurrentlyInPublish(pub?.identifier);
        setIsPublishing(true)
        const res = await publish(pub);
 
          onSubmit()
          setListOfUnSuccessfulPublishes([])
       
      } catch (error) {
        const unsuccessfulPublishes = error?.error?.unsuccessfulPublishes || []
        console.log({ error });
        
        
        if(unsuccessfulPublishes?.length > 0){
          setListOfUnSuccessfulPublishes(unsuccessfulPublishes)
          
        }
      } finally {
      
        setIsPublishing(false)
      }
    },
    [publish]
  );

  const retry = ()=> {
    let newlistOfMultiplePublishes = [];
    listOfUnsuccessfulPublishes?.forEach((item)=> {
            const findPub = publishes?.resources.find((res)=> res?.identifier === item.identifier)
            if(findPub){
              newlistOfMultiplePublishes.push(findPub)
            }
          })
          const multiplePublish = {
            action: "PUBLISH_MULTIPLE_QDN_RESOURCES",
            resources: newlistOfMultiplePublishes
          };
          handlePublish(multiplePublish)
  }

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
          const unpublished = listOfUnsuccessfulPublishes.map(item => item?.identifier)
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
              {!isPublishing && hasStarted.current && (
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
              )}
              
            </Box>
          );
        })}
      {!isPublishing && listOfUnsuccessfulPublishes.length > 0 && (
        <>
           <Typography sx={{
            marginTop: '20px',
            fontSize: '16px'
           }}>Some files were not published. Please try again. It's important that all the files get published. Maybe wait a couple minutes if the error keeps occurring</Typography>
        <Button variant="contained" onClick={()=> {
          retry()
        }}>Try again</Button>
        </>
      )}
       
      </ModalBody>
    </Modal>
  );
};
