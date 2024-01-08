import {
  AccountInfo,
  AccountName,
  GetRequestData,
  SearchTransactionResponse,
  TransactionSearchParams,
} from "./qortalRequestTypes.ts";

export const getBalance = async (address: string) => {
  return (await qortalRequest({
    action: "GET_BALANCE",
    address,
  })) as number;
};

export const getUserAccount = async () => {
  return (await qortalRequest({
    action: "GET_USER_ACCOUNT",
  })) as AccountInfo;
};
export const getUserBalance = async () => {
  const accountInfo = await getUserAccount();
  return (await getBalance(accountInfo.address)) as number;
};
export const getAccountNames = async (
  address: string,
  params?: GetRequestData
) => {
  const names = (await qortalRequest({
    action: "GET_ACCOUNT_NAMES",
    address,
    ...params,
  })) as AccountName[];

  const namelessAddress = { name: "", owner: address };
  const emptyNamesFilled = names.map(({ name, owner }) => {
    return name ? { name, owner } : namelessAddress;
  });

  return emptyNamesFilled.length > 0 ? emptyNamesFilled : [namelessAddress];
};

export const searchTransactions = async (params: TransactionSearchParams) => {
  return (await qortalRequest({
    action: "SEARCH_TRANSACTIONS",
    ...params,
  })) as SearchTransactionResponse[];
};
