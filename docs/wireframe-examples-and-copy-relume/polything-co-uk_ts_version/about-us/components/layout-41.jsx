"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout41() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">Empower</p>
            <h2 className="text-5xl font-bold md:text-7xl lg:text-8xl">
              Our Journey: Crafting Success Together
            </h2>
          </div>
          <div>
            <p className="md:text-md">
              At Polything Marketing Consultancy, we are dedicated to empowering
              businesses to achieve their full potential through strategic
              marketing. Our mission is to provide tailored solutions that drive
              growth and foster innovation.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button title="Learn More" variant="secondary">
                Learn More
              </Button>
              <Button
                title="Join Us"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
              >
                Join Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
