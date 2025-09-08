"use client";

import { Badge } from "@relume_io/relume-ui";
import React from "react";

export function PortfolioHeader11() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start gap-6 md:mb-18 md:grid-cols-2 md:gap-x-12 lg:mb-20 lg:gap-20">
          <div>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              Blackriver Ramps
            </h1>
            <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
              <Badge>
                <a href="#">Christmas Strategy</a>
              </Badge>
              <Badge>
                <a href="#">Holiday Sales</a>
              </Badge>
              <Badge>
                <a href="#">Marketing Success</a>
              </Badge>
            </div>
          </div>
          <div>
            <p className="md:text-md">
              Discover how Polything empowered Blackriver to triple their
              holiday sales through a meticulously crafted, data-driven
              marketing strategy. Our approach not only boosted revenue but also
              enhanced customer engagement during the festive season.
            </p>
          </div>
        </div>
        <div>
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
            alt="Relume placeholder image 1"
            className="w-full rounded-image"
          />
        </div>
      </div>
    </section>
  );
}
