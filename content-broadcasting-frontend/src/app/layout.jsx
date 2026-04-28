import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
})

export const metadata = {
  title: 'Content Broadcasting System',
  description: 'Broadcast educational content to students',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}