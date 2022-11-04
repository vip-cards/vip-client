import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import MainInput from "../../components/MainInput/MainInput";
import MainButton from "../../components/MainButton/MainButton";
import { t } from "i18next";
import vendorServices from "../../services/vendorServices";
import { useParams } from "react-router";
import "./EditOffer.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import i18n from "../../locales/i18n";
import imagesPath from "../../services/imagesPath";
import branchServices from "../../services/branchServices";

export default function EditOffer() {
  let auth = useSelector((state) => state.auth);
  const params = useParams();
  const branchId = params.branchId;
  const offerId = params.offerId;
  const vendorId = params.vendorId;
  const lang = i18n.language;
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [categories, setCategories] = useState([]);
  let userRole = auth.userRole;
  async function getAllCategoriesHandler() {
    try {
      setLoading(true);
      let { data } =
        userRole === "vendor"
          ? await vendorServices.listAllCategories()
          : await branchServices.listAllCategories();
      setCategories(data.records);

      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  const [offerInfo, setOfferInfo] = useState({
    name_en: "",
    name_ar: "",
    category: "",
    description_en: "",
    description_ar: "",
    branch: branchId,
    price: 35.5,
    originalPrice: 45,
  });

  const [offerOldInfo, setOfferOldInfo] = useState({
    name_en: "",
    name_ar: "",
    category: "",
    description_en: "",
    description_ar: "",
    branch: branchId,
    price: 35.5,
    originalPrice: 45,
  });

  async function getOfferDetailsHandler() {
    setLoading(true);
    try {
      let { data } =
        userRole === "vendor"
          ? await vendorServices.getOfferDetails(branchId, vendorId, offerId)
          : await branchServices.getOfferDetails(branchId, offerId);

      setOfferInfo({
        name_en: data?.record?.[0]?.name?.en,
        name_ar: data?.record?.[0]?.name?.ar,
        category: data?.record?.[0]?.category?._id,
        description_en: data?.record?.[0]?.description?.en,
        description_ar: data?.record?.[0]?.description?.ar,
        isHotDeal: data?.record?.[0]?.isHotDeal,
        price: data?.record?.[0]?.price,
        originalPrice: data?.record?.[0]?.originalPrice,
      });

      setOfferOldInfo({
        name_en: data?.record?.[0]?.name?.en,
        name_ar: data?.record?.[0]?.name?.ar,
        category: data?.record?.[0]?.category?._id,
        description_en: data?.record?.[0]?.description?.en,
        description_ar: data?.record?.[0]?.description?.ar,
        isHotDeal: data?.record?.[0]?.isHotDeal,
        price: data?.record?.[0]?.price,
        originalPrice: data?.record?.[0]?.originalPrice,
      });

      setUploadImage(data?.record?.[0]?.image?.path);
      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllCategoriesHandler();
    getOfferDetailsHandler();
  }, []);

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  async function editOfferHandler(e) {
    e.preventDefault();
    setLoading(true);
    let editData = {};
    Object.keys(offerInfo).forEach((key) => {
      if (offerInfo[key] !== offerOldInfo[key]) {
        editData = { ...editData, [key]: offerInfo[key] };
      }
    });

    let finalEditData = {};
    Object.keys(editData).forEach((key) => {
      if (key === "name_en") {
        finalEditData = {
          ...finalEditData,
          name: { ...finalEditData.name, en: editData[key] },
        };
      } else if (key === "name_ar") {
        finalEditData = {
          ...finalEditData,
          name: { ...finalEditData.name, ar: editData[key] },
        };
      } else if (key === "description_en") {
        finalEditData = {
          ...finalEditData,
          description: { ...finalEditData.description, en: editData[key] },
        };
      } else if (key === "description_ar") {
        finalEditData = {
          ...finalEditData,
          description: { ...finalEditData.description, ar: editData[key] },
        };
      } else {
        finalEditData = { ...finalEditData, [key]: editData[key] };
      }
    });
    console.log("finalEditData", finalEditData);

    try {
      let formData = new FormData();
      formData.append("image", uploadImage);
      let { data } =
        userRole === "vendor"
          ? await vendorServices.editOfferDetails(
              offerId,
              branchId,
              vendorId,
              finalEditData
            )
          : await branchServices.editOfferDetails(
              offerId,
              branchId,

              finalEditData
            );
      if (typeof uploadImage === "object") {
        let offerImage =
          userRole === "vendor"
            ? await vendorServices.addOfferImg(offerId, formData)
            : await branchServices.addOfferImg(offerId, formData);
      }
      console.log(data);
      getOfferDetailsHandler();
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  let formData = [
    { name: "name_en", type: "text", required: true },
    { name: "name_ar", type: "text", required: true },
    { name: "description_en", type: "text", required: true },
    { name: "description_ar", type: "text", required: true },
    {
      name: "category",
      type: "list",
      required: true,
      list: categories,
      identifier: "name",
    },
    { name: "price", type: "number", required: true },
    { name: "originalPrice", type: "number", required: true },
  ];

  return (
    <div className="app-card-shadow branch-container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form className="add-branch-form" onSubmit={editOfferHandler}>
          <h2 className="add-branch-title">
            {offerInfo?.isHotDeal ? t("editHotDeal") : t("editOffer")}
          </h2>
          <div className="main-image-label">
            {uploadImage && (
              <img
                src={
                  uploadImage
                    ? typeof uploadImage === "string"
                      ? `${imagesPath}${uploadImage}`
                      : URL.createObjectURL(uploadImage)
                    : null
                }
                alt="imag-viewer"
                className="uploaded-img"
                onClick={() => {
                  window.open(
                    uploadImage ? URL.createObjectURL(uploadImage) : null
                  );
                }}
              />
            )}
            <input
              className="main-input-image"
              type="file"
              name="upload-img"
              ref={ref}
              onChange={(e) => {
                setUploadImage(e.target.files[0]);
              }}
            />
            <label
              className="main-label-image"
              onClick={imageUploader}
              htmlFor="upload-img"
            >
              {t("addImage")}
            </label>
          </div>
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
              />
            );
          })}
          <MainButton
            text={offerInfo?.isHotDeal ? t("editHotDeal") : t("editOffer")}
            loading={loading}
            onClick={() => {}}
          />
        </form>
      )}
    </div>
  );
}
