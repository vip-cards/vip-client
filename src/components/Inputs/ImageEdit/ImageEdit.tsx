import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import "./ImageEdit.scss";

function ImageEdit({
  uploadImage,
  setUploadImage,
  setImgUpdated,
  className,
  style,
}) {
  const ref = useRef<HTMLInputElement>();
  const imageUploader = (e) => {
    ref.current.click();
  };

  const imgSrc = () => {
    if (!uploadImage) return null;

    if (typeof uploadImage === "string") return `${uploadImage}`;

    return URL.createObjectURL(uploadImage);
  };

  useEffect(() => {
    return () => {
      uploadImage && URL.revokeObjectURL(uploadImage);
    };
  });

  return (
    <div className="main-image-label" style={style}>
      {uploadImage && (
        <img
          src={imgSrc()}
          alt="imag-viewer"
          className="uploaded-img"
          onClick={() => {
            window.open(uploadImage ? URL.createObjectURL(uploadImage) : null);
          }}
        />
      )}
      <input
        className={classNames(className, "main-input-image")}
        type="file"
        name="upload-img"
        ref={ref}
        onChange={(e) => {
          setImgUpdated(true);
          setUploadImage(e.target.files[0]);
        }}
      />
      <label
        className="main-label-image"
        onClick={imageUploader}
        htmlFor="upload-img"
      >
        <FontAwesomeIcon icon={faImage} />
      </label>
    </div>
  );
}

export default ImageEdit;
