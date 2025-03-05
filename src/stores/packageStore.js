import { createSignal } from "solid-js";
import packageData from "../data/packages.json";

export function usePackageStore() {
  const [selectedPackages, setSelectedPackages] = createSignal(new Set());
  const [packages, setPackages] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [refreshing, setRefreshing] = createSignal(false);
  const [usingLocalData, setUsingLocalData] = createSignal(false);

  const API_BASE = "/api/v1";

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

  const loadPackages = async () => {
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

  const refreshPackages = async () => {
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

  const togglePackage = (pkg) => {
    const newSelected = new Set(selectedPackages());
    if (newSelected.has(pkg.name)) {
      newSelected.delete(pkg.name);
    } else {
      newSelected.add(pkg.name);
    }
    setSelectedPackages(newSelected);
  };

  const resetSelection = () => setSelectedPackages(new Set());

  return {
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
  };
}