import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import i18n from "../../locales/i18n";
import { authActions } from "../../store/auth-slice";
import clientServices from "../../services/clientServices";

import MainInput from "../../components/MainInput/MainInput";
import MainButton from "../../components/MainButton/MainButton";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toastPopup from "../../helpers/toastPopup";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import branchBlaceHolder from "../../assets/images/branchPlaceHolder.png";

import "./AccountDetails.scss";
/**
 * {obj1} new object
 * {obj2} old object
 */
const getUpdatedOnly = (obj1, obj2) => {
  const editData = {};
  Object.keys(obj1).forEach((key) => {
    if (obj1[key] !== obj2[key]) {
      editData[key] = obj1[key];
    }
  });
  return editData;
};
export default function AccountDetails() {
  const lang = i18n.language;
  const ref = useRef();
  const dispatch = useDispatch();

  let auth = useSelector((state) => state.auth);
  let userData = auth.userData;

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [updateImage, setUpdateImage] = useState(userData.image?.Location);
  const [uploadImage, setUploadImage] = useState(updateImage);
  console.log(uploadImage);
  const [imgUpdated, setImgUpdated] = useState(false);
  const [oldUserInfo, setOldUserInfo] = useState({
    name_en: userData.name.en,
    name_ar: userData.name.ar,
    email: userData.email,
    phone: userData.phone,
    image: userData.image,
    gender: userData.gender,
    profession_en: userData.profession.en,
    profession_ar: userData.profession.ar,
  });
  const [userInfo, setUserInfo] = useState(oldUserInfo);

  const formData = [
    { name: "name_en", type: "text", required: true },
    { name: "name_ar", type: "text", required: true },
    { name: "email", type: "email", required: true, toEdit: true },
    {
      name: "gender",
      type: "list",
      list: [
        { _id: 0, gender: { en: "male", ar: "ذكر" } },
        { _id: 1, gender: { en: "female", ar: "أنثى" } },
      ],
      identifier: "gender",
      required: true,
    },
  ];

  const imageUploader = (e) => {
    ref.current.click();
  };

  const updateDetails = (e) => {
    /**
     * - toggle input edit with a pen icon button
     * - save button => collects the updates and redirects to enter password page
     * - enter password page => check to send new details
     */
    e.preventDefault();
    const newDataObj = getUpdatedOnly(userInfo, oldUserInfo);
    console.log(userData);
    const mappedData = {
      name: {
        en: userInfo.name_en,
        ar: userInfo.name_ar,
      },
      email: newDataObj.email,
      phone: newDataObj.phone,

      gender: newDataObj.gender,
      profession: (newDataObj.profession_en || newDataObj.profession_ar) && {
        en: newDataObj.profession_en,
        ar: newDataObj.profession_ar,
      },

      // description: {
      //   en: newDataObj.description_en,
      //   ar: newDataObj.description_ar,
      // },
    };

    clientServices
      .updateInfo(mappedData)
      .then(({ data }) => {
        dispatch(authActions.update({ userData: data.record }));
        toastPopup.success("Account Info Updated Successfully");
      })
      .catch((e) => toastPopup.error("Something went wrong"));
  };

  const imageUpload = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("image", updateImage);

      if (typeof updateImage === "object") {
        setImageLoading(true);
        const clientImage = await clientServices.uploadImg(formData);
        setUploadImage(updateImage);
        dispatch(authActions.updateImage(clientImage.data.record));
        console.dir(clientImage.data.record);
        toastPopup.success("Photo Updated Successfully");
      }
    } catch (e) {
      toastPopup.error("Something went wrong");
    }
    setImageLoading(false);
  }, [dispatch, updateImage]);

  useEffect(() => {
    if (imgUpdated) {
      imageUpload();
    }
  }, [imageUpload, imgUpdated]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <form className="add-branch-form" onSubmit={updateDetails}>
      <h2 className="add-branch-title">{t("accountDetails")}</h2>

      <div className="account-details-container">
        <div className="main-image-label">
          {imageLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {uploadImage && (
                <img
                  src={
                    uploadImage
                      ? typeof uploadImage === "string"
                        ? `${uploadImage}`
                        : URL.createObjectURL(uploadImage)
                      : null
                  }
                  alt={userData.name.en}
                  className="uploaded-img"
                  onClick={() => {
                    console.log("IMAGE");
                    window.open(
                      uploadImage ? URL.createObjectURL(uploadImage) : null
                    );
                  }}
                  onError={(e) => (e.target.src = branchBlaceHolder)}
                />
              )}
            </>
          )}
          <input
            className="main-input-image"
            type="file"
            accept="image/*"
            name="upload-img"
            ref={ref}
            onChange={(e) => {
              setImgUpdated(true);
              setUpdateImage(e.target.files[0]);
            }}
            disabled={imageLoading}
          />
          <label
            className="vendor-label-image"
            onClick={imageUploader}
            htmlFor="upload-img"
          >
            <FontAwesomeIcon icon={faImage} />
          </label>
        </div>

        <div className="account-info-container">
          {formData.map((formInput, index) => {
            return (
              <>
                <MainInput
                  key={formInput.name}
                  name={formInput.name}
                  type={formInput.type}
                  required={formInput.required}
                  list={formInput.list}
                  identifier={formInput.identifier}
                  state={userInfo}
                  setState={setUserInfo}
                  disabled
                  toEdit={true}
                />
              </>
            );
          })}

          <MainButton className="full-width" text={t("confirm")} />
        </div>
      </div>
    </form>
  );
}
