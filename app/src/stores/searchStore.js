import { createSignal } from "solid-js";

export function useSearchStore() {
  const [searchTerm, setSearchTerm] = createSignal("");
  const [filters, setFilters] = createSignal({
    installed: true,
    notInstalled: true,
    outdated: true,
    casks: true,
    formulas: true
  });

  const updateFilter = (key, value) => {
    if (!value) {
      if (key === 'casks') {
        setFilters(prev => ({ ...prev, casks: value, formulas: !value }));
        return;
      }
      if (key === 'formulas') {
        setFilters(prev => ({ ...prev, formulas: value, casks: !value }));
        return;
      }
      if (key === 'installed' && !filters().notInstalled && !filters().outdated) {
        setFilters(prev => ({ ...prev, [key]: value, notInstalled: true }));
        return;
      }
      if (key === 'outdated' && !filters().notInstalled && !filters().installed) {
        setFilters(prev => ({ ...prev, [key]: value, notInstalled: true }));
        return;
      }
      if (key === 'notInstalled' && !filters().installed && !filters().outdated) {
        setFilters(prev => ({ ...prev, [key]: value, installed: true }));
        return;
      }
    }
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  const resetFilters = () => {
    setFilters({
      installed: true,
      notInstalled: true,
      outdated: true,
      casks: true,
      formulas: true
    });
    setSearchTerm("");
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    resetFilters
  };
}
