import BranchProducts from "components/BranchProducts/BranchProducts";
import Footer from "components/Footer/Footer";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import Navbar from "components/Navbar/Navbar";
import { ProtectedModule } from "components/auth-components/ProtectedModule";
import { ROUTES } from "constants/routes";
import {
  ApplyJobTab,
  Branch,
  Branches,
  CartPage,
  Categories,
  Chat,
  CreateAd,
  HiringEmployeeTab,
  HiringTabCreateJob,
  HiringTabHome,
  HiringTabViewCreatedJobs,
  Home,
  JobPage,
  Jobs,
  Offers,
  PreviousAds,
  ProductDetails,
  Services,
  SponsorAds,
  Subscribe,
  Vendor,
  VendorCategory,
  Vendors,
  Wishlist,
} from "pages";
import { ServiceDetails } from "pages/Services/ServiceDetails";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { getCurrentCartThunk } from "store/cart-slice";
import AccountBarcode from "views/AccountBarcode/AccountBarcode";
import AccountDetails from "views/AccountDetails/AccountDetails";
import AccountOrders from "views/AccountOrders/AccountOrders";
import AccountWishlist from "views/AccountWishlist/AccountWishlist";
import AccountLayout from "../AccountLayout/AccountLayout";
import "./ClientLayout.scss";
import PostPage from "pages/Jobs/views/PostPage";
import AccountCoupons from "views/AccountCoupons/AccountCoupons";
import AccountLocation from "views/AccountLocation/AccountLocation";
import DynamicPage from "pages/DynamicPage/DynamicPage";
import TransactionProcess from "layouts/TransactionProcess";

const PageLoader = () => (
  <div className="h-[80vh] w-[80vw] m-auto flex justify-center items-center">
    <LoadingSpinner />
  </div>
);

export default function ClientLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentCartThunk());
  }, []);

  return (
    <div className="base-layout">
      <Navbar />
      <div className="base-nav-item"></div>
      <div className="page-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={<Navigate replace to={`/${ROUTES.HOME}`} />}
            />
            <Route
              path="/*"
              element={<Navigate replace to={`/${ROUTES.HOME}`} />}
            />
            <Route path={`/${ROUTES.HOME}`} element={<Home />} />
            <Route path={`/${ROUTES.VENDORS}`} element={<Vendors />} />
            <Route path={`/${ROUTES.OFFERS}`} element={<Offers />} />
            <Route path={`/${ROUTES.PAGE}/:pageId`} element={<DynamicPage />} />
            <Route
              path={`/${ROUTES.SUBSCRIBE}`}
              element={
                <ProtectedModule role="client">
                  <Subscribe />
                </ProtectedModule>
              }
            />
            <Route
              path={`/${ROUTES.HOT_DEALS}`}
              element={<Offers isHotDeal />}
            />
            <Route
              path={`${ROUTES.ADS.MAIN}`}
              element={
                <ProtectedModule role="subscribed">
                  <SponsorAds />
                </ProtectedModule>
              }
            />
            <Route
              path={`/${ROUTES.ADS.MAIN}/${ROUTES.ADS.CREATE}`}
              element={<CreateAd />}
            />
            <Route
              path={`${ROUTES.ADS.MAIN}/${ROUTES.ADS.LIST}`}
              element={<PreviousAds />}
            />

            <Route
              path={`/${ROUTES.CHAT}`}
              element={
                <ProtectedModule role="subscribed">
                  <Chat />
                </ProtectedModule>
              }
            />

            <Route path={`services`} element={<Services />} />
            <Route path={`services/:id`} element={<ServiceDetails />} />
            <Route path={`${ROUTES.JOBS.MAIN}`} element={<Jobs />}>
              <Route path={`posts/:id`} element={<PostPage />} />
              <Route path={`/${ROUTES.JOBS.MAIN}/:id`} element={<JobPage />} />
              <Route
                path={`${ROUTES.JOBS.APPLY}`}
                element={<ApplyJobTab />}
              ></Route>
              <Route path={`hire`} element={<HiringEmployeeTab />}>
                <Route path="home" element={<HiringTabHome />} />
                <Route
                  path="create"
                  element={
                    <ProtectedModule role="subscribed">
                      <HiringTabCreateJob />
                    </ProtectedModule>
                  }
                />
                <Route
                  path="view-created"
                  element={<HiringTabViewCreatedJobs />}
                />
                <Route path="" element={<Navigate to="home" />} />
              </Route>
              <Route
                path=""
                element={<Navigate to={`${ROUTES.JOBS.APPLY}`} />}
              />
            </Route>

            <Route path={`/${ROUTES.CATEGORIES}`} element={<Categories />} />
            <Route
              path={`/${ROUTES.CATEGORIES}/:categoryId`}
              element={<Vendors />}
            />

            <Route path={`/${ROUTES.VENDORS}/:vendorId`} element={<Vendor />} />
            <Route
              path={`/${ROUTES.VENDORS}/:vendorId/branches`}
              element={<Branches />}
            />
            <Route
              path={`/${ROUTES.VENDORS}/:vendorId/:branchId`}
              element={<Branch />}
            >
              <Route path={`${ROUTES.OFFERS}`} element={<BranchProducts />} />
              <Route
                path={`${ROUTES.HOT_DEALS}`}
                element={<BranchProducts />}
              />
              <Route path="" element={<Navigate to={`${ROUTES.OFFERS}`} />} />
            </Route>
            <Route
              path={`/${ROUTES.VENDORS}/:vendorId/category/:categoryId`}
              element={<VendorCategory />}
            />
            <Route
              path={`/${ROUTES.PRODUCT}/:productId`}
              element={<ProductDetails />}
            />

            <Route
              path={`/${ROUTES.WISHLIST}`}
              element={
                <ProtectedModule role="subscribed">
                  <Wishlist />
                </ProtectedModule>
              }
            />

            <Route
              path={`/${ROUTES.ACCOUNT}`}
              element={
                <ProtectedModule role="client">
                  <AccountLayout />
                </ProtectedModule>
              }
            >
              <Route index path="details" element={<AccountDetails />} />
              <Route path="orders" element={<AccountOrders />} />
              {/* <Route path="orders-requests" element={<Account />} /> */}

              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="barcode" element={<AccountBarcode />} />
              <Route path="coupons" element={<AccountCoupons />} />
              <Route path="location" element={<AccountLocation />} />
              <Route path="" element={<Navigate to="details" />} />
            </Route>
            <Route
              path={`/${ROUTES.CART}`}
              element={
                <ProtectedModule role="subscribed">
                  <CartPage />
                </ProtectedModule>
              }
            />
            <Route
              path="/transaction-process"
              element={<TransactionProcess />}
            />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
