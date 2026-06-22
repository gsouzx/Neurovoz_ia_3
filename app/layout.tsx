import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'NeuroVoZ I.A — Inteligência para o Desenvolvimento Autista',
    template: '%s | NeuroVoZ I.A',
  },
  description:
    'Plataforma de inteligência artificial empática e personalizada que auxilia pessoas autistas em seu desenvolvimento, comunicação, autonomia e integração social.',
  keywords: [
    'autismo',
    'inteligência artificial',
    'neurodiversidade',
    'TEA',
    'desenvolvimento',
    'comunicação',
    'autonomia',
    'terapia',
  ],
  authors: [{ name: 'NeuroVoZ I.A' }],
  creator: 'NeuroVoZ I.A',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://neurovoz.ia',
    siteName: 'NeuroVoZ I.A',
    title: 'NeuroVoZ I.A — Inteligência para o Desenvolvimento Autista',
    description:
      'Compreender, apoiar e desenvolver, respeitando cada forma única de ser.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3AB7D6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Nunito:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
