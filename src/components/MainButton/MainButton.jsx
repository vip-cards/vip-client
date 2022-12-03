import "./MainButton.scss";

export default function MainButton({
  text = "",
  loading = false,
  className,
  ...props
}) {
  return (
    <button className={"main-button " + className} {...props}>
      {loading ? <i className="fas fa-spinner fa-spin "></i> : text}
    </button>
  );
}
