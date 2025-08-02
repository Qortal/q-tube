import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {
  Box,
  DialogContent,
  InputAdornment,
  InputLabel,
  Modal,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ShortUniqueId from 'short-unique-id';
import qortImg from '../../../assets/img/qort.png';
import {
  FOR,
  FOR_SUPER_LIKE,
  SUPER_LIKE_BASE,
} from '../../../constants/Identifiers.ts';
import {
  fontSizeLarge,
  fontSizeMedium,
  minPriceSuperDislike,
} from '../../../constants/Misc.ts';
import BoundedNumericTextField from '../../../utils/BoundedNumericTextField.tsx';
import { numberToInt, truncateNumber } from '../../../utils/numberFunctions.ts';
import { objectToBase64 } from '../../../utils/PublishFormatter.ts';
import { MultiplePublish } from '../../Publish/MultiplePublish/MultiplePublishAll.tsx';
import {
  CrowdfundActionButton,
  CrowdfundActionButtonRow,
  ModalBody,
  NewCrowdfundTitle,
  Spacer,
} from '../../Publish/PublishVideo/PublishVideo-styles.tsx';
import { CommentInput } from '../Comments/Comments-styles.tsx';
import {
  hashWordWithoutPublicSalt,
  useAuth,
  useQortBalance,
  useQortBalance,
} from 'qapp-core';
import { useSetAtom } from 'jotai';
import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';

const uid = new ShortUniqueId({ length: 4 });

export const SuperDislike = ({
  onSuccess,
  name,
  service,
  identifier,
  totalAmount,
  numberOfSuperdislikes,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [superDislikeDonationAmount, setSuperdislikeDonationAmount] =
    useState<number>(minPriceSuperDislike);

  const { value: currentBalance } = useQortBalance();

  const [comment, setComment] = useState<string>('');
  const { name: username } = useAuth();
  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);
  const [publishes, setPublishes] = useState<any>(null);
  const setNotification = useSetAtom(setNotificationAtom);

  const resetValues = () => {
    setSuperdislikeDonationAmount(0);
    setComment('');
    setPublishes(null);
  };
  const onClose = () => {
    resetValues();
    setIsOpen(false);
  };

  async function publishSuperDislike() {
    try {
      if (!username) throw new Error('You need a name to publish');
      if (!name) throw new Error("Could not retrieve content creator's name");
      const estimatedTransactionFees = 0.1;
      const donationExceedsBalance =
        superDislikeDonationAmount + estimatedTransactionFees >=
        +currentBalance;
      if (donationExceedsBalance) {
        throw new Error('Total donations exceeds current balance');
      }

      const resName = await qortalRequest({
        action: 'GET_NAME_DATA',
        name: name,
      });

      const address = resName.owner;
      if (!identifier) throw new Error('Could not retrieve id of video post');
      //   if (comment.length > 200) throw new Error("Comment needs to be under 200 characters")

      if (!address)
        throw new Error("Could not retrieve content creator's address");
      if (
        !superDislikeDonationAmount ||
        superDislikeDonationAmount < minPriceSuperDislike
      )
        throw new Error(
          `The amount is ${superDislikeDonationAmount}, but it needs to be at least ${minPriceSuperDislike} QORT`
        );

      const listOfPublishes: any[] = [];

      const res = await qortalRequest({
        action: 'SEND_COIN',
        coin: 'QORT',
        recipient: address,

        amount: superDislikeDonationAmount,
      });

      const metadescription = `**sig:${
        res.signature
      };${FOR}:${name}_${FOR_SUPER_LIKE};nm:${name.slice(
        0,
        20
      )};id:${identifier.slice(-30)}**`;

      const id = uid.rnd();
      const hashPostId = await hashWordWithoutPublicSalt(identifier, 20);
      const identifierSuperDislike = `${SUPER_LIKE_BASE}${hashPostId}_${id}`;

      const superLikeToBase64 = await objectToBase64({
        comment,
        transactionReference: res.signature,
        notificationInformation: {
          name,
          identifier,
          for: `${name}_${FOR_SUPER_LIKE}`,
        },
        about:
          "Super likes are a way to support your favorite content creators. Attach a message to the Super like and have your message seen before normal comments. There is a minimum superLikeAmount for a Super like. Each Super like is verified before displaying to make there aren't any non-paid Super likes",
      });
      // Description is obtained from raw data
      //   const base64 = utf8ToBase64(comment);

      const requestBodyJson: any = {
        action: 'PUBLISH_QDN_RESOURCE',
        name: username,
        service: 'BLOG_COMMENT',
        data64: superLikeToBase64,
        title: '',
        description: metadescription,
        identifier: identifierSuperDislike,
        tag1: SUPER_LIKE_BASE,
        filename: `superDislike_metadata.json`,
      };

      listOfPublishes.push(requestBodyJson);

      const multiplePublish = {
        action: 'PUBLISH_MULTIPLE_QDN_RESOURCES',
        resources: [...listOfPublishes],
      };
      setPublishes(multiplePublish);

      setIsOpenMultiplePublish(true);
    } catch (error: any) {
      const isError = error instanceof Error;
      const message = isError
        ? error?.message
        : 'Failed to publish Super Dislike';
      const notificationObj: AltertObject = {
        msg: message,
        alertType: 'error',
      };
      setNotification(notificationObj);

      throw new Error('Failed to publish Super Dislike');
    }
  }

  // useEffect(() => {
  //   getUserBalance().then((foundBalance) => {
  //     setCurrentBalance(truncateNumber(foundBalance, 2));
  //   });
  // }, []);

  const isScreenSmall = !useMediaQuery(`(min-width:400px)`);
  const theme = useTheme();
  return (
    <>
      <Box
        onClick={() => {
          if (username === name) {
            const notificationObj: AltertObject = {
              msg: 'You cannot send yourself a Super Dislike',
              alertType: 'error',
            };
            setNotification(notificationObj);

            return;
          }
          setIsOpen(true);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Tooltip title="Super Dislike" placement="top">
          <Box
            sx={{
              padding: '5px',
              borderRadius: '7px',
              gap: '5px',
              display: 'flex',
              alignItems: 'center',
              outline: '1px red solid',
              marginRight: '10px',
              height: '53px',
            }}
          >
            <ThumbDownIcon
              style={{
                color: 'red',
              }}
            />

            {numberOfSuperdislikes === 0 ? null : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                }}
              >
                <span style={{ marginRight: '10px', paddingBottom: '4px' }}>
                  {numberOfSuperdislikes}
                </span>
                <img
                  style={{
                    height: '25px',
                    width: '25px',
                    marginRight: '5px',
                  }}
                  src={qortImg}
                  alt={'Qort Icon'}
                />
                {truncateNumber(totalAmount, 0)}
              </div>
            )}
          </Box>
        </Tooltip>
      </Box>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ModalBody
          sx={{
            width: '90%',
            backgroundColor: '#A58700',
            boxShadow: 'none',
            gap: '0px',
            padding: '0px',
            border: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <NewCrowdfundTitle>Super Dislike</NewCrowdfundTitle>
          </Box>
          <DialogContent sx={{ padding: '10px 12px' }}>
            <Box>
              <InputLabel
                sx={{ color: 'white' }}
                htmlFor="standard-adornment-amount"
              >
                Amount
              </InputLabel>
              <BoundedNumericTextField
                addIconButtons={!isScreenSmall}
                minValue={+minPriceSuperDislike}
                initialValue={minPriceSuperDislike.toString()}
                maxValue={numberToInt(+currentBalance)}
                allowDecimals={false}
                allowNegatives={false}
                id="standard-adornment-amount"
                value={superDislikeDonationAmount}
                afterChange={(e: string) => setSuperdislikeDonationAmount(+e)}
                InputProps={{
                  style: {
                    fontSize: fontSizeMedium,
                    width: '80%',
                    border: `1px solid ${theme.palette.primary.main}`,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        style={{
                          height: '40px',
                          width: '40px',
                        }}
                        src={qortImg}
                        alt={'Qort Icon'}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <img
                  style={{
                    height: '25px',
                    width: '25px',
                  }}
                  src={qortImg}
                  alt={'Qort Icon'}
                />
                Balance: {currentBalance}
              </Box>
              <Spacer height="25px" />

              <CommentInput
                id="standard-multiline-flexible"
                label="Comment Here"
                multiline
                minRows={8}
                maxRows={8}
                variant="filled"
                value={comment}
                InputLabelProps={{
                  style: { fontSize: fontSizeMedium, color: 'white' },
                }}
                inputProps={{
                  maxLength: 500,
                  style: { fontSize: fontSizeLarge },
                }}
                onChange={(e) => setComment(e.target.value)}
                sx={{ border: `1px solid ${theme.palette.primary.main}` }}
              />
            </Box>
          </DialogContent>
          <CrowdfundActionButtonRow>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '10px',
                width: '100%',
              }}
            >
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

              <CrowdfundActionButton
                variant="contained"
                onClick={() => {
                  publishSuperDislike();
                }}
              >
                Publish
              </CrowdfundActionButton>
            </Box>
          </CrowdfundActionButtonRow>
        </ModalBody>
      </Modal>
      {isOpenMultiplePublish && (
        <MultiplePublish
          isOpen={isOpenMultiplePublish}
          onError={(messageNotification) => {
            setIsOpenMultiplePublish(false);
            setPublishes(null);
            if (messageNotification) {
              const notificationObj: AltertObject = {
                msg: messageNotification,
                alertType: 'error',
              };
              setNotification(notificationObj);
            }
          }}
          onSubmit={() => {
            onSuccess({
              name: username,
              message: comment,
              service,
              identifier,
              amount: +superDislikeDonationAmount,
              created: Date.now(),
            });
            setIsOpenMultiplePublish(false);
            onClose();
            const notificationObj: AltertObject = {
              msg: 'Super Dislike published',
              alertType: 'success',
            };
            setNotification(notificationObj);
          }}
          publishes={publishes}
        />
      )}
    </>
  );
};
