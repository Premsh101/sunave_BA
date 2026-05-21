import './globals.css';
import { AuthProvider } from '@/features/auth/AuthContext';
import { ThemeProvider } from '@/features/theme/ThemeContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="theme-dark">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
