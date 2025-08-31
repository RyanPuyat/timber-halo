import styled from 'styled-components';
import Menus from './Menus'; // adjust path as needed
import { HiDownload, HiTrash } from 'react-icons/hi';

const PreviewWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 8px;
`;

const PreviewImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

function FilePreview({ file, onDelete }) {
  const fileUrl = URL.createObjectURL(file);

  function handleDownload() {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    link.click();
  }

  return (
    <PreviewWrapper>
      <PreviewImage src={fileUrl} alt="preview" />
      <Menus>
        <Menus.Toggle id="file-menu" />
        <Menus.List id="file-menu">
          <Menus.Button icon={<HiDownload />} onClick={handleDownload}>
            Download
          </Menus.Button>
          <Menus.Button icon={<HiTrash />} onClick={onDelete}>
            Delete
          </Menus.Button>
        </Menus.List>
      </Menus>
    </PreviewWrapper>
  );
}

export default FilePreview;
