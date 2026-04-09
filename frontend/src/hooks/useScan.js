import { useAppState } from '../context/AppStateContext.jsx';

export function useScanState() {
  const {
    selectedProduct,
    setSelectedProduct,
    clearSelectedProduct,
    lastPayment,
    setLastPayment,
    clearLastPayment,
  } = useAppState();

  return {
    selectedProduct,
    setSelectedProduct,
    clearSelectedProduct,
    lastPayment,
    setLastPayment,
    clearLastPayment,
  };
}
