import { getLocalizedWord } from "helpers/lang";
import { useParams } from "react-router";
import clientServices from "services/clientServices";
import useSWR from "swr";

function DynamicPage() {
  const { pageId } = useParams();
  const { data: page } = useSWR(["sub-page", pageId], () =>
    clientServices.getPage(pageId)
  );

  if (!page) return null;
  return (
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
  );
}

export default DynamicPage;
