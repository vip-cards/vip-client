import React from "react";
import { ReactComponent as Error } from "assets/images/ErrorIllustration.svg";
import { Link } from "react-router-dom";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleHomeClick = this.handleHomeClick.bind(this);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }
  handleHomeClick() {
    // Update the state to remove the illustration
    this.setState({ hasError: false });
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex w-screen h-screen justify-center items-center flex-col">
          <Error className="min-w-[200px] w-[80vw] max-w-[720px] h-fit my-8" />
          <h1>Something went wrong!</h1>
          <p>
            You can go{" "}
            <Link
              to="/"
              onClick={this.handleHomeClick}
              className="text-blue-800 font-semibold hover:text-blue-500 cursor-pointer"
            >
              Home
            </Link>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
