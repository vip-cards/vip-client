import categoryPlaceholder from "assets/images/categoreyPlaceHolder.png";
import { getLocalizedWord } from "helpers/lang";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./CategoryCard.scss";

interface ICategoryCardProps {
  category: IProductCategory;
  vendorId?: string;
}
const AnimatedLink = motion(Link);

export default function CategoryCard({
  category,
  vendorId,
}: ICategoryCardProps) {
  return (
    <AnimatedLink
      layout
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 14,
      }}
      className="category-card block"
      to={
        vendorId
          ? `/vendors/${vendorId}/category/${category._id}`
          : `/categories/${category._id}`
      }
    >
      <div className="category-info-container">
        <div className="category-img-container">
          <img
            src={`${category?.image?.Location ?? categoryPlaceholder}`}
            alt="category-img"
            className="category-img"
          />
        </div>
        <div className="category-title capitalize">
          <p>{getLocalizedWord(category.name)} </p>
        </div>
      </div>
    </AnimatedLink>
  );
}
