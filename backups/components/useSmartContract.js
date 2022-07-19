import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import GNFTArtifacts from '../config/artifacts';

const { address, abi } = GNFTArtifacts;

const useSmartContract = () => {
  const { active, library, chainId } = useWeb3React();

  const gnft = useMemo(() => {
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);

  return gnft;
};

export default useSmartContract;