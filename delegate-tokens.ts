import 'dotenv/config';
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from '@solana-developers/helpers';
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  SystemProgram,
} from '@solana/web3.js';
import { approve, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';

const DEVNET_URL = clusterApiUrl('devnet');
const TOKEN_DECIMALS = 2;
const DELEGATE_AMOUNT = 50;
const MINOR_UNITS_PER_MAJOR_UNITS = 10 ** TOKEN_DECIMALS;

// Initialize connection and load user keypair
const connection = new Connection(DEVNET_URL);
const user = getKeypairFromEnvironment('SECRET_KEY');

console.log(`🔑 Loaded keypair. Public key: ${user.publicKey.toBase58()}`);

const delegatePublicKey = new PublicKey(SystemProgram.programId);
const tokenMintAddress = new PublicKey(
  'CCGKgi6ZrrZoJSYjVVuTB2qtYYRw6biztCVVzwFRYdnk'
);

try {
  // Get or create the user's token account
  const userTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAddress,
    user.publicKey
  );

  // Approve the delegate
  const approveTransactionSignature = await approve(
    connection,
    user,
    userTokenAccount.address,
    delegatePublicKey,
    user.publicKey,
    DELEGATE_AMOUNT * MINOR_UNITS_PER_MAJOR_UNITS
  );

  const explorerLink = getExplorerLink(
    'transaction',
    approveTransactionSignature,
    'devnet'
  );

  console.log(`✅ Delegate approved. Transaction: ${explorerLink}`);
} catch (error) {
  console.error(
    `Error: ${error instanceof Error ? error.message : String(error)}`
  );
}