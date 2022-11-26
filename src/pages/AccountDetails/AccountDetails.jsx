import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import MainInput from "../../components/MainInput/MainInput";
import MainButton from "../../components/MainButton/MainButton";
import { t } from "i18next";
import { useNavigate } from "react-router";
import "./AccountDetails.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import i18n from "../../locales/i18n";
import imagesPath from "../../services/imagesPath";
import toastPopup from "../../helpers/toastPopup";
import branchBlaceHolder from "../../assets/images/branchPlaceHolder.png";
export default function AccountDetails() {
  let auth = useSelector((state) => state.auth);
  let userData = auth.userData;
  console.log(auth);
  const navigate = useNavigate();

  const lang = i18n.language;
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [categories, setCategories] = useState([]);
  let userRole = auth.userRole;

  // async function getAllCategoriesHandler() {
  //   try {
  //     setLoading(true);
  //     let { data } =
  //       userRole === "vendor"
  //         ? await vendorServices.listAllCategories()
  //         : await branchServices.listAllCategories();
  //     setCategories(data.records);

  //     console.log(data);
  //     setLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //     setLoading(false);
  //   }
  // }

  const [offerInfo, setOfferInfo] = useState(
    auth.userRole === "vendor"
      ? {
          name_en: userData.name.en,
          name_ar: userData.name.ar,
          category: userData.category,
          description_en: userData.description.en,
          description_ar: userData.description.ar,
          // branch: branchId,
          // price: 35.5,
          // originalPrice: 45,
        }
      : {
          name_en: userData.name.en,
          name_ar: userData.name.ar,
          category: userData.category,
          // description_en: userData.description.en,
          // description_ar: userData.description.ar,
          // branch: branchId,
          // price: 35.5,
          // originalPrice: 45,
        }
  );

  // const [offerOldInfo, setOfferOldInfo] = useState({
  //   name_en: "",
  //   name_ar: "",
  //   category: "",
  //   description_en: "",
  //   description_ar: "",
  //   // branch: branchId,
  //   price: 35.5,
  //   originalPrice: 45,
  // });

  // useEffect(() => {
  //   getAllCategoriesHandler();
  // }, []);

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  // async function editOfferHandler(e) {
  //   e.preventDefault();
  //   setLoading(true);
  //   let editData = {};
  //   Object.keys(offerInfo).forEach((key) => {
  //     if (offerInfo[key] !== offerOldInfo[key]) {
  //       editData = { ...editData, [key]: offerInfo[key] };
  //     }
  //   });

  //   let finalEditData = {};
  //   Object.keys(editData).forEach((key) => {
  //     if (key === "name_en") {
  //       finalEditData = {
  //         ...finalEditData,
  //         name: { ...finalEditData.name, en: editData[key] },
  //       };
  //     } else if (key === "name_ar") {
  //       finalEditData = {
  //         ...finalEditData,
  //         name: { ...finalEditData.name, ar: editData[key] },
  //       };
  //     } else if (key === "description_en") {
  //       finalEditData = {
  //         ...finalEditData,
  //         description: { ...finalEditData.description, en: editData[key] },
  //       };
  //     } else if (key === "description_ar") {
  //       finalEditData = {
  //         ...finalEditData,
  //         description: { ...finalEditData.description, ar: editData[key] },
  //       };
  //     } else {
  //       finalEditData = { ...finalEditData, [key]: editData[key] };
  //     }
  //   });
  //   console.log("finalEditData", finalEditData);

  //   try {
  //     let formData = new FormData();
  //     formData.append("image", uploadImage);
  //     let { data } =
  //       userRole === "vendor"
  //         ? await vendorServices.editOfferDetails(
  //             // offerId,
  //             // branchId,
  //             // vendorId,
  //             finalEditData
  //           )
  //         : await branchServices.editOfferDetails(
  //             // offerId,
  //             // branchId,

  //             finalEditData
  //           );
  //     if (typeof uploadImage === "object") {
  //       // let offerImage =
  //       //   userRole === "vendor"
  //       //     ? await vendorServices.addOfferImg(offerId, formData)
  //       //     : await branchServices.addOfferImg(offerId, formData);
  //     }
  //     console.log(data);
  //     toastPopup.success(t("offerEditSuccess"));
  //     // setTimeout(() => {
  //     //   navigate(auth.userRole === "vendor" && `/branches/${branchId}/offers`);
  //     // }, 500);
  //     setLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //     toastPopup.error(t("offerEditErr"));
  //     setLoading(false);
  //   }
  // }

  let formData =
    auth.userRole === "vendor"
      ? [
          { name: "name_en", type: "text", required: true },
          { name: "name_ar", type: "text", required: true },
          { name: "description_en", type: "text", required: true },
          { name: "description_ar", type: "text", required: true },
          // {
          //   name: "category",
          //   type: "list",
          //   required: true,
          //   list: categories,
          //   identifier: "name",
          // },
          // { name: "price", type: "number", required: true },
          // { name: "originalPrice", type: "number", required: true },
        ]
      : [
          { name: "name_en", type: "text", required: true },
          { name: "name_ar", type: "text", required: true },
          // { name: "description_en", type: "text", required: true },
          // { name: "description_ar", type: "text", required: true },
          // {
          //   name: "category",
          //   type: "list",
          //   required: true,
          //   list: categories,
          //   identifier: "name",
          // },
          // { name: "price", type: "number", required: true },
          // { name: "originalPrice", type: "number", required: true },
        ];

  return (
    <div className="app-card-shadow edit-account-container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form
          className="add-branch-form"
          onSubmit={() => {} /*editOfferHandler*/}
        >
          <h2 className="add-branch-title">{t("accountDetails")}</h2>

          <div className="account-details-container">
            <div className="main-image-label">
              <img
                src={
                  branchBlaceHolder
                  // uploadImage
                  //   ? typeof uploadImage === "string"
                  //     ? `${imagesPath}${uploadImage}`
                  //     : URL.createObjectURL(uploadImage)
                  //   : null
                }
                alt="imag-viewer"
                className="uploaded-img"
                onClick={() => {
                  window.open(
                    uploadImage ? URL.createObjectURL(uploadImage) : null
                  );
                }}
              />
              {/* {uploadImage && (
                <img
                  src={
                    branchBlaceHolder
                    // uploadImage
                    //   ? typeof uploadImage === "string"
                    //     ? `${imagesPath}${uploadImage}`
                    //     : URL.createObjectURL(uploadImage)
                    //   : null
                  }
                  alt="imag-viewer"
                  className="uploaded-img"
                  onClick={() => {
                    window.open(
                      uploadImage ? URL.createObjectURL(uploadImage) : null
                    );
                  }}
                />
              )} */}
              {/* <input
                className="main-input-image"
                type="file"
                name="upload-img"
                ref={ref}
                onChange={(e) => {
                  setUploadImage(e.target.files[0]);
                }}
              /> */}
              {/* <label
                className="main-label-image"
                onClick={imageUploader}
                htmlFor="upload-img"
              >
                {t("addImage")}
              </label> */}
            </div>

            <div className="account-info-container">
              {formData.map((formInput, index) => {
                return (
                  <MainInput
                    key={index}
                    name={formInput.name}
                    type={formInput.type}
                    required={formInput.required}
                    list={formInput.list}
                    identifier={formInput.identifier}
                    state={offerInfo}
                    setState={setOfferInfo}
                    disabled
                  />
                );
              })}
            </div>
          </div>
          {/* 
          <MainButton
            text={t("editAccountInfo")}
            loading={loading}
            onClick={() => {}}
          /> */}
        </form>
      )}
    </div>
  );
}
