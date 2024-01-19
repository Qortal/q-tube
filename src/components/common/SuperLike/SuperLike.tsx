import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Tooltip,
} from "@mui/material";
import qortImg from "../../../assets/img/qort.png";
import { MultiplePublish } from "../MultiplePublish/MultiplePublishAll";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../../state/features/notificationsSlice";
import ShortUniqueId from "short-unique-id";
import { objectToBase64 } from "../../../utils/toBase64";
import { minPriceSuperlike } from "../../../constants/Misc.ts";
import { CommentInput } from "../Comments/Comments-styles";
import {
  CrowdfundActionButton,
  CrowdfundActionButtonRow,
  ModalBody,
  NewCrowdfundTitle,
  Spacer,
} from "../../PublishVideo/PublishVideo-styles.tsx";
import { utf8ToBase64 } from "../SuperLikesList/CommentEditor";
import { RootState } from "../../../state/store";
import {
  FOR,
  FOR_SUPER_LIKE,
  QTUBE_VIDEO_BASE,
  SUPER_LIKE_BASE,
} from "../../../constants/Identifiers.ts";
import BoundedNumericTextField from "../../../utils/BoundedNumericTextField.tsx";
import { numberToInt, truncateNumber } from "../../../utils/numberFunctions.ts";
import { getUserBalance } from "../../../utils/qortalRequestFunctions.ts";

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

  const [superlikeDonationAmount, setSuperlikeDonationAmount] =
    useState<number>(10);
  const [qortalDevDonationAmount, setQortalDevDonationAmount] =
    useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<string>("");

  const [comment, setComment] = useState<string>("");
  const username = useSelector((state: RootState) => state.auth?.user?.name);
  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);
  const [publishes, setPublishes] = useState<any>(null);
  const dispatch = useDispatch();

  const resetValues = () => {
    setSuperlikeDonationAmount(0);
    setComment("");
    setPublishes(null);
  };
  const onClose = () => {
    resetValues();
    setIsOpen(false);
  };

  async function publishSuperLike() {
    try {
      if (!username) throw new Error("You need a name to publish");
      if (!name) throw new Error("Could not retrieve content creator's name");
      const estimatedTransactionFees = 0.1;
      const donationExceedsBalance =
        superlikeDonationAmount +
          qortalDevDonationAmount +
          estimatedTransactionFees >=
        +currentBalance;
      if (donationExceedsBalance) {
        throw new Error("Total donations exceeds current balance");
      }

      let resName = await qortalRequest({
        action: "GET_NAME_DATA",
        name: name,
      });

      const address = resName.owner;
      if (!identifier) throw new Error("Could not retrieve id of video post");
      //   if (comment.length > 200) throw new Error("Comment needs to be under 200 characters")

      if (!address)
        throw new Error("Could not retrieve content creator's address");
      if (
        !superlikeDonationAmount ||
        superlikeDonationAmount < minPriceSuperlike
      )
        throw new Error(
          `The amount needs to be at least ${minPriceSuperlike} QORT`
        );

      let listOfPublishes = [];

      const res = await qortalRequest({
        action: "SEND_COIN",
        coin: "QORT",
        destinationAddress: address,
        amount: superlikeDonationAmount,
      });

      const devDonation = qortalDevDonationAmount > 0;
      if (devDonation) {
        const devFundName = "DevFund";

        let devFundNameData = await qortalRequest({
          action: "GET_NAME_DATA",
          name: devFundName,
        });

        const devFundAddress = devFundNameData.owner;
        const resDevFund = await qortalRequest({
          action: "SEND_COIN",
          coin: "QORT",
          destinationAddress: devFundAddress,
          amount: qortalDevDonationAmount,
        });
      }
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
          "Super likes are a way to suppert your favorite content creators. Attach a message to the Super like and have your message seen before normal comments. There is a minimum superLikeAmount for a Super like. Each Super like is verified before displaying to make there aren't any non-paid Super likes",
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

      const multiplePublish = {
        action: "PUBLISH_MULTIPLE_QDN_RESOURCES",
        resources: [...listOfPublishes],
      };
      setPublishes(multiplePublish);

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

  useEffect(() => {
    getUserBalance().then(foundBalance => {
      setCurrentBalance(truncateNumber(foundBalance, 2));
    });
  }, []);

  const textFieldWidth = "350px";
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
            <Box>
              <InputLabel htmlFor="standard-adornment-amount">
                Amount in QORT (min 10 QORT)
              </InputLabel>
              <BoundedNumericTextField
                minValue={10}
                initialValue={minPriceSuperlike.toString()}
                maxValue={numberToInt(+currentBalance)}
                allowDecimals={false}
                allowNegatives={false}
                id="standard-adornment-amount"
                value={superlikeDonationAmount}
                afterChange={(e: string) => setSuperlikeDonationAmount(+e)}
                InputProps={{
                  style: { fontSize: 30, width: textFieldWidth },
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        style={{
                          height: "40px",
                          width: "40px",
                        }}
                        src={qortImg}
                        alt={"Qort Icon"}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <div>Current QORT Balance is: {currentBalance}</div>
              <Spacer height="25px" />

              <CommentInput
                id="standard-multiline-flexible"
                label="Your comment"
                multiline
                minRows={8}
                maxRows={8}
                variant="filled"
                value={comment}
                inputProps={{
                  maxLength: 500,
                }}
                InputLabelProps={{ style: { fontSize: "18px" } }}
                onChange={e => setComment(e.target.value)}
              />
              <Spacer height="50px" />
              <InputLabel
                htmlFor="standard-adornment-amount"
                style={{ paddingBottom: "10px" }}
              >
                Would you like to donate to Qortal Development?
              </InputLabel>
              <BoundedNumericTextField
                minValue={0}
                initialValue={""}
                maxValue={numberToInt(+currentBalance)}
                allowDecimals={false}
                value={superlikeDonationAmount}
                afterChange={(e: string) => setQortalDevDonationAmount(+e)}
                InputProps={{
                  style: { fontSize: 30, width: textFieldWidth },
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        style={{
                          height: "40px",
                          width: "40px",
                        }}
                        src={qortImg}
                        alt={"Qort Icon"}
                      />
                    </InputAdornment>
                  ),
                }}
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
          onError={messageNotification => {
            setIsOpenMultiplePublish(false);
            setPublishes(null);
            if (messageNotification) {
              dispatch(
                setNotification({
                  msg: messageNotification,
                  alertType: "error",
                })
              );
            }
          }}
          onSubmit={() => {
            onSuccess({
              name: username,
              message: comment,
              service,
              identifier,
              amount: +superlikeDonationAmount,
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
