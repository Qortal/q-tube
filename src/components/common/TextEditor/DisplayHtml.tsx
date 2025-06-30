import { Box, styled } from '@mui/material';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';
import { convertQortalLinks } from './utils';

const CrowdfundInlineContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  fontSize: '19px',
  fontWeight: 400,
  letterSpacing: 0,
  color: theme.palette.text.primary,
  width: '100%',
}));

export const DisplayHtml = ({ html }) => {
  const cleanContent = useMemo(() => {
    if (!html) return null;

    const sanitize: string = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
    });
    return convertQortalLinks(sanitize);
  }, [html]);

  if (!cleanContent) return null;
  return (
    <CrowdfundInlineContent>
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
    </CrowdfundInlineContent>
  );
};
