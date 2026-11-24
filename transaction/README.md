# Transaction

启动本地 Anvil 节点，并将启动时显示的一个测试私钥设为 `ANVIL_PRIVATE_KEY`。在仓库根目录运行 `pnpm install --frozen-lockfile` 安装依赖，再运行 `pnpm transaction` 会准备并签名一笔本地测试交易，输出序列化结果。

### 直接发送交易上链

```typescript
const hash = await walletClient.sendTransaction({ 
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n
})
```

用户创建 walletClient 填写 tx 相关字段，通过 `sendTransaction` 直接将交易发送到链上

### 拆分交易上链过程

拆分上述的 `sendTransaction` 函数从构造参数到广播到链上的过程

#### 1.构造交易参数

通过 `prepareTransactionRequest` 函数来构造交易的参数

```typescript
const request = await walletClient.prepareTransactionRequest({ 
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n
})
```

我们在填写了 account、to 和 value 字段后调用 `prepareTransactionRequest` 函数，会向节点发起 RPC 请求获取交易其他字段的值，从而将交易的字段填写完整，结果如下

```typescript
{
  account, // privateKeyToAccount 返回的本地账户
  to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  maxFeePerGas: 150000000000n,
  maxPriorityFeePerGas: 1000000000n,
  gas: 21000n,
  nonce: 69,
  type: 'eip1559',
  value: 1000000000000000000n
}
```

### 2.对交易请求签名

获取了交易请求后，需要对交易进行签名

```typescript
const serializedTransaction = await walletClient.signTransaction(request)
// 0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33
```

### 3.广播交易

在对交易请求签名后，就可以广播上链了

```typescript
const hash = await walletClient.sendRawTransaction({ serializedTransaction })
```

总结：所以 `sendTransaction` 其实是对上述 3 步的封装

[可运行示例](./index.ts)演示构造和签名。广播时可将签名后的序列化交易传给上面的 `sendRawTransaction`。
