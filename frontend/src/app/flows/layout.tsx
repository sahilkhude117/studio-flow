import { Header } from "@/components/header";
import { Sidebar } from "@/components/Sidebar";

export default function HomeLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="flex min-h-screen ">
            <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header/>
          {children}
        </div>
      </div>
    );
  }