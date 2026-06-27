import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppWrapper } from './AppWrapper';
import { Bookmarks } from './pages/Bookmarks/Bookmarks';
import { ChannelPage } from './pages/ContentPages/IndividualProfile/ChannelPage.tsx';
import { PlaylistContent } from './pages/ContentPages/PlaylistContent/PlaylistContent';
import { VideoContent } from './pages/ContentPages/VideoContent/VideoContent';
import { History } from './pages/History/History';
import { Home } from './pages/Home/Home';
import { Search } from './pages/Search/Search';
import { Subscriptions } from './pages/Subscriptions/Subscriptions';

interface CustomWindow extends Window {
  _qdnBase: string;
}
const customWindow = window as unknown as CustomWindow;
const baseUrl = customWindow?._qdnBase || '';

export function Routes() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <AppWrapper />, // GlobalProvider wrapper
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'subscriptions',
            element: <Subscriptions />,
          },
          {
            path: 'bookmarks',
            element: <Bookmarks />,
          },
          {
            path: 'history',
            element: <History />,
          },
          {
            path: 'search',
            element: <Search />,
          },
          {
            path: 'video/:name/:id',
            element: <VideoContent />,
          },
          {
            path: 'video/:name/:id/:commentID',
            element: <VideoContent />,
          },
          {
            path: 'playlist/:name/:id',
            element: <PlaylistContent />,
          },
          {
            path: 'playlist/:name/:id/:s/:n/:i',
            element: <PlaylistContent />,
          },
          {
            path: 'channel/:name',
            element: <Navigate to="videos" replace />,
          },
          {
            path: 'channel/:name/:section',
            element: <ChannelPage />,
          },
        ],
      },
    ],
    {
      basename: baseUrl,
    }
  );

  return <RouterProvider router={router} />;
}
