import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'

// Poniendo metadata en el head del sitio
// Para hacer metadata dinamica emplear el objeto en un page.tsx o layout.tsx, verificar invoices 
// Se importa para creacion de titles dinamicos
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: {
    template: '%s | OmarJhon9872 | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="keywords" content="keyword1, keyword2, keyword3" />

        {/* Se hace automatico tras la configuracion previa del objeto metadata */}
        {/* <title>Aprendiendo Next.js desde documentacion @OmarJhon9872</title> */}

        {/* Se hace automatico si se coloca en /app el favicon.ico */}
        {/* <link rel="icon" href="path/to/favicon.ico" /> */}

        {/* Se hace automatico si se coloca en /app la imagen opengraph-image.png */}
        {/* Importantes cuando se comparte contenido en redes sociales OpenGraph */}
        {/* <meta property="og:title" content="Title Here" />
        <meta property="og:description" content="Description Here" />
        <meta property="og:image" content="image_url_here" /> */}

        <meta name="description" content="A brief description of the page content." />

      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
