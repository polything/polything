"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Header47() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col gap-5 md:flex-row md:gap-12 lg:gap-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">Elevate</p>
            <h1 className="text-6xl font-bold md:text-9xl lg:text-10xl">
              Unlock Your Potential
            </h1>
          </div>
          <div className="w-full max-w-lg">
            <p className="md:text-md">
              Business mentoring is a powerful tool that provides guidance and
              support to help you navigate challenges and seize opportunities.
              With the right mentor, you can gain valuable insights and
              strategies that will propel your business forward.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button title="Learn More">Learn More</Button>
              <Button title="Sign Up" variant="secondary">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
