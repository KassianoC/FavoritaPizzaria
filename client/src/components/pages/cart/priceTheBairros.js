import { useEffect } from 'react';

export const PriceTheBairros = (bairro, setTaxa, entregar) => {
  useEffect(() => {
    if (bairro) {
      if (
        bairro === 'Santa Efigênia' ||
        bairro === 'Centro' ||
        bairro === 'Estação' ||
        bairro === 'Jardim Beira Rio' ||
        bairro === 'Res. Jardim Panorama'
      ) {
        setTaxa(5);
      } else {
        setTaxa(8);
      }
    }

    if (!entregar) {
      setTaxa(0);
    }
  }, [bairro, setTaxa, entregar]);
};
