import { useAppState } from '../context/AppStateContext.jsx';

export function useCatalogState() {
  const { catalogRefresh, markCatalogDirty } = useAppState();

  return {
    catalogRefresh,
    markCatalogDirty,
  };
}
