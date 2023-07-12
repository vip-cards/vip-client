import { getLocalizedNumber } from "helpers/lang";

export function cartRender(cartProducts: any) {
  return (children) => (
    <div className="relative">
      {!!cartProducts?.length && (
        <div className="h-5 p-1 w-5 bg-secondary text-white absolute -right-1 ring-primary ring-2 -top-1 flex justify-center items-center rounded-full text-xs">
          {getLocalizedNumber(cartProducts?.length)}
        </div>
      )}
      {children}
    </div>
  );
}
