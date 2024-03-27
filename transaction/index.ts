import { Hex } from "viem";
import { account, walletClient } from "./config";

// data:,{"p":"asc-20","op":"mint","tick":"Monkeys","amt":"1000"
const InscriptionHexData = "0x646174613a2c7b2270223a226173632d3230222c226f70223a226d696e74222c227469636b223a224d6f6e6b657973222c22616d74223a2231303030227d";

async function batchMintInscription() {
    const request_array: any = [];

    const request = await walletClient.prepareTransactionRequest({
        account,
        to: account.address,
        data: InscriptionHexData
    });

    request_array.push(request);

    const signature_array: Hex[] = [];
    for(let i = 0; i < request_array.length; i++) {
        const signature = await walletClient.signTransaction(request_array[i]);
        signature_array.push(signature);
    }

    // broadcast tx
    for(let i = 0; i < signature_array.length; i++) {
        await walletClient.sendRawTransaction({ serializedTransaction: signature_array[i] });
    }
}
