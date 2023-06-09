import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/client';
import calendar from '@/components/calendar';
import Calendar from '@/components/calendar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Calendar/>
    </ApolloProvider>
  )
}
