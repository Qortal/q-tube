import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { AppWrapper } from './AppWrapper';
import { Home } from './pages/Home/Home';
import { VideoContent } from './pages/ContentPages/VideoContent/VideoContent';
import { PlaylistContent } from './pages/ContentPages/PlaylistContent/PlaylistContent';
import { IndividualProfile } from './pages/ContentPages/IndividualProfile/IndividualProfile';
import { Search } from './pages/Search/Search';

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
            path: 'search',
            element: <Search />,
          },
          {
            path: 'video/:name/:id',
            element: <VideoContent />,
          },
          {
            path: 'playlist/:name/:id',
            element: <PlaylistContent />,
          },
          {
            path: 'channel/:name',
            element: <IndividualProfile />,
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
