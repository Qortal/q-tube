import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  Typography,
} from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  copyPreferencesAtom,
  CopyPreferenceItem,
} from '../../../state/global/copyPreferences.ts';
import {
  AltertObject,
  setNotificationAtom,
} from '../../../state/global/notifications.ts';

export interface CopyLinkModalProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  link: string;
  title?: string;
  description?: string;
}

export const CopyLinkModal = ({
  anchorEl,
  onClose,
  link,
  title,
  description,
}: CopyLinkModalProps) => {
  const { t } = useTranslation(['core']);
  const [preferences, setPreferences] = useAtom(copyPreferencesAtom);
  const setNotification = useSetAtom(setNotificationAtom);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const open = Boolean(anchorEl);

  // Map keys to values and labels
  const getValueForKey = (key: 'link' | 'title' | 'description'): string => {
    switch (key) {
      case 'link':
        return link;
      case 'title':
        return title || '';
      case 'description':
        return description || '';
      default:
        return '';
    }
  };

  const getLabelForKey = (key: 'link' | 'title' | 'description'): string => {
    return t(`core:video.copy_${key}`, { postProcess: 'capitalizeFirstChar' });
  };

  const isDisabledForKey = (key: 'link' | 'title' | 'description'): boolean => {
    switch (key) {
      case 'link':
        return false;
      case 'title':
        return !title;
      case 'description':
        return !description;
      default:
        return true;
    }
  };

  const handleCheckboxChange = (index: number) => {
    setPreferences((prev) => {
      const newPrefs = [...prev];
      newPrefs[index] = { ...newPrefs[index], checked: !newPrefs[index].checked };
      return newPrefs;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setPreferences((prev) => {
      const newPrefs = [...prev];
      const draggedItem = newPrefs[draggedIndex];
      newPrefs.splice(draggedIndex, 1);
      newPrefs.splice(index, 0, draggedItem);
      return newPrefs;
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const buildCopyString = (): string => {
    const parts: string[] = [];

    // Build string in order of preferences array (values only, no labels)
    for (const item of preferences) {
      if (item.checked) {
        const value = getValueForKey(item.key);
        if (value) {
          parts.push(value);
        }
      }
    }

    return parts.join('\n\n');
  };

  const handleCopy = async () => {
    // Check if at least one checkbox is selected
    const hasSelection = preferences.some((item) => item.checked);
    if (!hasSelection) {
      const notificationObj: AltertObject = {
        msg: t('core:video.nothing_selected', {
          postProcess: 'capitalizeFirstChar',
        }),
        alertType: 'error',
      };
      setNotification(notificationObj);
      return;
    }

    const textToCopy = buildCopyString();

    try {
      await navigator.clipboard.writeText(textToCopy);
      const notificationObj: AltertObject = {
        msg: t('core:video.copied_to_clipboard', {
          postProcess: 'capitalizeFirstChar',
        }),
        alertType: 'success',
      };
      setNotification(notificationObj);
      onClose();
    } catch (err) {
      const notificationObj: AltertObject = {
        msg: t('core:video.copy_failed', {
          postProcess: 'capitalizeFirstChar',
        }),
        alertType: 'error',
      };
      setNotification(notificationObj);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <FormGroup sx={{ p: 2, minWidth: 250 }}>
        {preferences.map((item, index) => (
          <div
            key={item.key}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
          >
            <IconButton
              size="small"
              sx={{ cursor: 'grab', mr: 0.5 }}
              disableRipple
            >
              <DragIndicatorIcon fontSize="small" />
            </IconButton>
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.checked}
                  onChange={() => handleCheckboxChange(index)}
                  disabled={isDisabledForKey(item.key)}
                />
              }
              label={
                <Typography sx={{ userSelect: 'none' }}>
                  {getLabelForKey(item.key)}
                </Typography>
              }
              sx={{ flex: 1, m: 0 }}
            />
          </div>
        ))}
        <Button
          variant="contained"
          fullWidth
          onClick={handleCopy}
          sx={{ mt: 2 }}
        >
          {t('core:video.copy_video_info', { postProcess: 'capitalizeFirstChar' })}
        </Button>
      </FormGroup>
    </Popover>
  );
};