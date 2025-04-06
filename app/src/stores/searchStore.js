import { createSignal } from "solid-js";

export function useSearchStore() {
  const [searchTerm, setSearchTerm] = createSignal("");
  const [filters, setFilters] = createSignal({
    installed: true,
    notInstalled: true,
    outdated: true,
    casks: true,
    formulae: true
  });
  const [selectedTags, setSelectedTags] = createSignal([]);
  const [tagSearchTerm, setTagSearchTerm] = createSignal("");

  const updateFilter = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      
      // Handle special filter relationships
      if (key === 'installed' && value) {
        next.outdated = true;
      } else if (key === 'outdated' && !value) {
        next.installed = false;
        next.notInstalled = true;
      } else if ((key === 'casks' || key === 'formulae') && !value) {
        next[key === 'casks' ? 'formulae' : 'casks'] = true;
      }
      
      // Ensure at least one installation filter is active
      if (!next.installed && !next.notInstalled && !next.outdated) {
        next.installed = true;
        next.outdated = true;
      }
      
      return next;
    });
  };

  const resetFilters = () => {
    setFilters({
      installed: true,
      notInstalled: true,
      outdated: true,
      casks: true,
      formulae: true
    });
    setSearchTerm("");
    setSelectedTags([]);
    setTagSearchTerm("");
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    resetFilters,
    selectedTags,
    toggleTag,
    clearTags,
    tagSearchTerm,
    setTagSearchTerm
  };
}
