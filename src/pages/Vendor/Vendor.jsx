import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BranchCard, CategoryCard, ProductCard } from "components/Cards";
import { t } from "i18next";
import i18n from "locales/i18n";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { createRoom } from "services/socket/chat";
import { selectAuth } from "store/auth-slice";
import Carousel from "../../components/Carousel/Carousel";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import clientServices from "../../services/clientServices";
import "./Vendor.scss";

export default function Vendor() {
  const params = useParams();
  const vendorId = params.vendorId;
  const lang = i18n.language;

  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState({});
  const [branches, setBranches] = useState([]);
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const auth = useSelector(selectAuth);
  const navigate = useNavigate();

  async function getVendorDataHandler() {
    setVendor({});
    setBranches([]);
    setOffers([]);
    setLoading(true);
    try {
      const { data: vendor } = await clientServices.getVendor(vendorId);
      setVendor(vendor.record[0]);

      const { data: allCategories } =
        await clientServices.listAllVendorCategories(vendorId);
      setCategories(allCategories?.records);

      const { data: allBranches } = await clientServices.listAllVendorBranches(
        vendorId
      );

      setBranches(allBranches?.records);
      setLoading(false);

      const { data: allOffers } = await clientServices.listAllVendorProducts(
        vendorId
      );
      setOffers(allOffers?.records);
    } catch (e) {
      setLoading(false);
    }
  }

  function startChatHandler() {
    createRoom({ vendor: vendorId });
  }

  useEffect(() => {
    getVendorDataHandler();
  }, [vendorId]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="client-vendor-home">
      <div className="rounded-2xl border-2 p-4 flex flex-row justify-between mx-8">
        <h4 className="text-primary">{vendor?.name?.[lang]}</h4>
        <button
          className="flex flex-row gap-3 justify-center items-center cursor-pointer p-0 m-0"
          onClick={startChatHandler}
        >
          <span className="font-semibold text-primary">Chat with us</span>
          <FontAwesomeIcon
            icon={faCommentDots}
            size="2x"
            className="text-primary"
          />
        </button>
      </div>
      {categories && categories.length > 0 ? (
        <div className="carousel-container">
          <div className="add-button-container">
            <button
              className="add-button"
              onClick={() => {
                navigate(`/vendors/${vendorId}/categories`);
              }}
            >
              {t("showAllCategories")}
            </button>
          </div>
          <Carousel
            data={categories}
            autoplay={false}
            extraLarge={3.25}
            midLarge={3}
            large={2.5}
            medium={2}
            largeSmall={1.75}
            midSmall={1.5}
            extraSmall={1}
            render={(props) => {
              return <CategoryCard category={props} vendorId={vendorId} />;
            }}
          />
        </div>
      ) : null}
      {branches.length > 0 ? (
        <div className="carousel-container">
          <div className="add-button-container">
            <button
              className="add-button"
              onClick={() => {
                navigate(`/vendors/${vendorId}/branches`);
              }}
            >
              {t("showallBranches")}
            </button>
          </div>
          <Carousel
            data={branches}
            autoplay={false}
            extraLarge={3.25}
            midLarge={3}
            large={2.5}
            medium={2}
            largeSmall={1.75}
            midSmall={1.5}
            extraSmall={1}
            render={(props) => {
              return <BranchCard branch={props} />;
            }}
          />
        </div>
      ) : null}

      {offers.length > 0 ? (
        <div className="carousel-container">
          {/* <div className="add-button-container">
            <button
              className="add-button"
              onClick={() => {
                navigate(`/offers`);
              }}
            >
              {t("showAllOffers")}
            </button>
          </div> */}
          <div className="products-container">
            {offers.map((offer) => {
              return <ProductCard key={offer._id} product={offer} />;
            })}
          </div>

          {/* <Carousel
            data={offers}
            autoplay={false}
            extraLarge={4.5}
            midLarge={4}
            large={3.5}
            medium={3}
            largeSmall={2.5}
            midSmall={2}
            extraSmall={1.25}
            render={(props) => {
              return <ProductCard product={props} />;
            }}
          /> */}
        </div>
      ) : null}
    </div>
  );
}
