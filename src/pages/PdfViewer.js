import React from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const PdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = React.useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Document
      file={fileUrl}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {Array.from(new Array(numPages), (_, index) => (
        <Page 
          key={`page_${index + 1}`} 
          pageNumber={index + 1} 
          width={800}
        />
      ))}
    </Document>
  );
};

export default PdfViewer;