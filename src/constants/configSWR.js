const STOP_UGLY_CACHEING = {
  revalidateOnFocus: false, // Disable revalidation on window focus
  revalidateOnReconnect: true, // Disable revalidation on reconnect
  refreshWhenHidden: true, // Disable revalidation when the page is hidden
  refreshWhenOffline: true, // Disable revalidation when the user is offline
  shouldRetryOnError: false, // Disable automatic retry on error
};

export default STOP_UGLY_CACHEING;
