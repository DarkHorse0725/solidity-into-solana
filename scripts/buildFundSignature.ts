import { BigNumberish, ethers, Signer } from 'ethers';

type Domain = {
  name: string;
  version: string;
  chainId: BigNumberish;
  verifyingContract: string;
};

export const buildFundSignature = async (
  signer: Signer,
  domain: Domain,
  IDOToken: string,
  pool: string,
  symbol: string,
  decimals: BigNumberish
) => {
  const signature = await (signer as any)._signTypedData(
    // domain
    domain,
    {
      Fund: [
        { name: 'IDOToken', type: 'address' },
        { name: 'pool', type: 'address' },
        { name: 'symbol', type: 'string' },
        { name: 'decimals', type: 'uint8' },
      ],
    },
    {
      owner: await signer.getAddress(),
      IDOToken,
      pool,
      symbol,
      decimals
    },
  );

  return signature
};
