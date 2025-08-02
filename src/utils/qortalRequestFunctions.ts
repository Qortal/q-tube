import { Service } from 'qapp-core';
import {
  AccountInfo,
  AccountName,
  GetRequestData,
  SearchResourcesResponse,
  SearchTransactionResponse,
  TransactionSearchParams,
} from './qortalRequestTypes.ts';

export const getBalance = async (address: string) => {
  return (await qortalRequest({
    action: 'GET_BALANCE',
    address,
  })) as number;
};

export const getUserAccount = async () => {
  return (await qortalRequest({
    action: 'GET_USER_ACCOUNT',
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
    action: 'GET_ACCOUNT_NAMES',
    address,
    ...params,
  })) as AccountName[];

  const namelessAddress = { name: '', owner: address };
  const emptyNamesFilled = names.map(({ name, owner }) => {
    return name ? { name, owner } : namelessAddress;
  });

  return emptyNamesFilled.length > 0 ? emptyNamesFilled : [namelessAddress];
};

export const getPrimaryAccountName = async (address: string) => {
  const primaryName = (await qortalRequest({
    action: 'GET_PRIMARY_NAME',
    address,
  })) as string | null;
  return primaryName ?? '';
};

export const searchTransactions = async (params: TransactionSearchParams) => {
  return (await qortalRequest({
    action: 'SEARCH_TRANSACTIONS',
    ...params,
  })) as SearchTransactionResponse[];
};

export const fetchResourcesByIdentifier = async <T>(
  service: Service,
  identifier: string
) => {
  const names: SearchResourcesResponse[] = await qortalRequest({
    action: 'SEARCH_QDN_RESOURCES',
    service,
    identifier,
    includeMetadata: false,
  });
  const distinctNames = names.filter(
    (searchResponse, index) => names.indexOf(searchResponse) === index
  );

  const promises: Promise<T>[] = [];
  distinctNames.map((response) => {
    const resource: Promise<T> = qortalRequest({
      action: 'FETCH_QDN_RESOURCE',
      name: response.name,
      service,
      identifier,
    });
    promises.push(resource);
  });
  return (await Promise.all(promises)) as T[];
};
