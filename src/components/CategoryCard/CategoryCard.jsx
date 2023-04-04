import React from "react";
import i18n from "../../locales/i18n";
import { useNavigate } from "react-router";
import categoryPlaceholder from "assets/images/categoreyPlaceHolder.png";

import "./CategoryCard.scss";

export default function CategoryCard({ category, vendorId }) {
  const lang = i18n.language;
  const navigate = useNavigate();

  return (
    <div
      className="category-card"
      onClick={() => {
        vendorId
          ? navigate(`/vendors/${vendorId}/category/${category._id}`)
          : navigate(`/categories/${category._id}`);
      }}
    >
      <div className="category-info-container">
        <div className="category-img-container">
          <img
            src={`${category?.image?.Location ?? categoryPlaceholder}`}
            alt="category-img"
            className="category-img"
          />
        </div>
        <div className="category-title">
          <p>{category.name[lang]} </p>
        </div>
      </div>
    </div>
  );
}
