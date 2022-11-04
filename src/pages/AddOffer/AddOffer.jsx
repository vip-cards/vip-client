import React, { useEffect, useRef } from "react";

import "./AddOffer.scss";

import { useSelector } from "react-redux";
import { useState } from "react";
import MainInput from "../../components/MainInput/MainInput";
import MainButton from "../../components/MainButton/MainButton";
import { t } from "i18next";
import vendorServices from "../../services/vendorServices";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
export default function AddOffer({ isHotDeal }) {
  const auth = useSelector((state) => state.auth);
  const params = useParams();
  console.log(params);
  const branchId = params.branchId;
  console.log(branchId);
  let vendorId = auth.vendorId;
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    getAllCategoriesHandler();
  }, []);

  async function getAllCategoriesHandler() {
    try {
      setLoading(true);
      let { data } = await vendorServices.listAllCategories();
      setCategories(data.records);

      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  async function createOfferHandler(e) {
    e.preventDefault();
    setLoading(true);
    let offerDetails = {
      name: {
        en: offerInfo.name_en,
        ar: offerInfo.name_ar,
      },
      category: offerInfo.category,
      vendor: vendorId,
      branch: branchId,
      description: {
        en: offerInfo.description_en,
        ar: offerInfo.description_ar,
      },
      price: offerInfo.price,
      originalPrice: offerInfo.originalPrice,
      isHotDeal: isHotDeal,
    };
    try {
      let formData = new FormData();
      formData.append("image", uploadImage);
      let { data } = await vendorServices.createOffer(offerDetails);
      let offerId = data.record._id;
      let offerImage = await vendorServices.addOfferImg(offerId, formData);
      console.log(data);
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
        <form className="add-branch-form" onSubmit={createOfferHandler}>
          <h2 className="add-branch-title">{t("addOffer")}</h2>
          <div className="main-image-label">
            {uploadImage && (
              <img
                src={uploadImage ? URL.createObjectURL(uploadImage) : null}
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
              required
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
            text={isHotDeal ? t("addHotDeal") : t("addOffer")}
            loading={loading}
            onClick={() => {}}
          />
        </form>
      )}
    </div>
  );
}

/**
 *  name: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    vendor: { type: mongoose.Types.ObjectId, ref: "vendors", required: true },
    branch: { type: mongoose.Types.ObjectId, ref: "branches", required: true },
    category: { type: mongoose.Types.ObjectId, ref: "categories", required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    image: { type: Object },
    isActive: { type: Boolean, default: true },
    isHotDeal: { type: Boolean, default: false },
    isLimited: { type: Boolean, default: false },
    rate: { type: Number, min: 1, max: 5, default: 2.5 },
    priority: { 
        type: Number,
        min: 1, default: 3
    },
    description: {
        en: {
            type: String, required: true,
            default: "This Product is awsome"
        },
        ar: {
            type: String,
            default: "هذا المنتج رائع و جميل"
        }

    }
 * 
 * 
 * 
 * 
 * 
 */
