import { useState } from 'react';

const Preview = ({ file }) => {
  const [preview, setPreview] = useState({});
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
  }

  return (
    <div>
      <img src={preview} alt="" />
    </div>
  );
};

export default Preview;
