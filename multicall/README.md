# Multicall

借助 [multicall3 合约](https://github.com/mds1/multicall) 在单个 RPC 中批量调用多个合约 `view` 函数

通常，我们想调用合约的 `view` 函数时，每一次查询对应一次 RPC 调用，但假如使用的 RPC 不稳定，就容易导致我们批量查询结果不完整，这时 Multicall 的优势就体现出来了

## 演示

```typescript
const wagmiContract = {
  address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2", // 要查询的合约地址
  abi: abi,
} as const;

const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const results = await publicClient.multicall({
  contracts: [
    {
      ...wagmiContract,
      functionName: "totalSupply",
    },
    {
      ...wagmiContract,
      functionName: "name",
    },
    {
      ...wagmiContract,
      functionName: "balanceOf",
      args: [account],
    },
  ],
});
```

在这段代码中，查询了以太坊主网上 WAGMI 代币的总供应量、代币名称和指定账户地址的代币余额

返回结果 (results) 如下：

```bash
[
  {
    result: 626n,
    status: "success",
  }, {
    result: "wagmi",
    status: "success",
  }, {
    result: 0n,
    status: "success",
  }
]
```

该接口的实质是调用了 Multicall3 合约的 aggregate3 函数

```solidity
function aggregate3(Call3[] calldata calls) external payable returns (Result[] memory returnData);
```

viem 源码

```typescript
const aggregate3Results = await Promise.allSettled(
  chunkedCalls.map((calls) =>
    getAction(
      client,
      readContract,
      "readContract"
    )({
      abi: multicall3Abi,
      address: multicallAddress!,
      args: [calls],
      blockNumber,
      blockTag,
      functionName: "aggregate3",
      stateOverride,
    })
  )
);
```

使用 [Multicall](https://viem.sh/docs/contract/multicall) 可以减少 RPC 调用次数，避免批量查询数据不完整。目前只在 viem 和 ethers-rs 有专门接口封装，可以算是优于 ethers 的一个 feature
