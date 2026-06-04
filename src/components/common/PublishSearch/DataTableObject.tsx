import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { SxProps } from '@mui/material/styles';

export interface DataTableProps {
  columnNames: string[];
  data: object[];
  sx?: SxProps;
}

export const DataTableObject = ({ columnNames, data, sx }: DataTableProps) => {
  const boldSX = {
    fontSize: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
  };
  const cellSX = {
    fontSize: '25px',
    fontWeight: 'normal',
    textAlign: 'center',
  };

  return (
    <TableContainer sx={{ ...sx }}>
      <Table align="center" stickyHeader>
        <TableHead>
          <TableRow>
            {columnNames.map((columnName, index) => (
              <TableCell sx={boldSX} key={columnName + index}>
                {columnName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((tableRow, rowIndex) => {
            return (
              <TableRow key={tableRow.toString() + rowIndex}>
                {<TableCell sx={boldSX}>{rowIndex + 1}</TableCell>}

                {Object.entries(tableRow).map(([key, value], index) => (
                  <TableCell sx={cellSX} key={key}>
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
