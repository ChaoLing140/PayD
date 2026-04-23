import { signTransaction } from '@stellar-freighter/api';
import { Keypair, Transaction, Networks, Memo } from '@stellar/stellar-sdk';

export interface WalletInfo {
  address: string;
  publicKey: string;
  network: 'testnet' | 'mainnet';
}

export interface SignTransactionOptions {
  transactionXdr: string;
  network: 'testnet' | 'public';
  address?: string;
}

export async function getWalletInfo(): Promise<WalletInfo | null> {
  try {
    const result = await window.freighterApi.getPublicKey();
    if (result) {
      return {
        address: result,
        publicKey: result,
        network: result.startsWith('G') ? 'testnet' : 'mainnet',
      };
    }
    return null;
  } catch (error) {
    console.error('Freighter not installed:', error);
    return null;
  }
}

export async function signTransactionWithWallet(
  options: SignTransactionOptions
): Promise<string> {
  const { transactionXdr, network } = options;
  return signTransaction(transactionXdr, { network });
}

export function parseTransactionXdr(xdr: string, networkPassphrase?: string): Transaction {
  const tx = Transaction.fromEnvelopeXDR(xdr, networkPassphrase || Networks.TESTNET);
  return tx;
}

export async function signTransactionObject(
  keypair: Keypair,
  transaction: Transaction
): Promise<Transaction> {
  transaction.sign(keypair);
  return transaction;
}

export interface ConnectionState {
  connected: boolean;
  address?: string;
  error?: string;
}

export function createConnectionState(
  connected: boolean,
  address?: string,
  error?: string
): ConnectionState {
  return { connected, address, error };
}