# Multicall

借助 [multicall3 合约](https://github.com/mds1/multicall) 将多个合约 `view` 调用汇总到一个或多个 `eth_call` 请求中。Multicall3 在链上执行子调用，JSON-RPC 批处理则只在传输层合并独立请求。

逐个读取会产生多个 RPC 请求。Viem 可按请求大小分批，以减少请求数。

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

默认情况下，逐项检查 [Multicall](https://viem.sh/docs/contract/multicall) 返回的 `status` 和 `error`。如果业务要求任意一项失败时整次读取报错，请传入 `allowFailure: false`。
