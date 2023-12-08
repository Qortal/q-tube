import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { addUser } from "../state/features/authSlice";
import NavBar from "../components/layout/Navbar/Navbar";
import PageLoader from "../components/common/PageLoader";
import { RootState } from "../state/store";
import { setUserAvatarHash } from "../state/features/globalSlice";
import { VideoPlayerGlobal } from "../components/common/VideoPlayerGlobal";
import { Rnd } from "react-rnd";
import { RequestQueue } from "../utils/queue";
import { EditVideo } from "../components/EditVideo/EditVideo";
import { EditPlaylist } from "../components/EditPlaylist/EditPlaylist";
import ConsentModal from "../components/common/ConsentModal";

interface Props {
  children: React.ReactNode;
  setTheme: (val: string) => void;
}

let timer: number | null = null;

export const queue = new RequestQueue();

const GlobalWrapper: React.FC<Props> = ({ children, setTheme }) => {
  const dispatch = useDispatch();
  const isDragging = useRef(false);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const user = useSelector((state: RootState) => state.auth.user);
  const videoPlaying = useSelector(
    (state: RootState) => state.global.videoPlaying
  );
  const username = useMemo(() => {
    if (!user?.name) return "";

    return user.name;
  }, [user]);
  const getAvatar = React.useCallback(
    async (author: string) => {
      try {
        const url = await qortalRequest({
          action: "GET_QDN_RESOURCE_URL",
          name: author,
          service: "THUMBNAIL",
          identifier: "qortal_avatar",
        });
        if (url) {
          setUserAvatar(url);
          dispatch(
            setUserAvatarHash({
              name: author,
              url,
            })
          );
        }
      } catch (error) {
        /* empty */
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!username) return;

    getAvatar(username);
  }, [username, getAvatar]);

  const { isLoadingGlobal } = useSelector((state: RootState) => state.global);

  async function getNameInfo(address: string) {
    const response = await qortalRequest({
      action: "GET_ACCOUNT_NAMES",
      address: address,
    });
    const nameData = response;

    if (nameData?.length > 0) {
      return nameData[0].name;
    } else {
      return "";
    }
  }

  const askForAccountInformation = React.useCallback(async () => {
    try {
      const account = await qortalRequest({
        action: "GET_USER_ACCOUNT",
      });

      const name = await getNameInfo(account.address);
      dispatch(addUser({ ...account, name }));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  React.useEffect(() => {
    askForAccountInformation();
  }, [askForAccountInformation]);

  const onDragStart = () => {
    timer = Date.now();
    isDragging.current = true;
  };

  const handleStopDrag = async () => {
    const time = Date.now();
    if (timer && time - timer < 300) {
      isDragging.current = false;
    } else {
      isDragging.current = true;
    }
  };
  const onDragStop = () => {
    handleStopDrag();
  };

  const checkIfDrag = useCallback(() => {
    return isDragging.current;
  }, []);

  return (
    <>
      {isLoadingGlobal && <PageLoader />}
      <ConsentModal />

      <NavBar
        setTheme={(val: string) => setTheme(val)}
        isAuthenticated={!!user?.name}
        userName={user?.name || ""}
        userAvatar={userAvatar}
        authenticate={askForAccountInformation}
      />
      <EditVideo />
      <EditPlaylist />
      <Rnd
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        style={{
          display: videoPlaying ? "block" : "none",
          position: "fixed",
          height: "auto",
          width: 350,
          zIndex: 1000,
          maxWidth: 800,
        }}
        default={{
          x: 0,
          y: 60,
          width: 350,
          height: "auto",
        }}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDrag={() => {}}
      >
        {videoPlaying && (
          <VideoPlayerGlobal checkIfDrag={checkIfDrag} element={videoPlaying} />
        )}
      </Rnd>

      {children}
    </>
  );
};

export default GlobalWrapper;
