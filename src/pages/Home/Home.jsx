import React,{ useEffect,useState } from "react";
import clientServices from "../../services/clientServices";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ProductCard from "../../components/ProductCard/ProductCard";
import VendorCard from "../../components/VendorCard/VendorCard";
import BannerCard from "../../components/BannerCard/BannerCard";
import SectionView from "../../views/Home/SectionView/SectionView";

import "./Home.scss";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [banners, setBanners] = useState([]);

  async function getHomeDataHandler() {
    setLoading(true);
    try {
      Promise.any([
        clientServices.listAllBanners().then(({ data }) => {
          setBanners(data?.records);
        }),
        clientServices.listAllVendorCategories().then(({ data }) => {
          setCategories(data?.records);
          return data;
        }),
        clientServices.listAllVendors().then(({ data }) => {
          setVendors(data?.records);
          return data;
        }),
        clientServices.listAllProductsOfType(false).then(({ data }) => {
          setOffers(data?.records);
          return data;
        }),
        clientServices.listAllProductsOfType(true).then(({ data }) => {
          setHotDeals(data?.records);
          return data;
        }),
      ]).then(() => {
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    getHomeDataHandler();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="client-home">
      <section className="home-section">
        <SectionView
          items={banners}
          render={(props) => {
            return <BannerCard banner={props} />;
          }}
        />
      </section>
      <section className="home-section">
        <SectionView
          items={categories}
          link={"/categories"}
          linkTitle={"showAllCategories"}
          render={(props) => {
            return <CategoryCard category={props} />;
          }}
        />
      </section>
      <section className="home-section">
        <SectionView
          items={vendors}
          link={"/vendors"}
          linkTitle={"showAllVendors"}
          render={(props) => {
            return <VendorCard vendor={props} />;
          }}
        />
      </section>
      <section className="home-section">
        <SectionView
          items={offers}
          link={"/offers"}
          linkTitle={"showAllOffers"}
          render={(props) => {
            return <ProductCard product={props} />;
          }}
        />
      </section>
      <section className="home-section">
        <SectionView
          items={hotDeals}
          link={"/hot-deals"}
          linkTitle={"showAllHotDeals"}
          render={(props) => {
            return <ProductCard product={props} />;
          }}
        />
      </section>
    </div>
  );
}

/** OLD FUNCTIONS **
  // let { data: allCategories } = await clientServices.listAllVendorCategories();
  // let { data: allVendors }    = await clientServices.listAllVendors();
  // let { data: allOffers }     = await clientServices.listAllProductsOfType(false);
  // let { data: allHotDeals }   = await clientServices.listAllProductsOfType(true);
  // let { data: allBanners }    = await clientServices.listAllBanners();

  // setCategories(allCategories?.records);
  // setVendors(allVendors?.records);
  // setOffers(allOffers?.records);
  // setHotDeals(allHotDeals?.records);
  // setBanners(allBanners?.records);
 */
