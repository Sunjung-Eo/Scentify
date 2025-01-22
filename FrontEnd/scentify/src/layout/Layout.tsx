import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app">
      <Header />
      <main className="flex flex-col justify-between content pt-[60px] pb-[40px] flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
