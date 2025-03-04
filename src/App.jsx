import { createSignal, onMount, For } from "solid-js";
import { CategorySection } from "./components/CategorySection";
import { BrewCommands } from "./components/BrewCommands";
import { Header } from "./components/Header";

function App() {
  const [selectedPackages, setSelectedPackages] = createSignal(new Set());
  const [packageData, setPackageData] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [refreshing, setRefreshing] = createSignal(false);

  const API_BASE = "/api/v1";

  // Fetch data from API
  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      setError(error.message);
      throw error;
    }
  };

  // Load initial package data
  const loadPackageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData("/packages");
      setPackageData(data);
      setSelectedPackages(new Set());
    } catch (error) {
      setPackageData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler for refresh button
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await fetchData("/reload");
      setPackageData(data);
      setSelectedPackages(new Set());
    } catch (error) {
      // Error already set in fetchData
    } finally {
      setRefreshing(false);
    }
  };

  // Toggle package selection
  const handlePackageToggle = (pkg) => {
    const newSelected = new Set(selectedPackages());
    if (newSelected.has(pkg.name)) {
      newSelected.delete(pkg.name);
    } else {
      newSelected.add(pkg.name);
    }
    setSelectedPackages(newSelected);
  };

  // Reset selections
  const handleReset = () => setSelectedPackages(new Set());

  // Load data on component mount
  onMount(loadPackageData);

  // Render status messages (loading, error, refreshing)
  const renderStatusMessages = () => (
    <>
      {loading() && (
        <div class="flex items-center justify-center p-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error() && !loading() && (
        <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <h3 class="font-bold">Error loading package data</h3>
          <p>{error()}</p>
          <p class="text-sm mt-2">Please check if the API server is running.</p>
        </div>
      )}

      {refreshing() && !loading() && (
        <div class="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-6">
          <h3 class="font-bold flex items-center">
            <span class="inline-block w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            Refreshing brew data...
          </h3>
          <p>Please wait while we refresh package information.</p>
        </div>
      )}
    </>
  );

  return (
    <div class="min-h-screen bg-gray-100">
      <Header
        loading={loading()}
        refreshing={refreshing()}
        error={error()}
        onRefresh={handleRefresh}
        onReset={handleReset}
        selectedPackagesCount={selectedPackages().size}
      />

      <div class="max-w-[1800px] mx-auto px-4 py-8 pb-64 mt-32">
        <div class="space-y-6">
          <For each={packageData()}>
            {(category) => (
              <CategorySection
                category={category}
                selectedPackages={selectedPackages()}
                onPackageToggle={handlePackageToggle}
              />
            )}
          </For>
        </div>
      </div>

      <BrewCommands
        categories={packageData()}
        selectedPackages={selectedPackages}
      />
    </div>
  );
}

export default App;
