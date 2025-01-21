import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="app">
        <Header />
        <main className="content pt-[60px] pb-[40px] flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  };
  
  export default Layout;