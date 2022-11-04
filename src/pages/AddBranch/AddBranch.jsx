import React, { useRef } from "react";

import "./AddBranch.scss";

import { useSelector } from "react-redux";
import { useState } from "react";
import MainInput from "../../components/MainInput/MainInput";
import MainButton from "../../components/MainButton/MainButton";
import { t } from "i18next";
import vendorServices from "../../services/vendorServices";
export default function AddBranch() {
  const auth = useSelector((state) => state.auth);
  let vendorId = auth.vendorId;
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [branchhInfo, setBranchInfo] = useState({
    name_en: "",
    name_ar: "",
    lat: "31.21417631969772",
    lng: "29.945998297003165",
    address_en: "",
    address_ar: "",
    email: "",
    password: "",
    phone: "",
    governorate: "",
  });

  const ref = useRef();
  const imageUploader = (e) => {
    ref.current.click();
  };

  async function createBranchHandler(e) {
    e.preventDefault();
    setLoading(true);
    let formData = new FormData();

    formData.append("image", uploadImage);
    let branchDetails = {
      name: {
        en: branchhInfo.name_en,
        ar: branchhInfo.name_ar,
      },
      location: {
        lat: 31.21417631969772,
        long: 29.945998297003165,
      },
      vendor: vendorId,
      governorate: { en: "alex", ar: "الاسكندرية" },
      address: { en: branchhInfo.address_en, ar: branchhInfo.address_ar },
      email: branchhInfo.email,
      password: branchhInfo.password,
      phone: branchhInfo.phone,
    };
    try {
      let { data } = await vendorServices.createBranch(branchDetails);
      let branchId = data.record._id;
      let branchdata = await vendorServices.addBranchImg(branchId, formData);
      console.log(data);
      console.log(branchdata);
      setLoading(false);
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
    { name: "password", type: "password", required: true },
  ];

  return (
    <div className="app-card-shadow branch-container">
      <form className="add-branch-form" onSubmit={createBranchHandler}>
        <h2 className="add-branch-title">{t("addBranch")}</h2>
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
              state={branchhInfo}
              setState={setBranchInfo}
            />
          );
        })}
        <MainButton
          text={t("addBranch")}
          loading={loading}
          onClick={() => {}}
        />
      </form>
    </div>
  );
}
