import React, { createContext, useContext, ReactNode } from 'react';
import { UseVideoPublishingWorkflowReturn } from './useVideoPublishingWorkflow.tsx';

interface PublishVideoContextType extends UseVideoPublishingWorkflowReturn {}

export const PublishVideoContext =
  createContext<PublishVideoContextType | null>(null);

export const usePublishVideo = () => {
  const context = useContext(PublishVideoContext);
  if (!context) {
    throw new Error(
      'usePublishVideo must be used within a PublishVideoProvider'
    );
  }
  return context;
};

interface PublishVideoProviderProps {
  children: ReactNode;
  value: UseVideoPublishingWorkflowReturn;
}

export const PublishVideoProvider: React.FC<PublishVideoProviderProps> = ({
  children,
  value,
}) => {
  return (
    <PublishVideoContext.Provider value={value}>
      {children}
    </PublishVideoContext.Provider>
  );
};
