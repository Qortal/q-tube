import ThumbUpIcon from '@mui/icons-material/ThumbUp';
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
  minPriceSuperLike,
} from '../../../constants/Misc.ts';
import BoundedNumericTextField from '../../../utils/BoundedNumericTextField.tsx';
import { numberToInt, truncateNumber } from '../../../utils/numberFunctions.ts';
import { objectToBase64 } from '../../../utils/PublishFormatter.ts';
import { getUserBalance } from '../../../utils/qortalRequestFunctions.ts';
import { MultiplePublish } from '../../Publish/MultiplePublish/MultiplePublishAll.tsx';
import {
  CrowdfundActionButton,
  CrowdfundActionButtonRow,
  ModalBody,
  NewCrowdfundTitle,
  Spacer,
} from '../../Publish/PublishVideo/PublishVideo-styles.tsx';
import { CommentInput } from '../Comments/Comments-styles.tsx';
import { hashWordWithoutPublicSalt, useAuth } from 'qapp-core';
import { CustomTooltip } from './CustomTooltip.tsx';
import { useSetAtom } from 'jotai';
import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';

const uid = new ShortUniqueId({ length: 7 });

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
    useState<number>(minPriceSuperLike);
  const [currentBalance, setCurrentBalance] = useState<string>('');

  const [comment, setComment] = useState<string>('');
  const { name: username } = useAuth();
  const [isOpenMultiplePublish, setIsOpenMultiplePublish] = useState(false);
  const [publishes, setPublishes] = useState<any>(null);
  const setNotification = useSetAtom(setNotificationAtom);

  const resetValues = () => {
    setSuperlikeDonationAmount(0);
    setComment('');
    setPublishes(null);
  };
  const onClose = () => {
    resetValues();
    setIsOpen(false);
  };

  async function publishSuperLike() {
    try {
      if (!username) throw new Error('You need a name to publish');
      if (!name) throw new Error("Could not retrieve content creator's name");
      const estimatedTransactionFees = 0.1;
      const donationExceedsBalance =
        superlikeDonationAmount + estimatedTransactionFees >= +currentBalance;
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
        !superlikeDonationAmount ||
        superlikeDonationAmount < minPriceSuperLike
      )
        throw new Error(
          `The amount is ${superlikeDonationAmount}, but it needs to be at least ${minPriceSuperLike} QORT`
        );

      const listOfPublishes = [];

      const res = await qortalRequest({
        action: 'SEND_COIN',
        coin: 'QORT',
        recipient: address,
        amount: superlikeDonationAmount,
      });

      const hashPostId = await hashWordWithoutPublicSalt(identifier, 20);

      const metadescription = `**sig:${
        res?.signature
      };${FOR}:${name}_${FOR_SUPER_LIKE};nm:${name.slice(0, 20)}**`;
      const id = uid.rnd();

      const identifierSuperLike = `${SUPER_LIKE_BASE}${hashPostId}_${id}`;

      const superLikeToBase64 = await objectToBase64({
        comment,
        transactionReference: res?.signature,
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
        identifier: identifierSuperLike,
        tag1: SUPER_LIKE_BASE,
        filename: `superlike_metadata.json`,
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
      const message = isError ? error?.message : 'Failed to publish Super Like';
      const notificationObj: AltertObject = {
        msg: message,
        alertType: 'error',
      };
      setNotification(notificationObj);

      throw new Error('Failed to publish Super Like');
    }
  }

  useEffect(() => {
    getUserBalance().then((foundBalance) => {
      setCurrentBalance(truncateNumber(foundBalance, 2));
    });
  }, []);

  const isScreenSmall = !useMediaQuery(`(min-width:400px)`);
  const theme = useTheme();
  return (
    <>
      <Box
        onClick={() => {
          if (username === name) {
            const notificationObj: AltertObject = {
              msg: 'You cannot send yourself a Super like',
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
        <CustomTooltip title="Super Like" placement="top">
          <Box>
            <ThumbUpIcon
              style={{
                color: 'gold',
              }}
            />

            {numberOfSuperlikes === 0 ? null : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                }}
              >
                <span style={{ marginRight: '10px', paddingBottom: '4px' }}>
                  {numberOfSuperlikes}
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
        </CustomTooltip>
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
            <NewCrowdfundTitle>Super Like</NewCrowdfundTitle>
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
                minValue={+minPriceSuperLike}
                initialValue={minPriceSuperLike.toString()}
                maxValue={numberToInt(+currentBalance)}
                allowDecimals={false}
                allowNegatives={false}
                id="standard-adornment-amount"
                value={superlikeDonationAmount}
                afterChange={(e: string) => setSuperlikeDonationAmount(+e)}
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
                  publishSuperLike();
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
              amount: +superlikeDonationAmount,
              created: Date.now(),
            });
            setIsOpenMultiplePublish(false);
            onClose();
            const notificationObj: AltertObject = {
              msg: 'Super like published',
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
