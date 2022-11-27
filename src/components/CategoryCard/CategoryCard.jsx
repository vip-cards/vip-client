import React from "react";
import i18n from "../../locales/i18n";
import { useNavigate } from "react-router";

import "./CategoryCard.scss";

export default function CategoryCard({ category }) {
  const lang = i18n.language;
  const navigate = useNavigate();

  return (
    <div
      className="category-card"
      onClick={() => {
        navigate(`/categories/${category._id}`);
      }}
    >
      <div className="category-info-container">
        <div className="category-img-container">
          <img
            src={`${category?.image?.Location}`}
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
