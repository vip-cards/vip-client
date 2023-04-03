import classNames from "classnames";
import ProductCard from "components/Cards/ProductCard/ProductCard";
import { getLocalizedWord } from "helpers/lang";
import { useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";
import "./Offers.scss";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";

export default function Offers() {
  const [filter, setFilter] = useState({ vendor: [], category: [] });
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: products,
    error,
    isLoading: productsLoading,
    isValidating,
    mutate,
  } = useSWR("all-products", clientServices.listAllProducts);

  const toggleFilter = (arrayKey = "vendors", itemId) => {

    const newVendorFilterList = [...filter[arrayKey]];
    const idx = filter[arrayKey].findIndex((value) => value === itemId);
    if (idx > -1) {
      newVendorFilterList.splice(idx, 1);
    } else {
      newVendorFilterList.push(itemId);
    }

    setFilter((filters) => ({ ...filters, [arrayKey]: newVendorFilterList }));
  };

  const productListRender = () => {
    if (productsLoading) return <LoadingSpinner />;
    if (!products.length) return <NoData />;
    const filteredProducts = products.filter((product) => {
      const isInVendor = filter.vendor.length
        ? filter.vendor?.includes(product.vendor._id)
        : true;
      const isInCategory = filter.category.length
        ? filter.category?.includes(product.category._id)
        : true;
      return isInVendor && isInCategory;
    });
    return filteredProducts.map((offer) => {
      return <ProductCard key={offer._id} product={offer} />;
    });
  };

  return (
    <div className="flex flex-row p-8 gap-4 min-h-[80vh] max-h-screen overflow-hidden">
      <aside className="flex flex-col w-40 mr-4 border-r-2 h-inherit max-h-[85vh] overflow-y-auto border-black/50 ">
        <h5>Filter by</h5>
        <FilterGroup
          listApi={clientServices.listAllVendors}
          title="vendor"
          onToggle={toggleFilter}
          filter={filter}
        />
        <FilterGroup
          listApi={clientServices.listAllCategories}
          title="category"
          onToggle={toggleFilter}
          filter={filter}
        />
      </aside>
      <div className="flex flex-row w-full h-full gap-8 flex-wrap max-h-[85vh] overflow-y-auto p-5">
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
        {productListRender()}
      </div>
    </div>
  );
}

const FilterToggle = ({ name = "filter", onToggle, selected = false, id }) => {
  const handleFilterToggle = () => {
    onToggle(id);
  };

  return (
    <button
      className="group  max-w-full flex flex-row w-full flex-nowrap justify-between items-center my-1 px-2 border-b-[1px] border-slate-400"
      onClick={handleFilterToggle}
    >
      <p className="text-lg">{name}</p>
      <div
        className={classNames("w-4 h-4 rounded-full border-2 border-black", {
          "bg-primary": selected,
          "bg-transparent group-hover:bg-primary/50": !selected,
        })}
      ></div>
    </button>
  );
};

const FilterGroup = ({ title, filter, onToggle, listApi }) => {
  const { data: list, isLoading: vendorsLoading } = useSWR(
    `all-${title}s`,
    listApi
  );
  const group = filter[title];
  return (
    <div className="py-5 px-1 max-w-full">
      <h6 className="font-semibold capitalize">{title}</h6>
      {list?.map((item) => (
        <FilterToggle
          onToggle={(id) => onToggle(title, id)}
          selected={group.includes(item._id)}
          name={getLocalizedWord(item.name)}
          id={item._id}
        />
      ))}
    </div>
  );
};
