import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import Router from './Router';
import GlobalStyle from './styles/GlobalStyle';

export const queryClient = new QueryClient();

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <GlobalStyle />
          <Router />
        </RecoilRoot>
      </QueryClientProvider>
    </div>
  );
}

export default App;
