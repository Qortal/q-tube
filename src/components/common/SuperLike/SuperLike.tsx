import React, { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  InputAdornment,
  InputLabel,
  Modal,
  Tooltip,
} from "@mui/material";
import qortImg from "../../../assets/img/qort.png";
import { MultiplePublish } from "../MultiplePublish/MultiplePublish";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../../state/features/notificationsSlice";
import ShortUniqueId from "short-unique-id";
import { objectToBase64 } from "../../../utils/toBase64";
import {
  FOR,
  FOR_SUPER_LIKE,
  QTUBE_VIDEO_BASE,
  SUPER_LIKE_BASE,
  minPriceSuperlike,
} from "../../../constants";
import { CommentInput } from "../Comments/Comments-styles";
import {
  CrowdfundActionButton,
  CrowdfundActionButtonRow,
  ModalBody,
  NewCrowdfundTitle,
  Spacer,
} from "../../UploadVideo/Upload-styles";
import { utf8ToBase64 } from "../SuperLikesList/CommentEditor";
import { RootState } from "../../../state/store";

const uid = new ShortUniqueId({ length: 4 });

export const SuperLike = ({
  onSuccess,
  name,
  service,
  identifier,
  totalAmount,
  numberOfSuperlikes,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(10);
  const [comment, setComment] = useState<string>("");
  const username = useSelector((state: RootState) => state.auth?.user?.name);

  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);
  const [publishes, setPublishes] = useState<any[]>([]);

  const dispatch = useDispatch();

  const resetValues = () => {
    setAmount(0);
    setComment("");
    setPublishes([]);
  };
  const onClose = () => {
    resetValues();
    setIsOpen(false);
  };

  async function publishSuperLike() {
    try {
      if (!username) throw new Error("You need a name to publish");
      if (!name) throw new Error("Could not retrieve content creator's name");

      let resName = await qortalRequest({
        action: "GET_NAME_DATA",
        name: name,
      });

      const address = resName.owner;
      if (!identifier) throw new Error("Could not retrieve id of video post");
      //   if (comment.length > 200) throw new Error("Comment needs to be under 200 characters")

      if (!address)
        throw new Error("Could not retrieve content creator's address");
      if (!amount || amount < minPriceSuperlike)
        throw new Error(
          `The amount needs to be at least ${minPriceSuperlike} QORT`
        );

      let listOfPublishes = [];

      const res = await qortalRequest({
        action: "SEND_COIN",
        coin: "QORT",
        destinationAddress: address,
        amount: amount,
      });

      let metadescription = `**sig:${
        res.signature
      };${FOR}:${name}_${FOR_SUPER_LIKE};nm:${name.slice(
        0,
        20
      )};id:${identifier.slice(-30)}**`;

      const id = uid();
      const identifierSuperLike = `${SUPER_LIKE_BASE}${identifier.slice(
        0,
        39
      )}_${id}`;

      const superLikeToBase64 = await objectToBase64({
        comment,
        transactionReference: res.signature,
        notificationInformation: {
          name,
          identifier,
          for: `${name}_${FOR_SUPER_LIKE}`,
        },
        about:
          "Super likes are a way to suppert your favorite content creators. Attach a message to the Super like and have your message seen before normal comments. There is a minimum amount for a Super like. Each Super like is verified before displaying to make there aren't any non-paid Super likes",
      });
      // Description is obtained from raw data
      //   const base64 = utf8ToBase64(comment);

      const requestBodyJson: any = {
        action: "PUBLISH_QDN_RESOURCE",
        name: username,
        service: "BLOG_COMMENT",
        data64: superLikeToBase64,
        title: "",
        description: metadescription,
        identifier: identifierSuperLike,
        tag1: SUPER_LIKE_BASE,
        filename: `superlike_metadata.json`,
      };

      listOfPublishes.push(requestBodyJson);

      setPublishes(listOfPublishes);
      setIsOpenMultiplePublish(true);
    } catch (error: any) {
      let notificationObj: any = null;
      if (typeof error === "string") {
        notificationObj = {
          msg: error || "Failed to publish Super Like",
          alertType: "error",
        };
      } else if (typeof error?.error === "string") {
        notificationObj = {
          msg: error?.error || "Failed to publish Super Like",
          alertType: "error",
        };
      } else {
        notificationObj = {
          msg: error?.message || "Failed to publish Super Like",
          alertType: "error",
        };
      }
      if (!notificationObj) return;
      dispatch(setNotification(notificationObj));

      throw new Error("Failed to publish Super Like");
    }
  }
  return (
    <>
      <Box
        onClick={() => {
          if (username === name) {
            dispatch(
              setNotification({
                msg: "You cannot send yourself a Super like",
                alertType: "error",
              })
            );
            return;
          }
          setIsOpen(true);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {numberOfSuperlikes === 0 ? null : (
          <p
            style={{
              fontSize: "16px",
              userSelect: "none",
              margin: "0px",
              padding: "0px",
            }}
          >
            {totalAmount} QORT from {numberOfSuperlikes} Super Likes
          </p>
        )}

        <Tooltip title="Super Like" placement="top">
          <Box
            sx={{
              padding: "5px",
              borderRadius: "7px",
              gap: "10px",
              display: "flex",
              alignItems: "center",
              outline: "1px gold solid",
            }}
          >
            <ThumbUpIcon
              style={{
                color: "gold",
              }}
            />
            <p
              style={{
                fontSize: "16px",
                margin: "0px",
              }}
            >
              Super Like
            </p>
          </Box>
        </Tooltip>
      </Box>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ModalBody>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <NewCrowdfundTitle>Super Like</NewCrowdfundTitle>
          </Box>
          <DialogContent>
            <Box
              sx={{
                width: "300px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box>
                <InputLabel htmlFor="standard-adornment-amount">
                  Amount in QORT (min 10 QORT)
                </InputLabel>
                <Input
                  id="standard-adornment-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(+e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        style={{
                          height: "15px",
                          width: "15px",
                        }}
                        src={qortImg}
                      />
                    </InputAdornment>
                  }
                />
              </Box>
            </Box>
            <Spacer height="25px" />
            <Box>
              <CommentInput
                id="standard-multiline-flexible"
                label="Your comment"
                multiline
                maxRows={8}
                variant="filled"
                value={comment}
                inputProps={{
                  maxLength: 500,
                }}
                InputLabelProps={{ style: { fontSize: "18px" } }}
                onChange={(e) => setComment(e.target.value)}
              />
            </Box>
          </DialogContent>
          <CrowdfundActionButtonRow>
            <CrowdfundActionButton
              onClick={() => {
                setIsOpen(false);
                resetValues();
                onClose();
              }}
              variant="contained"
              color="error"
            >
              Cancel
            </CrowdfundActionButton>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <CrowdfundActionButton
                variant="contained"
                onClick={() => {
                  publishSuperLike();
                }}
              >
                Publish Super Like
              </CrowdfundActionButton>
            </Box>
          </CrowdfundActionButtonRow>
        </ModalBody>
      </Modal>
      {isOpenMultiplePublish && (
        <MultiplePublish
          isOpen={isOpenMultiplePublish}
          onSubmit={() => {
            onSuccess({
              name: username,
              message: comment,
              service,
              identifier,
              amount: +amount,
              created: Date.now(),
            });
            setIsOpenMultiplePublish(false);
            onClose();

            dispatch(
              setNotification({
                msg: "Super like published",
                alertType: "success",
              })
            );
          }}
          publishes={publishes}
        />
      )}
    </>
  );
};
