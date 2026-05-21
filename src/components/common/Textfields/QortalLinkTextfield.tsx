import { Box } from '@mui/material';
import { Service, showError } from 'qapp-core';
import { ControlledTextField } from './ControlledTextfield.tsx';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export interface LinkData {
  linkType: string | undefined;
  linkName: string | undefined;
  linkIdentifier: string | undefined;
}
export const getQortalLinkData = (link: string) => {
  if (link) {
    const linkIdentifierSplit = link.split('/');
    const finalIndex = linkIdentifierSplit.length - 1;

    const linkType = linkIdentifierSplit[finalIndex - 2];
    const linkName = linkIdentifierSplit[finalIndex - 1];
    const linkIdentifier = linkIdentifierSplit[finalIndex];

    return {
      linkType,
      linkName: decodeURIComponent(linkName),
      linkIdentifier,
    } as LinkData;
  } else return {} as LinkData;
};

export const isValidQortalLink = async (
  link: string,
  service: Service | undefined,
  isShowError = true
) => {
  const startOfLink = `qortal://APP`;
  const isQortalLinkStart = link.startsWith(startOfLink);
  const { linkType, linkName, linkIdentifier } = getQortalLinkData(link);

  const resourceArray = await qortalRequest({
    action: 'SEARCH_QDN_RESOURCES',
    name: linkName,
    identifier: linkIdentifier,
    service,
  });
  const resourceExists = resourceArray?.length === 1;

  const isValidLink = isQortalLinkStart && resourceExists;
  if (!isValidLink && isShowError) showError(`Invalid Qortal Link: ` + link);
  return isValidLink;
};

export interface QortalLinkTextfieldProps {
  setIsValid: Dispatch<SetStateAction<boolean>>;
  service?: Service;
}

export const QortalLinkTextfield = ({
  setIsValid,
  service,
}: QortalLinkTextfieldProps) => {
  const [value, setValue] = useState<string>('');
  useEffect(() => {
    isValidQortalLink(value, service, false).then((isValidLink) => {
      setIsValid(isValidLink);
    });
  }, [value]);

  return <ControlledTextField setValue={setValue} />;
};
