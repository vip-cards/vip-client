import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

type IMainImageProps = JSX.IntrinsicElements["img"];

const MainImage: React.FC<IMainImageProps> = ({
  src,
  alt,
  className,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const onLoad = useCallback(
    (event: any) => {
      setImageSrc(src);
    },
    [src]
  );
  const onError = useCallback(() => {
    setError(true);
  }, []);

  useEffect(() => {
    if (imageRef?.current?.complete && imageRef.current.src !== src)
      setImageSrc(src);
  }, [src, imageRef]);

  if (error)
    return (
      <div
        className={classNames(
          "w-full h-full object-cover flex justify-center items-center shrink-0",
          className
        )}
        {...props}
      >
        <FontAwesomeIcon
          icon={faImage}
          className="min-h-[1rem] min-w-[1rem] max-w-[5rem] max-h-[5rem] w-full h-full p-2"
        />
      </div>
    );
  return (
    <img
      className={classNames("w-full h-full object-cover", className)}
      ref={imageRef}
      onLoad={onLoad}
      onError={onError}
      src={imageSrc}
      loading="lazy"
      alt={alt}
      {...props}
    />
  );
};

export default MainImage;
