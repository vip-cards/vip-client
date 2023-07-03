export const LoadingSkeleton = ({ width = "16rem", height = "1.7rem" }) => (
  <div
    className="animate-pulse bg-primary/20 rounded-lg"
    style={{ width, height }}
  ></div>
);

export const withLoadingSkeleton = function (
  Component = <></>,
  isLoading = false,
  width = "100%",
  height = "100%"
) {
  if (isLoading) return <LoadingSkeleton width={width} height={height} />;
  else return Component;
};
