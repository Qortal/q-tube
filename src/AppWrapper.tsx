import { GlobalProvider } from 'qapp-core'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from './Layout';
import { useSelector } from 'react-redux';
import { RootState } from './state/store';
import { ScrollWrapper } from './wrappers/ScrollWrapper';
import GlobalWrapper from './wrappers/GlobalWrapper';

export const AppWrapper = () => {
          const { user } = useSelector((state: RootState) => state.auth);
    
  return (
    <GlobalProvider
            config={{
              auth: {
          authenticateOnMount: false,
          userAccountInfo: {
            address: user?.address,
            publicKey: user?.publicKey
          },
        
        },
              publicSalt: "usVbeM9YpjGCbLrTcc78YJS0ap1AxDkHAOMZrp3+wDY=",
              appName: "Q-Tube",
              enableGlobalVideoFeature: true
            }}
          >
            <GlobalWrapper>
                          <ScrollWrapper>
            <Layout />
            </ScrollWrapper>
            </GlobalWrapper>
          </GlobalProvider>
  )
}
