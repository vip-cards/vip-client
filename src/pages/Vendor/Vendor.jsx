import { faCommentDots, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { BranchCard, CategoryCard, ProductCard } from "components/Cards";
import NoData from "components/NoData/NoData";
import RatingStars from "components/RatingStars/RatingStars";
import { getLocalizedWord } from "helpers/lang";
import { listRenderFn } from "helpers/rednerFn";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createRoom } from "services/socket/chat";
import useSWR from "swr";
import Carousel from "../../components/Carousel/Carousel";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import clientServices from "../../services/clientServices";

import Pagination from "components/Pagination/Pagination";
import "./Vendor.scss";

const LIMIT = 9;

export default function Vendor() {
  const params = useParams();
  const vendorId = params.vendorId;

  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState({});
  const [branches, setBranches] = useState([]);
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState({ page: 1, limit: LIMIT });

  const { data: productsData, isLoading: productsLoading } = useSWR(
    ["all-products", queryParams],
    () => clientServices.listAllProducts({ ...queryParams })
  );
  const { records: products = undefined, counts: productsCount } =
    productsData ?? {};
  const totalPages = Math.ceil(productsCount / LIMIT);

  const productListRender = () => {
    if (productsLoading) return <LoadingSpinner />;
    if (!products.length) return <NoData />;

    return products.map((offer) => {
      return <ProductCard key={offer._id} product={offer} />;
    });
  };
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

      const allBranches = await clientServices.listAllVendorBranches({
        vendor: vendorId,
      });

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

  const renderOffers = () =>
    listRenderFn({
      isLoading: loading,
      list: offers,
      render: (offer) => <ProductCard key={offer._id} product={offer} />,
    });

  useEffect(() => {
    getVendorDataHandler();
  }, [vendorId]);

  if (loading) return <LoadingSpinner />;
  return (
    <div className="client-vendor-home my-8 app-card-shadow page-wrapper pb-8">
      <header className="rounded-3xl border-b-2 p-4 gap-4 pb-4 flex flex-col justify-between relative border-0">
        <div className="h-48 w-full bg-primary/20 overflow-hidden rounded-lg shadow-lg">
          <img
            src={vendor?.cover?.Location}
            alt={getLocalizedWord(vendor?.name) + " cover"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative pl-36 pt-2 pr-2">
          <div className="w-28 h-28 overflow-hidden rounded-full absolute -top-16 left-7 border-white border-4 shadow">
            <img
              src={vendor?.image?.Location}
              alt={getLocalizedWord(vendor?.name) + " img"}
            />
          </div>
          <div className="flex flex-row gap-3 justify-start items-center mb-3">
            <h4 className="text-primary font-semibold">
              {getLocalizedWord(vendor?.name)}
            </h4>
            <div>
              <RatingStars rate={vendor?.rate ?? 0} />
            </div>
            <div className="ml-auto">
              <span className="text-sm mr-2">
                {vendor?.hasDelivery
                  ? "Delivery Availeble"
                  : "Delivery Not Availeble"}
              </span>
              <FontAwesomeIcon
                icon={faTruckFast}
                size="xl"
                className={classNames({
                  "text-primary": vendor?.hasDelivery,
                  "text-slate-700": !vendor?.hasDelivery,
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center ml-6 pr-2">
          <p className="max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
            {getLocalizedWord(vendor?.description)}
          </p>
          <button
            className="ml-auto flex flex-row gap-3 justify-center items-center cursor-pointer p-0 m-0 min-w-fit"
            onClick={startChatHandler}
          >
            <span className="font-semibold text-primary whitespace-nowrap">
              Chat with us
            </span>
            <FontAwesomeIcon
              icon={faCommentDots}
              size="2x"
              className="text-primary"
            />
          </button>
        </div>
      </header>
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
            extraLarge={1}
            midLarge={1}
            large={1}
            medium={1}
            largeSmall={1}
            midSmall={1}
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
            extraLarge={2.5}
            midLarge={1.85}
            large={1.6}
            medium={1.45}
            largeSmall={1.3}
            midSmall={1}
            extraSmall={1}
            render={(props) => {
              return <BranchCard branch={props} />;
            }}
          />
        </div>
      ) : null}

      <div className="flex flex-row w-full h-full gap-8 flex-wrap p-8 min-h-[12rem] justify-around flex-grow">
        {productListRender()}
      </div>
      <Pagination
        count={totalPages}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </div>
  );
}
