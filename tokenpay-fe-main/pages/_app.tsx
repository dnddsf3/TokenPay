
import '../styles/globals.css'
import 'tailwindcss/tailwind.css';

import React from 'react';
import { Windmill } from '@roketid/windmill-react-ui';
import type { AppProps } from 'next/app';
import { CopilotContext, CopilotKit } from '@copilotkit/react-core';
import { CopilotKitCSSProperties, CopilotPopup } from '@copilotkit/react-ui';
import "@copilotkit/react-ui/styles.css";
import { UserProvider } from 'context/UserContext';


function MyApp({ Component, pageProps }: AppProps) {
  if (!process.browser) React.useLayoutEffect = React.useEffect;


  return (
    <CopilotKit
      runtimeUrl="/api/copilot" // Custom runtime URL for server-side integration
      showDevConsole={false} // Hide the development console
      properties={{
        userRole: 'admin', // Pass user role dynamically
      }}
    >
      <UserProvider>
        <Windmill usePreferences={true}>
          <Component {...pageProps} />
        </Windmill>
      </UserProvider>

    </CopilotKit>
  );
}

export default MyApp;
