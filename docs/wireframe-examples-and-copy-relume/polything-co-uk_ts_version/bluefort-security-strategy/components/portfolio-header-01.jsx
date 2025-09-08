"use client";

import { Badge } from "@relume_io/relume-ui";
import React from "react";

export function PortfolioHeader1() {
  return (
    <section id="relume" className="px-[5%]">
      <div className="mx-auto max-w-lg py-16 text-center md:py-24 lg:py-28">
        <div>
          <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
            Bluefort Security Strategy
          </h1>
          <p className="md:text-md">
            Discover how strategic marketing transformed Bluefort Security's
            approach and drove remarkable growth.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 md:mt-6">
            <Badge>
              <a href="#">Marketing Strategy</a>
            </Badge>
            <Badge>
              <a href="#">Success Story</a>
            </Badge>
            <Badge>
              <a href="#">Case Study</a>
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
