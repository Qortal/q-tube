import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  objectToBase64,
  Service,
  useAuth,
  useGlobal,
  usePublish,
} from 'qapp-core';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetAtom } from 'jotai';
import { CHANNEL_DESCRIPTION } from '../../../constants/Identifiers.ts';
import { DisplayHtml } from '../../../components/common/TextEditor/DisplayHtml.tsx';
import { TextEditor } from '../../../components/common/TextEditor/TextEditor.tsx';
import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';
import {
  BlockIconContainer,
  IconsBox,
} from '../../Home/Components/VideoList-styles';

interface ChannelDescriptionProps {
  channelName: string;
}

interface ChannelDescriptionData {
  htmlDescription: string;
}

export const ChannelDescription: React.FC<ChannelDescriptionProps> = ({
  channelName,
}) => {
  const { t } = useTranslation(['core']);
  const { name: currentName } = useAuth();
  const setNotification = useSetAtom(setNotificationAtom);
  const publishFromLibrary = usePublish();
  const { lists } = useGlobal();

  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const isOwnChannel = channelName === currentName;
  const { deleteResource } = lists;

  useEffect(() => {
    fetchChannelDescription();
  }, [channelName]);

  useEffect(() => {
    if (textRef.current && description) {
      const el = textRef.current;

      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.visibility = 'hidden';
      clone.style.position = 'absolute';
      clone.style.pointerEvents = 'none';
      clone.style.webkitLineClamp = 'none';
      clone.style.display = 'block';

      document.body.appendChild(clone);
      const fullHeight = clone.offsetHeight;
      document.body.removeChild(clone);

      const clampedHeight = el.offsetHeight;

      if (fullHeight > clampedHeight + 2) {
        setShowMore(true);
      }
    }
  }, [description]);

  const fetchChannelDescription = async () => {
    try {
      setLoading(true);
      const responseData = await qortalRequest({
        action: 'FETCH_QDN_RESOURCE',
        name: channelName,
        service: 'DOCUMENT',
        identifier: CHANNEL_DESCRIPTION,
      });

      if (responseData && responseData.htmlDescription) {
        setDescription(responseData.htmlDescription);
      } else {
        setDescription(null);
      }
    } catch (error) {
      // console.error('Failed to Fetch Channel Description:', error);
      setDescription(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!editorContent.trim() || !currentName) return;

    try {
      setIsPublishing(true);

      const descriptionData: ChannelDescriptionData = {
        htmlDescription: editorContent,
      };
      console.log('Channel Description: ', editorContent);
      const requestBodyJson = {
        action: 'PUBLISH_QDN_RESOURCE',
        name: currentName || '',
        service: 'DOCUMENT' as Service,
        data64: await objectToBase64(descriptionData),
        identifier: CHANNEL_DESCRIPTION,
      };

      await publishFromLibrary.publishMultipleResources([requestBodyJson]);

      setNotification({
        msg: t('core:channel.description_published'),
        alertType: 'success',
      });

      setDescription(editorContent);
      setEditorContent('');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to Publish Channel Description:', error);
      setNotification({
        msg: t('core:channel.publish_failed'),
        alertType: 'error',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditorContent(description || '');
  };

  const handleDelete = async () => {
    if (!currentName) return;

    try {
      const resourceReference = {
        name: currentName,
        service: 'DOCUMENT' as Service,
        identifier: CHANNEL_DESCRIPTION,
      };

      await deleteResource([resourceReference]);

      setNotification({
        msg: t('core:channel.description_deleted'),
        alertType: 'success',
      });

      setDescription(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to Delete Channel Description:', error);
      setNotification({
        msg: t('core:channel.delete_failed'),
        alertType: 'error',
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditorContent('');
  };

  if (loading) {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Skeleton variant="text" width="100%" height={100} />
      </Box>
    );
  }

  if (!description && !isOwnChannel) {
    return null;
  }

  if (!description && isOwnChannel) {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography
          sx={{
            fontSize: '18px',
            mb: 1,
          }}
        >
          {t('core:channel.add_description', {
            postProcess: 'capitalizeEachFirstChar',
          })}
        </Typography>
        <TextEditor
          inlineContent={editorContent}
          setInlineContent={setEditorContent}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handlePublish}
          disabled={!editorContent.trim() || isPublishing}
        >
          {t('core:channel.publish_description', {
            postProcess: 'capitalizeEachFirstChar',
          })}
        </Button>
      </Box>
    );
  }

  if (isEditing && isOwnChannel) {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography
          sx={{
            fontSize: '18px',
            mb: 1,
          }}
        >
          {t('core:channel.edit_description', {
            postProcess: 'capitalizeEachFirstChar',
          })}
        </Typography>
        <TextEditor
          inlineContent={editorContent}
          setInlineContent={setEditorContent}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancelEdit}
            disabled={isPublishing}
          >
            {t('core:action.cancel', {
              postProcess: 'capitalizeEachFirstChar',
            })}
          </Button>
          <Button
            variant="contained"
            onClick={handlePublish}
            disabled={!editorContent.trim() || isPublishing}
          >
            {t('core:channel.publish_description', {
              postProcess: 'capitalizeEachFirstChar',
            })}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{ mt: 2, mb: 2, position: 'relative' }}
      onMouseEnter={() => setShowIcons(true)}
      onMouseLeave={() => setShowIcons(false)}
    >
      <IconsBox
        sx={{
          opacity: showIcons ? 1 : 0,
          zIndex: 2,
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        {isOwnChannel && (
          <>
            <Tooltip
              title={t('core:publish.edit_video', {
                postProcess: 'capitalizeEachFirstChar',
              })}
              placement="top"
            >
              <BlockIconContainer>
                <EditIcon onClick={handleEdit} />
              </BlockIconContainer>
            </Tooltip>

            <Tooltip
              title={t('core:publish.delete_video', {
                postProcess: 'capitalizeEachFirstChar',
              })}
              placement="top"
            >
              <BlockIconContainer>
                <DeleteIcon onClick={handleDelete} />
              </BlockIconContainer>
            </Tooltip>
          </>
        )}
      </IconsBox>
      <Box
        ref={textRef}
        sx={{
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'none' : 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.2,
        }}
      >
        <DisplayHtml html={description} />
      </Box>
      {showMore && (
        <Button
          onClick={() => setExpanded(!expanded)}
          sx={{ mt: 1, textTransform: 'none' }}
        >
          {expanded
            ? t('core:show_less', { postProcess: 'capitalizeEachFirstChar' })
            : t('core:show_more', { postProcess: 'capitalizeEachFirstChar' })}
        </Button>
      )}
    </Box>
  );
};
