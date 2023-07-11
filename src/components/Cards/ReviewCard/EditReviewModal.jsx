import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import Modal from "components/Modal/Modal";
import RatingStars from "components/RatingStars/RatingStars";
import { getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";

const EditReviewModal = ({
  isVisible,
  onClose,
  reviwData = { rating: 0, review: "" },
}) => {
  const auth = useSelector(selectAuth);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [review, setReview] = useState(reviwData);

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

  const [loading, setLoading] = useState(false);
  function handleReviewSubmit(e) {
    e.preventDefault();

    setLoading(true);

    clientServices
      .editReview(
        {
          review: review.review,
          rating: +review.rating,
        },
        { _id: reviwData._id, client: auth.userId }
      )
      .then(() => {
        toastPopup.success("Review Edited!");
        navigate(0);
      })
      .catch(() => {
        toastPopup.error("Something Went Wrong!");
      })
      .finally(() => {
        setLoading(false);
        handleModalClose();
      });
  }

  const handleModalClose = () => {
    onClose();
  };
  return (
    <Modal
      visible={isVisible}
      title="Review"
      className="flex flex-col gap-4"
      onClose={handleModalClose}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section
          className={classNames(
            "px-8 overflow-hidden transition-all",
            "h-[40rem] overflow-y-scroll"
          )}
        >
          <div className="bg-white p-6 rounded-lg shadow-md max-w-[50rem] mx-auto px-12 py-8">
            <h2 className="text-xl font-bold mb-4">Edit Your review</h2>
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

              <MainButton type="submit">{t("edit")}</MainButton>
            </form>
          </div>
        </section>
      )}
    </Modal>
  );
};

export default EditReviewModal;
