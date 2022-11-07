import { t } from "i18next";
import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";
import BranchCard from "../../components/BranchCard/BranchCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import SearchArea from "../../components/SearchArea/SearchArea";
import clientServices from "../../services/clientServices";

import "./Branchs.scss";

export default function Branches() {
  const params = useParams();
  let vendorId = params.vendorId;
  let [branchesData, setBranchesData] = useState([]);
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    getBranchesHandler(vendorId);
  }, []);

  async function getBranchesHandler(vendorId) {
    try {
      setLoading(true);
      const { data } = await clientServices.listAllVendorBranches(vendorId);
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
        <div className="branch-cards-container">
          {branchesData.length > 0
            ? branchesData.map((branchData) => {
                return <BranchCard key={branchData._id} branch={branchData} />;
              })
            : null}
        </div>
      )}
    </div>
  );
}
