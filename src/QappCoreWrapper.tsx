import { GlobalProvider } from 'qapp-core'
import { useSelector } from 'react-redux';
import { RootState } from './state/store';
import { useLocation, useNavigate } from 'react-router-dom';

export const QappCoreWrapper = ({children}) => {
      const { user } = useSelector((state: RootState) => state.auth);
      const navigate = useNavigate()
      const location = useLocation()
  return (
    <GlobalProvider
        config={{
        auth: {
          authenticateOnMount: false,
          userAccountInfo: {
            address: user?.address,
            publicKey: user?.publicKey
          }
        },
        publicSalt: "usVbeM9YpjGCbLrTcc78YJS0ap1AxDkHAOMZrp3+wDY=",
        appName: "Q-Tube",
        
      }}
      navigate={navigate}
      location={location}
      >
        {children}
    </GlobalProvider>
  )
}
