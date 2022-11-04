import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import BranchCard from "../../components/BranchCard/BranchCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import SearchArea from "../../components/SearchArea/SearchArea";
import vendorServices from "../../services/vendorServices";
import "./Branchs.scss";
export default function Branches() {
  let vendorId = useSelector((state) => state.auth.vendorId);
  let [branchesData, setBranchesData] = useState([]);
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    getBranchesHandler(vendorId);
  }, []);

  async function getBranchesHandler(vendorId) {
    try {
      setLoading(true);
      const { data } = await vendorServices.listAllBranches(vendorId);
      setLoading(false);
      if (data.success && data.code === 200) {
        setBranchesData(data.records);
      } else {
        throw Error;
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="branchs">
      <SearchArea />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="add-button-container">
            <button
              className="add-button"
              onClick={() => {
                navigate(`/add-branch`);
              }}
            >
              {t("addBranch")}
            </button>
          </div>
          <div className="branch-cards-container">
            {branchesData.length > 0
              ? branchesData.map((branchData) => {
                  return (
                    <BranchCard key={branchData._id} branch={branchData} />
                  );
                })
              : null}
          </div>
        </>
      )}
    </div>
  );
}
