import { createSignal, onMount } from "solid-js";
import { usePackageStore } from "./stores/packageStore";
import { Header } from "./components/Header";
import { PackageList } from "./components/PackageList";
import { BrewCommands } from "./components/BrewCommands";

function App() {
  const { 
    packages,
    loading,
    error,
    refreshing,
    usingLocalData,
    selectedPackages,
    loadPackages,
    refreshPackages,
    resetSelection,
    togglePackage
  } = usePackageStore();

  onMount(loadPackages);

  return (
    <div class="min-h-screen bg-gray-100">
      <Header
        loading={loading()}
        refreshing={refreshing()}
        error={error()}
        onRefresh={refreshPackages}
        onReset={resetSelection}
        selectedPackagesCount={selectedPackages().size}
        usingLocalData={usingLocalData()}
      />

      <PackageList 
        packages={packages()}
        selectedPackages={selectedPackages()}
        onPackageToggle={togglePackage}
      />

      <BrewCommands
        categories={packages()}
        selectedPackages={selectedPackages}
      />
    </div>
  );
}

export default App;