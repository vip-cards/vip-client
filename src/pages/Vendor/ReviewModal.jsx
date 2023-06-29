import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import Modal from "components/Modal/Modal";
import RatingStars from "components/RatingStars/RatingStars";
import { getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";

const ReviewModal = ({ isVisible, onClose, reviews }) => {
  const auth = useSelector(selectAuth);
  const { vendorId } = useParams();
  const { t } = useTranslation();

  const [reviewFormExpand, setReviewFormExpand] = useState(false);
  const [review, setReview] = useState({});
  const formDataList = [
    {
      name: "rating",
      type: "list",
      identifier: "name",
      list: [
        { name: { en: 1, ar: 1 } },
        { name: { en: 2, ar: 2 } },
        { name: { en: 3, ar: 3 } },
        { name: { en: 4, ar: 4 } },
        { name: { en: 5, ar: 5 } },
      ],
      required: false,
    },
    { name: "review", type: "textarea", required: false },
  ];
  function handleReviewSubmit(e) {
    e.preventDefault();

    clientServices
      .createProductReview({
        client: auth.userId,
        vendor: vendorId,
        rating: +review.rating,
        review: review.review,
        type: "vendor",
      })
      .then(() => {
        toastPopup.success("Review Added!");
      })
      .catch(() => {
        toastPopup.error("Something Went Wrong!");
      })
      .finally(() => {
        handleModalClose();
      });
  }

  const handleModalClose = () => {
    setReviewFormExpand(false);
    setReview({});
    onClose();
  };

  if (!reviews) return null;
  return (
    <Modal
      visible={isVisible}
      title="Review"
      className="flex flex-col gap-4"
      onClose={handleModalClose}
    >
      <aside
        className="ring-1 ring-primary/30 rounded-lg bg-primary/90 text-white font-semibold py-2 cursor-pointer w-5/6 mx-auto px-3"
        onClick={() => setReviewFormExpand((p) => !p)}
      >
        <div className="flex flex-row flwx-nowrap w-full justify-between items-center">
          <span>{t("writeAReview")} ?</span>
          <FontAwesomeIcon
            icon={faCaretDown}
            className={classNames("transition-transform", {
              "rotate-180": reviewFormExpand,
            })}
          />
        </div>
      </aside>
      <section
        className={classNames("px-8 overflow-hidden transition-all", {
          "h-0": !reviewFormExpand,
          "h-[40rem] overflow-y-scroll": reviewFormExpand,
        })}
      >
        <div className="bg-white p-6 rounded-lg shadow-md max-w-[50rem] mx-auto px-12 py-8">
          <h2 className="text-xl font-bold mb-4">Write a review</h2>
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
            {formDataList.map((formInput) => {
              return (
                <div className="mb-4" key={formInput.name}>
                  <MainInput
                    {...formInput}
                    state={review}
                    setState={setReview}
                  />
                </div>
              );
            })}

            <MainButton type="submit">{t("confirm")}</MainButton>
          </form>
        </div>
      </section>
      <section className="max-h-[30%] overflow-y-scroll shadow-primary/50 rounded-md p-3 m-3 shadow-inner">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="flex flex-col px-3 gap-3 border-b-[1px] border-b-slate-300 mb-3 pb-3"
          >
            <div className="flex flex-row justify-between gap-3">
              <h6 className="capitalize font-semibold">
                {getLocalizedWord(review.client.name)}
              </h6>
              <div>
                <RatingStars rate={review.rating ?? 0} />
              </div>
            </div>
            <div className="px-1">{review.review}</div>
          </div>
        ))}
      </section>
    </Modal>
  );
};

export default ReviewModal;
