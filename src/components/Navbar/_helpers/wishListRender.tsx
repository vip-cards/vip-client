import { getLocalizedNumber } from "helpers/lang";

export function wishListRender(wishlist: any) {
  return (children) => (
    <div className="relative">
      {!!wishlist.ids.length && (
        <div className="h-5 p-1 w-5 bg-secondary/95 text-white absolute -right-1 ring-primary ring-2 -top-1 flex justify-center items-center rounded-full text-xs">
          {getLocalizedNumber(wishlist.ids.length)}
        </div>
      )}
      {children}
    </div>
  );
}
