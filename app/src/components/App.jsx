import { createSignal, onMount } from "solid-js";
import { usePackageStore } from "../stores/packageStore";
import { useSearchStore } from "../stores/searchStore";
import { Header } from "./Header";
import { PackageList } from "./PackageList";
import { BrewCommands } from "./BrewCommands";

function App() {
  const { 
    packages,
    loading,
    error,
    refreshing,
    usingLocalData,
    selectedPackages,
    outdatedPackages,
    version,
    loadPackages,
    refreshPackages,
    resetSelection,
    togglePackage,
    loadVersion
  } = usePackageStore();

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    resetFilters
  } = useSearchStore();

  const filteredPackages = () => {
    let filtered = packages();
    
    // Apply search
    if (searchTerm()) {
      const search = searchTerm().toLowerCase();
      filtered = filtered.map(category => ({
        ...category,
        packages: category.packages.filter(pkg =>
          pkg.name.toLowerCase().includes(search) ||
          (pkg.desc && pkg.desc.toLowerCase().includes(search))
        )
      }));
    }

    // Apply filters
    if (!filters().casks || !filters().formulae ||
        filters().installed || filters().notInstalled || filters().outdated) {
      filtered = filtered.map(category => ({
        ...category,
        packages: category.packages.filter(pkg => {
          // Handle type filters
          if (!filters().casks && pkg.cask) return false;
          if (!filters().formulae && !pkg.cask) return false;

          // Handle installation state filters
          if (filters().installed && pkg.installed) return true;
          if (filters().notInstalled && !pkg.installed) return true;
          if (filters().outdated && pkg.outdated) return true;
          
          return false; 
        })
      }));
    }

    // Remove empty categories
    return filtered.filter(category => category.packages.length > 0);
  };

  onMount(() => {
    loadPackages();
    loadVersion();
  });

  return (
    <div class="min-h-screen min-w-[1200px] bg-gray-100">
      <Header
        loading={loading()}
        refreshing={refreshing()}
        error={error()}
        version={version()}
        onRefresh={refreshPackages}
        onReset={resetSelection}
        selectedPackagesCount={selectedPackages().size}
        usingLocalData={usingLocalData()}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        filters={filters}
        onFilterChange={(key) => updateFilter(key, !filters()[key])}
      />

      <PackageList 
        packages={filteredPackages()}
        selectedPackages={selectedPackages()}
        onPackageToggle={togglePackage}
      />

      <BrewCommands
        categories={filteredPackages()}
        selectedPackages={selectedPackages}
        outdatedPackages={outdatedPackages}
      />
    </div>
  );
}

export default App;