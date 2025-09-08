import React from "react";
import { Navbar3 } from "./components/Navbar3";
import { PortfolioHeader4 } from "./components/PortfolioHeader4";
import { Content2 } from "./components/Content2";
import { Layout4 } from "./components/Layout4";
import { Layout1 } from "./components/Layout1";
import { Layout6 } from "./components/Layout6";
import { Layout26 } from "./components/Layout26";
import { Testimonial1 } from "./components/Testimonial1";
import { Cta1 } from "./components/Cta1";
import { Footer3 } from "./components/Footer3";

export default function Page() {
  return (
    <div>
      <Navbar3 />
      <PortfolioHeader4 />
      <Content2 />
      <Layout4 />
      <Layout1 />
      <Layout6 />
      <Layout26 />
      <Testimonial1 />
      <Cta1 />
      <Footer3 />
    </div>
  );
}
