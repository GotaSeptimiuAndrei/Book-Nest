import React from "react";
import "./App.css";
import { Navbar } from "./layouts/Navbar";
import { Footer } from "./layouts/Footer";
import { HomePage } from "./layouts/homePage/HomePage";

export const App = () => {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />
    </>
  );
};
