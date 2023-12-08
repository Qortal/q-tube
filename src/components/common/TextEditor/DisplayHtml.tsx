import { useMemo } from "react";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.bubble.css";
import { convertQortalLinks } from "./utils";
import { Box, styled } from "@mui/material";


const CrowdfundInlineContent = styled(Box)(({ theme }) => ({
    display: "flex",
    fontFamily: "Mulish",
    fontSize: "19px",
    fontWeight: 400,
    letterSpacing: 0,
    color: theme.palette.text.primary,
    width: '100%'
  }));

export const DisplayHtml = ({ html }) => {
  const cleanContent = useMemo(() => {
    if (!html) return null;

    const sanitize: string = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
    });
    const anchorQortal = convertQortalLinks(sanitize);
    return anchorQortal;
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
