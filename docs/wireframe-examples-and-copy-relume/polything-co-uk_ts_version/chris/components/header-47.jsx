"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Header47() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col gap-5 md:flex-row md:gap-12 lg:gap-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">Innovator</p>
            <h1 className="text-6xl font-bold md:text-9xl lg:text-10xl">
              Meet Chris Talintyre
            </h1>
          </div>
          <div className="w-full max-w-lg">
            <p className="md:text-md">
              Chris Talintyre is a leading marketing strategist with a passion
              for storytelling. His expertise lies in developing tailored
              marketing solutions that drive growth and engagement.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button title="Learn More">Learn More</Button>
              <Button title="Follow" variant="secondary">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
