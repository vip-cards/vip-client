import React, { useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import { useState } from "react";
import MainInput from "../../components/MainInput/MainInput";
import MainButton from "../../components/MainButton/MainButton";
import { t } from "i18next";
import vendorServices from "../../services/vendorServices";
import "./EditBranch.scss";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import imagesPath from "../../services/imagesPath";
import { string } from "joi";
export default function EditBranch() {
  const auth = useSelector((state) => state.auth);
  let params = useParams();
  let branchId = params.branchId;

  let vendorId = auth.vendorId;
  useEffect(() => {
    getBranchDetailsHandler();
  }, []);

  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);

  const [branchhInfo, setBranchInfo] = useState({
    name_en: "",
    name_ar: "",
    lat: "31.21417631969772",
    lng: "29.945998297003165",
    email: "",
    address_en: "",
    address_ar: "",
    phone: "",
    governorate: "",
  });

  const [branchOldInfo, setBranchOldInfo] = useState({
    name_en: "",
    name_ar: "",
    lat: "31.21417631969772",
    lng: "29.945998297003165",
    email: "",
    address_en: "",
    address_ar: "",
    phone: "",
    governorate: "",
  });

  async function getBranchDetailsHandler() {
    setLoading(true);
    try {
      let { data } = await vendorServices.getBranchDetails(branchId, vendorId);

      setBranchOldInfo({
        name_en: data?.record[0]?.name?.en,
        name_ar: data?.record[0]?.name?.ar,
        lat: "31.21417631969772",
        lng: "29.945998297003165",
        email: data?.record[0]?.email,
        address_en: data?.record[0]?.address.en,
        address_ar: data?.record[0]?.address.ar,
        phone: data?.record[0]?.phone,
        governorate: data?.record[0]?.governorate.en,
      });

      setBranchInfo({
        name_en: data?.record[0]?.name?.en,
        name_ar: data?.record[0]?.name?.ar,
        lat: "31.21417631969772",
        lng: "29.945998297003165",
        email: data?.record[0]?.email,
        address_en: data?.record[0]?.address.en,
        address_ar: data?.record[0]?.address.ar,
        phone: data?.record[0]?.phone,
        governorate: data?.record[0]?.governorate.en,
      });

      setUploadImage(data?.record[0]?.image?.path);
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

  async function editBranchHandler(e) {
    e.preventDefault();
    setLoading(true);

    let editData = {};
    Object.keys(branchhInfo).forEach((key) => {
      if (branchhInfo[key] !== branchOldInfo[key]) {
        editData = { ...editData, [key]: branchhInfo[key] };
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
      } else if (key === "address_en") {
        finalEditData = {
          ...finalEditData,
          address: { ...finalEditData.address, en: editData[key] },
        };
      } else if (key === "address_ar") {
        finalEditData = {
          ...finalEditData,
          address: { ...finalEditData.address, ar: editData[key] },
        };
      } else {
        finalEditData = { ...finalEditData, [key]: editData[key] };
      }
    });
    console.log("finalEditData", finalEditData);

    try {
      let { data } = await vendorServices.editBranchDetails(
        branchId,
        vendorId,
        finalEditData
      );

      console.log(typeof uploadImage === "object");
      if (typeof uploadImage === "object") {
        let formData = new FormData();

        formData.append("image", uploadImage);
        let updateImage = await vendorServices.addBranchImg(branchId, formData);
        console.log(updateImage);
      }
      console.log(data);
      setLoading(false);
      getBranchDetailsHandler();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  let formData = [
    { name: "name_en", type: "text", required: true },
    { name: "name_ar", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "address_en", type: "text", required: true },
    { name: "address_ar", type: "text", required: true },
    { name: "governorate", type: "text", required: true },
    { name: "phone", type: "text", required: true },
    { name: "lat", type: "text", required: true },
    { name: "lng", type: "text", required: true },
  ];

  return (
    <div className="app-card-shadow branch-container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form className="add-branch-form" onSubmit={editBranchHandler}>
          <h2 className="add-branch-title">{t("editBranch")}</h2>
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
              // required
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
                state={branchhInfo}
                setState={setBranchInfo}
              />
            );
          })}
          <MainButton
            text={t("editBranch")}
            loading={loading}
            onClick={() => {}}
          />
        </form>
      )}
    </div>
  );
}
