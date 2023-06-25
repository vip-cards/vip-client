const { useRef } = require("react");

const WebViewComponent = () => {
  const webviewRef = useRef(null);

  const setupJavascriptChannel = () => {
    if (webviewRef.current) {
      const webView = webviewRef.current;

      webView.addEventListener("message", (event) => {
        // Handle messages received from WebView
        const message = event.data;

      });
    }
  };

  const sendMessageToWebView = () => {
    const message = "Hello, WebView!";
    if (webviewRef.current) {
      const webView = webviewRef.current;
      webView.postMessage(message);
    }
  };

  return (
    <iframe
      ref={webviewRef}
      src="https://example.com"
      onLoad={setupJavascriptChannel}
      style={{ display: "none" }}
    ></iframe>
  );
};
