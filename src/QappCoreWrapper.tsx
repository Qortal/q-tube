import { GlobalProvider } from 'qapp-core'
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from './state/store';

export const QappCoreWrapper = ({children}) => {
      const { user } = useSelector((state: RootState) => state.auth);
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
      >
        {children}
    </GlobalProvider>
  )
}
