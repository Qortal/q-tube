import { GlobalProvider } from 'qapp-core';
import Layout from './Layout';
import GlobalWrapper from './wrappers/GlobalWrapper';
import { ScrollWrapper } from './wrappers/ScrollWrapper';

export const AppWrapper = () => {
  return (
    <GlobalProvider
      config={{
        auth: {
          authenticateOnMount: true,
          balanceSetting: {
            interval: 120000,
          },
        },
        publicSalt: 'usVbeM9YpjGCbLrTcc78YJS0ap1AxDkHAOMZrp3+wDY=',
        appName: 'Q-Tube',
        enableGlobalVideoFeature: true,
      }}
    >
      <GlobalWrapper>
        <ScrollWrapper>
          <Layout />
        </ScrollWrapper>
      </GlobalWrapper>
    </GlobalProvider>
  );
};
