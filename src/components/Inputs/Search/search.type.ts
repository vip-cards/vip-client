export interface ISearchProps {
  setSearchQuery: (query: string) => void;
  setQueryParams?: React.Dispatch<React.SetStateAction<any>>;
  onClick: () => void;
  types?: string[];
  withSelector?: boolean;
}
