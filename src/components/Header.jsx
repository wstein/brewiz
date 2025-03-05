export function Header(props) {
  return (
    <div class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div class="max-w-[1800px] mx-auto px-4 py-4">
        {/* Main Header Content */}
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <img src="/homebrew.svg" alt="Homebrew logo" class="w-14 h-14" />
            <div>
              <h1 class="text-4xl font-bold mb-2">Homebrew Package Wizard</h1>
              <p class="text-gray-600">
                Select packages to install on your macOS system
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              onClick={props.onRefresh}
              disabled={props.loading || props.refreshing}
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
              class={`px-4 py-2 rounded-lg transition-colors ${
                props.selectedPackagesCount === 0
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <div class="mt-4">
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
  );
}