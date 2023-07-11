import classNames from "classnames";
import { MainButton } from "components/Buttons";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import Modal from "components/Modal/Modal";

import toastPopup from "helpers/toastPopup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";

const DeleteReviewModal = ({
  isVisible,
  onClose,
  reviwData = { rating: 0, review: "" },
}) => {
  const auth = useSelector(selectAuth);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [review, setReview] = useState(reviwData);

  const [loading, setLoading] = useState(false);

  function handleReviewSubmit(e) {
    e.preventDefault();
    setLoading(true);
    clientServices
      .deleteReview({ _id: reviwData._id, client: auth.userId })
      .then(() => {
        toastPopup.success("Review Deleted!");
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
            <h2 className="text-xl font-bold mb-4">
              Are You Sure You you wanna delete this Review?
            </h2>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              <MainButton type="submit">{t("remove")}</MainButton>
            </form>
          </div>
        </section>
      )}
    </Modal>
  );
};

export default DeleteReviewModal;
