import { getLocalizedWord } from "helpers/lang";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import clientServices from "services/clientServices";
import { ReactComponent as VendorLogoOrange } from "assets/VIP-ICON-SVG/VendorLogoOrange.svg";

function Support() {
  const { pageId } = useParams();

  const [page, setPage] = useState({});

  async function getPageHandler() {
    const data = await clientServices.getPageByType({ type: "about" });
    setPage(data);
  }

  useEffect(() => {
    getPageHandler();
  }, []);

  if (!page) return null;
  return (
    <>
      <div className="w-full h-50 flex items-center justify-center">
        <VendorLogoOrange
          className="w-50 h-50"
          width={"100px"}
          height={"100px"}
        />
      </div>
      <div className="app-card-shadow m-8 max-w-4xl mx-auto p-8 min-h-[50vh]">
        <header className="text-center text-4xl font-bold mb-5 uppercase text-primary">
          {page.type}
        </header>
        <main className="px-1">
          <h5 className="font-semibold">{getLocalizedWord(page.name)}</h5>
          <p className="font-medium text-justify mt-4 px-1">
            {getLocalizedWord(page.content)}
          </p>
        </main>
      </div>
      <div className="app-card-shadow m-8 max-w-4xl mx-auto p-8 min-h-[50vh]">
        <header className="text-center text-4xl font-bold mb-5 uppercase text-primary">
          contact us
        </header>
        <main className="px-1">
          <h5 className="font-semibold">vipcardsshop@gmail.com</h5>
        </main>
      </div>
    </>
  );
}

export default Support;
