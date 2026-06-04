import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Tooltip } from '@mui/material';
import { QortalGetMetadata, QortalMetadata, Service } from 'qapp-core';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { fontSizeMedium } from '../../../constants/Misc.ts';
import { formatBytes } from '../../../utils/numberFunctions.ts';
import {
  ControlledTextField,
  ControlledTextFieldProps,
} from '../Textfields/ControlledTextfield.tsx';
import { DataTableObject } from './DataTableObject.tsx';
import { formatDate } from '../../../utils/time.ts';

import { ModalButton } from './ModalButton.tsx';

export interface PublishSearchProps {
  label: string;
  value: QortalMetadata;
  setValue: Dispatch<SetStateAction<QortalMetadata>>;
  service: Service;
}
export const PublishSearch = ({
  label,
  value,
  setValue,
  service,
}: PublishSearchProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTitle, setSearchTitle] = useState<string>('');

  const [searchResults, setSearchResults] = useState<QortalMetadata[]>([]);

  const getColumnData = (
    data: QortalMetadata,
    onClick: (sr: QortalMetadata) => void
  ) => {
    const { created, name, size, identifier } = data;

    const date = formatDate(created).toString();

    return {
      title: (
        <Button variant={'contained'} onClick={() => onClick(data)}>
          {data?.metadata?.title}
        </Button>
      ),
      name,
      identifier: identifier ? identifier.slice(0, 20) : 'N/A',
      fileSize: size ? formatBytes(size, 1) : 'N/A',
      date,
    };
  };

  const searchPublishes = async () => {
    const publishes: QortalMetadata[] = await qortalRequest({
      action: 'SEARCH_QDN_RESOURCES',
      service,
      query: searchTitle,
      includeMetadata: true,
      excludeBlocked: true,
      mode: 'ALL',
      limit: 20,
    });
    setSearchResults(publishes);
  };

  const tableData = useMemo(() => {
    const onClick = (sr: QortalMetadata) => {
      setValue(sr);
      setIsOpen(false);
    };

    return searchResults?.map((sr) => getColumnData(sr, onClick));
  }, [searchResults]);

  const columnNames = ['ID', 'Title', 'Name', 'Identifier', 'Size', 'Date'];

  return (
    <Box sx={{ display: 'flex', gap: 0 }}>
      <ModalButton
        label={label}
        variant={'contained'}
        buttonSX={{ color: 'white' }}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        bodySX={{ padding: 3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <ControlledTextField
            value={searchTitle}
            setValue={setSearchTitle}
            label={`Title`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') searchPublishes();
            }}
          />
          <Button variant={'contained'} onClick={searchPublishes}>
            Search
          </Button>
        </Box>
        {tableData && (
          <DataTableObject columnNames={columnNames} data={tableData} />
        )}
      </ModalButton>
    </Box>
  );
};
