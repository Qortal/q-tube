import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  onLoadMore: () => Promise<void>;
  isLoading?: boolean;
}

const LazyLoad: React.FC<Props> = ({ onLoadMore, isLoading }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const firstLoad = useRef(false);
  const [ref, inView] = useInView({
    threshold: 0.7,
  });

  useEffect(() => {
    if (inView) {
      setIsFetching(true);
      onLoadMore().finally(() => {
        setIsFetching(false);
        firstLoad.current = true;
      });
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '25px',
      }}
    >
      <div
        style={{
          visibility: isFetching || isLoading ? 'visible' : 'hidden',
        }}
      >
        <CircularProgress />
      </div>
    </div>
  );
};

export default LazyLoad;
