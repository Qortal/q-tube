export type AccountInfo = { address: string; publicKey: string };
export type AccountName = { name: string; owner: string };
export type ConfirmationStatus = "CONFIRMED" | "UNCONFIRMED" | "BOTH";

export interface GetRequestData {
  limit?: number;
  offset?: number;
  reverse?: boolean;
}

export interface SearchTransactionResponse {
  type: string;
  timestamp: number;
  reference: string;
  fee: string;
  signature: string;
  txGroupId: number;
  blockHeight: number;
  approvalStatus: string;
  creatorAddress: string;
  senderPublicKey: string;
  recipient: string;
  amount: string;
}

export interface MetaData {
  title: string;
  description: string;
  tags: string[];
  mimeType: string;
}

export interface SearchResourcesResponse {
  name: string;
  service: string;
  identifier: string;
  metadata?: MetaData;
  size: number;
  created: number;
  updated: number;
}

export type TransactionType =
  | "GENESIS"
  | "PAYMENT"
  | "REGISTER_NAME"
  | "UPDATE_NAME"
  | "SELL_NAME"
  | "CANCEL_SELL_NAME"
  | "BUY_NAME"
  | "CREATE_POLL"
  | "VOTE_ON_POLL"
  | "ARBITRARY"
  | "ISSUE_ASSET"
  | "TRANSFER_ASSET"
  | "CREATE_ASSET_ORDER"
  | "CANCEL_ASSET_ORDER"
  | "MULTI_PAYMENT"
  | "DEPLOY_AT"
  | "MESSAGE"
  | "CHAT"
  | "PUBLICIZE"
  | "AIRDROP"
  | "AT"
  | "CREATE_GROUP"
  | "UPDATE_GROUP"
  | "ADD_GROUP_ADMIN"
  | "REMOVE_GROUP_ADMIN"
  | "GROUP_BAN"
  | "CANCEL_GROUP_BAN"
  | "GROUP_KICK"
  | "GROUP_INVITE"
  | "CANCEL_GROUP_INVITE"
  | "JOIN_GROUP"
  | "LEAVE_GROUP"
  | "GROUP_APPROVAL"
  | "SET_GROUP"
  | "UPDATE_ASSET"
  | "ACCOUNT_FLAGS"
  | "ENABLE_FORGING"
  | "REWARD_SHARE"
  | "ACCOUNT_LEVEL"
  | "TRANSFER_PRIVS"
  | "PRESENCE";

export interface TransactionSearchParams extends GetRequestData {
  startBlock?: number;
  blockLimit?: number;
  txGroupId?: number;
  txType: TransactionType[];
  address: string;
  confirmationStatus: ConfirmationStatus;
}
