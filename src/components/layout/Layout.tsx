import Header from "./Header";
import { Providers } from "../Providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </Providers>
  );
}