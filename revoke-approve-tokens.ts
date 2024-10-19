import 'dotenv/config';
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from '@solana-developers/helpers';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { revoke, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';

const DEVNET_URL = clusterApiUrl('devnet');

const TOKEN_MINT_ADDRESS = 'CCGKgi6ZrrZoJSYjVVuTB2qtYYRw6biztCVVzwFRYdnk';

const connection = new Connection(DEVNET_URL);
const user = getKeypairFromEnvironment('SECRET_KEY');

console.log(`🔑 Loaded keypair. Public key: ${user.publicKey.toBase58()}`);

try {
  const tokenMintAddress = new PublicKey(TOKEN_MINT_ADDRESS);

  const userTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAddress,
    user.publicKey
  );

  const revokeTransactionSignature = await revoke(
    connection,
    user,
    userTokenAccount.address,
    user.publicKey
  );

  const explorerLink = getExplorerLink(
    'transaction',
    revokeTransactionSignature,
    'devnet'
  );

  console.log(`✅ Revoke Delegate Transaction: ${explorerLink}`);
} catch (error) {
  console.log(
    `Error: ${error instanceof Error ? error.message : String(error)}`
  );
}
