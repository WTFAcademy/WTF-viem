import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'

const key = process.env.ANVIL_PRIVATE_KEY
if (!key || !/^0x[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error('Set ANVIL_PRIVATE_KEY to a 32-byte local test key with the 0x prefix.')
}

export const account = privateKeyToAccount(key as `0x${string}`)
export const walletClient = createWalletClient({
    account,
    chain: foundry,
    transport: http('http://127.0.0.1:8545'),
})
