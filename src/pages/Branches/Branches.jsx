import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BranchCard from "../../components/BranchCard/BranchCard";
import SearchArea from "../../components/SearchArea/SearchArea";
import vendorServices from "../../services/vendorSevices";
import "./Branchs.scss";
export default function Branches() {
  let vendorId = useSelector((state) => state.auth.userId);
  let [branchesData, setBranchesData] = useState([]);

  useEffect(() => {
    getBranchesHandler(vendorId);
  }, []);

  async function getBranchesHandler(vendorId) {
    try {
      const { data } = await vendorServices.listAllBranches(vendorId);

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
      <div className="branch-cards-container">
        {branchesData.length > 0
          ? branchesData.map((branchData) => {
              return <BranchCard key={branchData._id} branch={branchData} />;
            })
          : null}
      </div>
    </div>
  );
}
