import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

export const walletClient = createWalletClient({
    chain: mainnet,
    transport: http()
})

export const account = privateKeyToAccount("0x");