import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setAddToDownloads,
  updateDownloads,
} from "../state/features/globalSlice";

import { DownloadTaskManager } from "../components/common/DownloadTaskManager";
import { RootState } from "../state/store";

interface Props {
  children: React.ReactNode;
}

const defaultValues: MyContextInterface = {
  downloadVideo: () => {},
};
interface IDownloadVideoParams {
  name: string;
  service: string;
  identifier: string;
  properties: any;
}
interface MyContextInterface {
  downloadVideo: ({
    name,
    service,
    identifier,
    properties,
  }: IDownloadVideoParams) => void;
}
export const MyContext = React.createContext<MyContextInterface>(defaultValues);

const DownloadWrapper: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const downloads = useSelector((state: RootState) => state.global?.downloads);

  const fetchResource = async ({ name, service, identifier }: any) => {
    try {
      await qortalRequest({
        action: "GET_QDN_RESOURCE_PROPERTIES",
        name,
        service,
        identifier,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVideoUrl = async ({ name, service, identifier }: any) => {
    try {
      fetchResource({ name, service, identifier });
      const url = await qortalRequest({
        action: "GET_QDN_RESOURCE_URL",
        service: service,
        name: name,
        identifier: identifier,
      });
      if (url) {
        dispatch(
          updateDownloads({
            name,
            service,
            identifier,
            url,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const performDownload = ({
    name,
    service,
    identifier,
    properties,
  }: IDownloadVideoParams) => {
    if (downloads[identifier]) return;
    dispatch(
      setAddToDownloads({
        name,
        service,
        identifier,
        properties,
      })
    );

    let isCalling = false;
    let percentLoaded = 0;
    let timer = 24;
    const intervalId = setInterval(async () => {
      if (isCalling) return;
      isCalling = true;
      const res = await qortalRequest({
        action: "GET_QDN_RESOURCE_STATUS",
        name: name,
        service: service,
        identifier: identifier,
      });
      if (res?.status === "NOT_PUBLISHED") {
        dispatch(
          updateDownloads({
            name,
            service,
            identifier,
            status: res,
          })
        );
        clearInterval(intervalId);
      }
      isCalling = false;
      if (res.localChunkCount) {
        if (res.percentLoaded) {
          if (
            res.percentLoaded === percentLoaded &&
            res.percentLoaded !== 100
          ) {
            timer = timer - 5;
          } else {
            timer = 24;
          }
          if (timer < 0) {
            timer = 24;
            isCalling = true;
            dispatch(
              updateDownloads({
                name,
                service,
                identifier,
                status: {
                  ...res,
                  status: "REFETCHING",
                },
              })
            );
            setTimeout(() => {
              isCalling = false;
              fetchResource({
                name,
                service,
                identifier,
              });
            }, 25000);
            return;
          }
          percentLoaded = res.percentLoaded;
        }
        dispatch(
          updateDownloads({
            name,
            service,
            identifier,
            status: res,
          })
        );
      }

      // check if progress is 100% and clear interval if true
      if (res?.status === "READY") {
        clearInterval(intervalId);
        dispatch(
          updateDownloads({
            name,
            service,
            identifier,
            status: res,
          })
        );
      }
    }, 5000); // 1 second interval

    fetchVideoUrl({
      name,
      service,
      identifier,
    });
  };

  const downloadVideo = async ({
    name,
    service,
    identifier,
    properties,
  }: IDownloadVideoParams) => {
    try {
      performDownload({
        name,
        service,
        identifier,
        properties,
      });
      return "addedToList";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <MyContext.Provider value={{ downloadVideo }}>
        {/* <DownloadTaskManager /> */}
        {children}
      </MyContext.Provider>
    </>
  );
};

export default DownloadWrapper;
