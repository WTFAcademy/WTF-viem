import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
});

const abi = parseAbi([
    'function totalSupply() view returns (uint256)',
    'function name() view returns (string)',
    'function balanceOf(address) view returns (uint256)'
]);

const wagmiContract = {
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: abi
} as const

const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const results = await publicClient.multicall({
    contracts: [
        {
            ...wagmiContract,
            functionName: 'totalSupply',
        },
        {
            ...wagmiContract,
            functionName: 'name'
        },
        {
            ...wagmiContract,
            functionName: 'balanceOf',
            args: [account]
        }
    ]
});

console.log(results);

// [
//     {
//         result: 626n,
//         status: "success",
//     }, {
//         result: "wagmi",
//         status: "success",
//     }, {
//         result: 0n,
//         status: "success",
//     }
// ]