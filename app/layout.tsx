import "./globals.css"

// Le vrai <html> est rendu par app/[locale]/layout.tsx (langue + métadonnées traduites)
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
