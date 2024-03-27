# Transaction

发送交易上链

### 直接发送交易上链

```typescript
const hash = await walletClient.sendTransaction({ 
  account,
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value
: 1000000000000000000n
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

我们在填写了 from, to, value 字段后调用 `prepareTransactionRequest` 函数，会向节点发起 RPC 请求获取交易其他字段的值，从而将交易的字段填写完整，结果如下

```typescript
{
  account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  maxFeePerGas: 150000000000n,
  maxPriorityFeePerGas: 1000000000n,
  nonce: 69,
  type: 'eip1559',
  value: 1000000000000000000n
}
```

### 2.对交易请求签名

获取了交易请求后，需要对交易进行签名

```typescript
const signature = await walletClient.signTransaction(request)
// 0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33
```

### 3.广播交易

在对交易请求签名后，就可以广播上链了

```typescript
const hash = await walletClient.sendRawTransaction({ serializedTransaction: signature })
```

总结：所以 `sendTransaction` 其实是对上述 3 步的封装

## 快速打铭文的思考

在了解了交易从构造到广播上链的过程后，不知道友友们有没有想到如何更快的打铭文呢

在使用一些批量打铭文工具时（例如 OKX Wallet 的批量打铭文功能）我们用的其实是 `sendTransaction` 只不过是包在一个循环体内

那么我们每打一次铭文，就要调用一次 `prepareTransactionRequest` 函数（进行一次 RPC 调用）来补齐其他参数。在一些非主流链打过铭文的朋友肯定都知道，当打铭文热度高时 RPC 是极其不稳定的，所以我们是不是可以使用拆分发送交易的方式，来减少构造交易请求时的 RPC 调用呢。

要知道，打铭文本质是自己给自己转账，一个区块内的不同转账交易，只有 nonce 字段不同（递增），在相邻的几个区块，往往 gas 变化不大

我们可以先本地构建好交易请求，再一次批量打包发送到链上，是不是会高效很多

代码可以参考 [这里](./index.ts) 

