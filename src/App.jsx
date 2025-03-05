import { createSignal, onMount, For } from "solid-js";
import { CategorySection } from "./components/CategorySection";
import { BrewCommands } from "./components/BrewCommands";
import { Header } from "./components/Header";
import packageData from "./data/packages.json";

function App() {
  const [selectedPackages, setSelectedPackages] = createSignal(new Set());
  const [packages, setPackages] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [refreshing, setRefreshing] = createSignal(false);
  const [usingLocalData, setUsingLocalData] = createSignal(false);

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
      setPackages(data);
      setSelectedPackages(new Set());
      setUsingLocalData(false);
    } catch (error) {
      console.warn("API not available, using local package data");
      setPackages(packageData);
      setUsingLocalData(true);
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
      setPackages(data);
      setSelectedPackages(new Set());
      setUsingLocalData(false);
    } catch (error) {
      console.warn("API not available, using local package data");
      setPackages(packageData);
      setUsingLocalData(true);
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

  return (
    <div class="min-h-screen bg-gray-100">
      <Header
        loading={loading()}
        refreshing={refreshing()}
        error={error()}
        onRefresh={handleRefresh}
        onReset={handleReset}
        selectedPackagesCount={selectedPackages().size}
        usingLocalData={usingLocalData()}
      />

      <div class="max-w-[1800px] mx-auto px-4 py-8 pb-64 mt-32">
        <div class="space-y-6">
          <For each={packages()}>
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
        categories={packages()}
        selectedPackages={selectedPackages}
      />
    </div>
  );
}

export default App;