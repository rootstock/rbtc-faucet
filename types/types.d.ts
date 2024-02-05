import { string } from 'prop-types';

export interface TxParameters {
  from: string;
  to: string;
  nonce: string;
  gasPrice: string;
  gas: string;
  value: string;
}

export interface FaucetHistory {
  [address: string]: number;
}

export interface CaptchaSolutionRequest {
  token: string;
  secret: string;
}

export interface CaptchaSolutionResponse {
  success: boolean;
  'error-codes': [
    'missing-input-secret',
    'invalid-input-secret',
    'missing-input-response',
    'invalid-input-response',
    'bad-request',
    'timeout-or-duplicate'
  ],
}

export interface DispenseResponse {
  titleText: string;
  type: 'warning' | 'info' | 'error' | 'success' | 'question';
  text: string;
  txHash?: string;
  resetCaptcha?: boolean;
  dispenseComplete?: boolean;
  checksumed?: boolean;
}

export interface ExistingAliasStatus {
  status: boolean;
  realAddress: string;
}
