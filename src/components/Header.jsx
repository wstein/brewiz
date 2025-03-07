const FRONTEND_VERSION = import.meta.env.PACKAGE_VERSION;

export function Header(props) {
  const handleClose = async () => {
    try {
      await fetch('/api/v1/terminate', { method: 'POST' });
      // Try different methods to close the browser tab/window
      window.close();
      // Fallback for browsers that block window.close()
      if (window.opener) {
        window.opener.close();
      }
      // Additional fallback
      window.location.href = 'about:blank';
    } catch (error) {
      console.error('Failed to terminate server:', error);
    }
  };

  return (
    <div class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div class="max-w-[1800px] mx-auto px-3 py-2">
        {/* Main Header Content */}
        <div class="flex items-start gap-3">
          <img src="/homebrew.svg" alt="Homebrew logo" class="w-16 h-16" />
          <div class="flex-grow">
            <div class="flex justify-between items-center">
              <h1 class="text-2xl font-bold">Homebrew Package Wizard</h1>
              <div class="flex gap-1">
                <button
                  onClick={props.onRefresh}
                  disabled={props.loading || props.refreshing}
                  title="Refresh package list"
                  class={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    props.loading || props.refreshing
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {(props.loading || props.refreshing) && (
                    <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  Refresh
                </button>
                <button
                  onClick={props.onReset}
                  disabled={props.selectedPackagesCount === 0}
                  title="Clear all selected packages"
                  class={`px-4 py-2 rounded-lg transition-colors ${
                    props.selectedPackagesCount === 0
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  Reset All
                </button>
                <button
                  onClick={handleClose}
                  title="Close Brewiz"
                  class="px-4 py-2 rounded-lg transition-colors bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Close
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center mt-1">
              <p class="text-gray-600 text-sm">
                Select packages to install on your macOS system
              </p>
              {props.version && (
                <div class="text-xs text-gray-500">
                  {FRONTEND_VERSION === props.version.brewiz
                    ? `v${FRONTEND_VERSION}`
                    : `brewiz v${props.version.brewiz} /  v${FRONTEND_VERSION}`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div class={`${(props.loading || props.usingLocalData || props.refreshing) ? 'mt-6 mb-2' : 'mt-1'} flex justify-between items-end`}>
          <div class="flex-grow">
            {props.loading && (
              <div class="flex items-center justify-center p-4">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}

            {props.usingLocalData && !props.loading && (
              <div class="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 rounded-lg p-4">
                <h3 class="font-bold">Using local package data</h3>
                <p class="text-sm">
                  The API server is not available. Using built-in example data instead.
                </p>
              </div>
            )}

            {props.refreshing && !props.loading && (
              <div class="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
                <h3 class="font-bold flex items-center">
                  <span class="inline-block w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  Refreshing brew data...
                </h3>
                <p>Please wait while we refresh package information.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}