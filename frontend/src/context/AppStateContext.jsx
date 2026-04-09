import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [selectedProduct, setSelectedProductState] = useState(null);
  const [lastPayment, setLastPaymentState] = useState(null);
  const [catalogRefresh, setCatalogRefresh] = useState(0);

  const clearSelectedProduct = useCallback(() => {
    setSelectedProductState(null);
  }, []);

  const clearLastPayment = useCallback(() => {
    setLastPaymentState(null);
  }, []);

  const markCatalogDirty = useCallback(() => {
    setCatalogRefresh((prev) => prev + 1);
  }, []);

  const value = useMemo(
    () => ({
      selectedProduct,
      setSelectedProduct: setSelectedProductState,
      clearSelectedProduct,
      lastPayment,
      setLastPayment: setLastPaymentState,
      clearLastPayment,
      catalogRefresh,
      markCatalogDirty,
    }),
    [
      selectedProduct,
      clearSelectedProduct,
      lastPayment,
      clearLastPayment,
      catalogRefresh,
      markCatalogDirty,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }

  return context;
}
