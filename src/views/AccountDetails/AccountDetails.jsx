import { t } from "i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clientServices from "services/clientServices";
import { authActions } from "store/auth-slice";
import useSWR from "swr";

import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import branchBlaceHolder from "assets/images/branchPlaceHolder.png";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import toastPopup from "helpers/toastPopup";

import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";

import "./AccountDetails.scss";
import { getLocalizedWord } from "helpers/lang";
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
  const ref = useRef();
  const dispatch = useDispatch();
  const { data: accountData } = useSWR("account-details", () =>
    clientServices.updateInfo()
  );
  const { data: professionsData } = useSWR("list-professions", () =>
    clientServices.listAllProfessions()
  );
  const { record: account = undefined } = accountData ?? {};
  const { records: professions = undefined } = professionsData ?? {};

  const auth = useSelector((state) => state.auth);

  const userData = account ?? auth.userData;
  console.log(professions);

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [updateImage, setUpdateImage] = useState(userData.image?.Location);
  const [uploadImage, setUploadImage] = useState(updateImage);
  const [imgUpdated, setImgUpdated] = useState(false);
  const [oldUserInfo, setOldUserInfo] = useState({
    name_en: userData.name.en,
    name_ar: userData.name.ar,
    email: userData.email,
    phone: userData.phone,
    image: userData.image,
    age: userData.age,
    gender: userData.gender,
    profession: userData.profession,
  });
  const [userInfo, setUserInfo] = useState(oldUserInfo);

  const formData = [
    { name: "name_en", type: "text", required: true },
    { name: "name_ar", type: "text", required: true },
    { name: "email", type: "email", required: true, toEdit: true },
    { name: "age", type: "number", toEdit: true },
    { name: "phone", type: "tel", toEdit: true },
    {
      name: "profession",
      type: "multi-select",
      identifier: "name",
      // list:
      //   professions?.map((item) => ({
      //     _id: item._id,
      //     // value: item.name.en,
      //     name: getLocalizedWord(item.name),
      //     isChecked: true,
      //   })) ?? [],
      // defaultList:
      //   account?.profession?.map((item) => ({
      //     _id: item._id,
      //     // value: item.name.en,
      //     name: getLocalizedWord(item.name),
      //     isChecked: true,
      //   })) ?? [],
      list:
        professions?.map((item) => ({
          _id: item._id,
          // value: item.name.en,
          name: getLocalizedWord(item.name),
          isChecked: true,
        })) ?? [],
      defaultList:
        account?.profession?.map((item) => {
          return professions.findIndex((prf) => prf._id === item._id) ?? [];
        }) ?? [],
      toEdit: true,
    },
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
    const mappedData = {
      name: {
        en: userInfo.name_en,
        ar: userInfo.name_ar,
      },
      email: newDataObj.email,
      phone: newDataObj.phone,
      age: newDataObj.age,
      gender: newDataObj.gender,
      profession: newDataObj.profession.map((item) => ({
        _id: item._id,
        value: item.name.en,
        name: getLocalizedWord(item.name),
        isChecked: true,
      })),

      // description: {
      //   en: newDataObj.description_en,
      //   ar: newDataObj.description_ar,
      // },
    };

    clientServices
      .updateInfo(mappedData)
      .then((data) => {
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
                  defaultList={formInput.defaultList}
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
