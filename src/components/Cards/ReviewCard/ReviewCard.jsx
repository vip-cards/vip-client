import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useState } from "react";
import "./ReviewCard.scss";
import RatingStars from "components/RatingStars/RatingStars";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewModal from "./DeleteReviewModal";

export default function ReviewCard({ review: reviewData }) {
  const [showRewiwModal, setShowRewiwModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleShowInfo() {
    setShowRewiwModal((p) => !p);
  }
  function handleShowDelete() {
    setShowDeleteModal((p) => !p);
  }

  let reviewType = reviewData?.type;
  let product = reviewType === "product" ? reviewData?.product : {};
  let rating = reviewData?.rating;
  let review = reviewData?.review;
  let reviewDate = reviewData?.timestamp;
  let vendor = reviewData?.vendor;
  let _id = reviewData?._id;

  let currentReview = { _id, rating, review };
  return (
    <div className="flex flex-col">
      <article className="review-card relative">
        <div className="order-vendor-name">
          {reviewType === "vendor" ? (
            <a className="vendor-name-link" href={`/vendors/${vendor._id}`}>
              <span>{getLocalizedWord(vendor?.name) || "Vendor name"}</span>
            </a>
          ) : (
            <a className="vendor-name-link" href={`/product/${product._id}`}>
              <span>{getLocalizedWord(product?.name) || "Vendor name"}</span>
            </a>
          )}
          <RatingStars rate={rating ?? 0} />
          <span className="number">{rating ?? 0}</span>
        </div>

        <div className="order-status">
          <span className={"pending" || ""}>{reviewType}</span>
        </div>

        <div className="order-date">
          {dayjs(reviewDate).format("DD/MM/YYYY")}
        </div>

        <div className="order-points">
          <p className="text">{review}</p>
        </div>

        <div className="actions-container">
          <button onClick={handleShowInfo}>
            <FontAwesomeIcon
              icon={faEdit}
              className="shadow-md hover:shadow hover:bg-primary transition-opacity text-white bg-primary/60 rounded-full p-1.5 aspect-square w-3 h-3"
            />
          </button>
          <button onClick={handleShowDelete}>
            <FontAwesomeIcon
              icon={faTrash}
              className="shadow-md hover:shadow hover:bg-primary transition-opacity text-white bg-primary/60 rounded-full p-1.5 aspect-square w-3 h-3"
            />
          </button>
        </div>
      </article>

      <EditReviewModal
        isVisible={showRewiwModal}
        onClose={handleShowInfo}
        reviwData={currentReview}
      />
      <DeleteReviewModal
        isVisible={showDeleteModal}
        onClose={handleShowDelete}
        reviwData={currentReview}
      />
    </div>
  );
}
