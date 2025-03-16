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
        <div class="max-w-[1800px] min-w-[1200px] mx-auto px-3 py-2">
          {/* Main Header Content */}
          <div class="grid grid-cols-[2fr_3fr_1fr] gap-4 items-center">
            {/* Column 1: Icon, Title, description */}
            <div class="flex items-start gap-3">
              <a href="https://brew.sh" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Homebrew_logo.svg" alt="Homebrew logo" class="w-16 h-16" />
              </a>
              <div>
                <h1 class="text-2xl font-bold">
                  <a href="https://github.com/wstein/brewiz" target="_blank" rel="noopener noreferrer"
                     class="hover:text-gray-700 hover:underline">Homebrew Package Wizard</a>
                </h1>
                <p class="text-gray-600 text-sm">Select packages to install on your macOS system</p>
              </div>
            </div>

            {/* Column 2: Search and filter */}
            <div class="flex flex-col gap-2">
              <div class="relative">
                <input
                    type="text"
                    placeholder="Search packages..."
                    value={props.searchTerm()}
                    onInput={(e) => props.onSearch(e.target.value)}
                    class="w-full px-3 py-1 h-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="flex gap-4 flex-wrap">
                <div class="flex gap-2 bg-slate-100 border border-slate-300 p-1 rounded-lg">
                  <FilterButton
                      active={props.filters().installed}
                      onClick={() => props.onFilterChange('installed')}
                      label="Installed"
                  />
                  <FilterButton
                      active={props.filters().notInstalled}
                      onClick={() => props.onFilterChange('notInstalled')}
                      label="Not Installed"
                  />
                  <FilterButton
                      active={props.filters().outdated}
                      onClick={() => props.onFilterChange('outdated')}
                      label="Outdated"
                  />
                </div>
                <div class="flex gap-2 bg-slate-100 border border-slate-300 p-1 rounded-lg">
                  <FilterButton
                      active={props.filters().casks}
                      onClick={() => props.onFilterChange('casks')}
                      label="Casks"
                  />
                  <FilterButton
                      active={props.filters().formulae}
                      onClick={() => props.onFilterChange('formulae')}
                      label="Formulae"
                  />
                </div>
              </div>
            </div>

            {/* Column 3: Action buttons and version */}
            <div class="flex flex-col items-end gap-1">
              <div class="flex gap-0.5">
                <button
                    onClick={props.onRefresh}
                    disabled={props.loading || props.refreshing}
                    title="Refresh package list"
                    class={`px-2 py-1.5 text-sm rounded-lg ${props.loading || props.refreshing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                >
                  {(props.loading || props.refreshing) && (
                      <span class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                  )}
                  Refresh
                </button>
                <button
                    onClick={props.onReset}
                    disabled={!props.selectedPackagesCount}
                    title="Clear selected packages"
                    class={`px-2 py-1.5 text-sm rounded-lg ${!props.selectedPackagesCount
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"}`}
                >
                  Reset
                </button>
                <button
                    onClick={handleClose}
                    title="Close Brewiz"
                    class="px-2 py-1.5 text-sm rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Close
                </button>
              </div>
              <div class="text-xs text-gray-500">
              <span>
                {FRONTEND_VERSION === (props?.version?.brewiz || FRONTEND_VERSION)
                    ? <a href={`https://github.com/wstein/brewiz/tree/v${FRONTEND_VERSION}`} target="_blank" rel="noopener noreferrer" class="hover:text-gray-700 hover:underline">brewiz v{FRONTEND_VERSION}</a>
                    : `brewiz v${props.version.brewiz} / app v${FRONTEND_VERSION}`}
              </span>
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

function FilterButton(props) {
  return (
      <button
          onClick={props.onClick}
          class={`px-3 py-1 text-sm rounded-full transition-colors ${
              props.active
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
      >
        {props.label}
      </button>
  );
}