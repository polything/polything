"use client";

import { Badge } from "@relume_io/relume-ui";
import React from "react";

export function PortfolioHeader10() {
  return (
    <section id="relume" className="flex min-h-svh flex-col">
      <div className="relative flex-1">
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
          alt="Relume placeholder image 1"
          className="absolute size-full object-cover"
        />
      </div>
      <div className="px-[5%]">
        <div className="container">
          <div className="grid grid-cols-1 items-start gap-6 py-12 md:grid-cols-2 md:gap-x-12 md:py-16 lg:gap-20 lg:py-20">
            <div>
              <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
                Bluefort Security
              </h1>
              <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
                <Badge>
                  <a href="#">Security Solutions</a>
                </Badge>
                <Badge>
                  <a href="#">Marketing Strategy</a>
                </Badge>
                <Badge>
                  <a href="#">CRAFT Subscription</a>
                </Badge>
              </div>
            </div>
            <div>
              <p className="md:text-md">
                Polything Marketing Consultancy transformed Bluefort Security's
                marketing approach through tailored strategies. Our
                collaboration focused on enhancing brand visibility and driving
                measurable results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
