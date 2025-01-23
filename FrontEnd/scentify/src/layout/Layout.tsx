import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useHeaderStore } from "../stores/useHeaderStore";

interface LayoutProps {
  children: React.ReactNode;
}


const Layout = ({ children }: LayoutProps) => {
    
  const { isFinish, isCancel } = useHeaderStore();

  return (
      <div className="app">
        <Header isFinish={isFinish} isCancel={isCancel} />
        <main className="content flex flex-grow justify-center">
          {children}
        </main>
        <Footer />
      </div>
    );
  };
  
  export default Layout;