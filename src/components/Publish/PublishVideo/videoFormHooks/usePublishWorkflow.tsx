import { useState } from 'react';

export interface UsePublishWorkflowReturn {
  step: string;
  setStep: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  openModal: () => void;
  resetWorkflow: () => void;
}

export const usePublishWorkflow = (
  afterClose?: () => void
): UsePublishWorkflowReturn => {
  const [step, setStep] = useState<string>('videos');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClose = () => {
    setIsOpen(false);
    if (afterClose) afterClose();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const resetWorkflow = () => {
    setStep('videos');
    setIsOpen(false);
  };

  return {
    step,
    setStep,
    isOpen,
    setIsOpen,
    onClose,
    openModal,
    resetWorkflow,
  };
};
