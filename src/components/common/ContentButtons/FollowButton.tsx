import { Box, Button, ButtonProps } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { MouseEvent, useEffect, useState } from 'react';
import { darken, styled } from '@mui/material/styles';
import { CustomTooltip, TooltipLine } from './CustomTooltip.tsx';

interface FollowButtonProps extends ButtonProps {
  followerName: string;
}

export type FollowData = {
  userName: string;
  followerName: string;
};

export const FollowButton = ({ followerName, ...props }: FollowButtonProps) => {
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [followingSize, setFollowingSize] = useState<string>('');
  const [followingItemCount, setFollowingItemCount] = useState<string>('');
  const isFollowingName = () => {
    return followingList.includes(followerName);
  };

  useEffect(() => {
    qortalRequest({
      action: 'GET_LIST_ITEMS',
      list_name: 'followedNames',
    }).then((followList) => {
      setFollowingList(followList);
    });
    getFollowSize();
  }, []);

  const followName = () => {
    if (followingList.includes(followerName) === false) {
      qortalRequest({
        action: 'ADD_LIST_ITEMS',
        list_name: 'followedNames',
        items: [followerName],
      }).then((response) => {
        if (response === false) console.error('followName failed');
        else {
          setFollowingList([...followingList, followerName]);
        }
      });
    }
  };
  const unfollowName = () => {
    if (followingList.includes(followerName)) {
      qortalRequest({
        action: 'DELETE_LIST_ITEM',
        list_name: 'followedNames',
        item: followerName,
      }).then((response) => {
        if (response === false) console.error('unfollowName failed');
        else {
          const listWithoutName = followingList.filter(
            (item) => followerName !== item
          );
          setFollowingList(listWithoutName);
        }
      });
    }
  };

  const manageFollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isFollowingName() ? unfollowName() : followName();
  };

  const verticalPadding = '3px';
  const horizontalPadding = '8px';
  const buttonStyle = {
    fontSize: '15px',
    fontWeight: '700',
    paddingTop: verticalPadding,
    paddingBottom: verticalPadding,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    borderRadius: 28,
    color: 'white',
    width: '96px',
    height: '45px',
    ...props.sx,
  };

  const getFollowSize = () => {
    qortalRequest({
      action: 'LIST_QDN_RESOURCES',
      name: followerName,
      limit: 0,
      includeMetadata: false,
    }).then((publishesList) => {
      let totalSize = 0;
      let itemsCount = 0;
      publishesList.map((publish) => {
        totalSize += +publish.size;
        itemsCount++;
      });
      setFollowingSize(formatBytes(totalSize));
      setFollowingItemCount(itemsCount.toString());
    });
  };

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  const tooltipTitle = followingSize && (
    <>
      <TooltipLine>
        Following a name automatically downloads all of its content to your
        node. The more followers a name has, the faster its content will
        download for everyone.
      </TooltipLine>
      <br />
      <TooltipLine>{`${followerName}'s Current Download Size: ${followingSize}`}</TooltipLine>
      <TooltipLine>{`Number of Files: ${followingItemCount}`}</TooltipLine>
    </>
  );

  return (
    <>
      <CustomTooltip title={tooltipTitle} placement={'top'} arrow>
        <Button
          {...props}
          variant={'outlined'}
          color="info"
          // sx={buttonStyle}
          onClick={(e) => manageFollow(e)}
          sx={(theme) => {
            const baseColor = theme.palette.info.main;
            return {
              minWidth: '125px',
              color: isFollowingName() ? darken(baseColor, 0.7) : baseColor,
            };
          }}
        >
          {isFollowingName() ? 'Unfollow' : 'Follow'}
        </Button>
      </CustomTooltip>
    </>
  );
};
