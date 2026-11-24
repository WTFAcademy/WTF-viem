import { account, walletClient } from './config'

async function main() {
    const request = await walletClient.prepareTransactionRequest({
        account,
        to: account.address,
        value: 0n,
    })
    const serializedTransaction = await walletClient.signTransaction(request)
    console.log('已签名交易（未广播）:', serializedTransaction)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
