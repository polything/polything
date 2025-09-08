"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout252() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start gap-5 md:mb-18 md:grid-cols-2 md:gap-x-12 lg:mb-20 lg:gap-x-20">
          <div>
            <h2 className="text-4xl leading-[1.2] font-bold md:text-5xl lg:text-6xl">
              Unlock the Power of Marketing Automation for Your Business Growth
            </h2>
          </div>
          <div>
            <p className="md:text-md">
              Implementing marketing automation begins with a thorough initial
              assessment of your current processes. We then help you select the
              right tools tailored to your specific needs. Finally, we ensure
              seamless integration and provide ongoing optimization to maximize
              your results.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-3 md:gap-x-8 lg:gap-x-12">
          <div className="w-full">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
              Step 1: Initial Assessment of Your Marketing Needs
            </h3>
            <p>
              We analyze your existing marketing strategies to identify areas
              for improvement.
            </p>
            <div className="mt-6 flex items-center gap-4 md:mt-8">
              <Button iconRight={<RxChevronRight />} variant="link" size="link">
                Assess
              </Button>
            </div>
          </div>
          <div className="w-full">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
              Step 2: Selecting the Right Marketing Tools for You
            </h3>
            <p>
              We guide you in choosing the best automation tools that fit your
              goals.
            </p>
            <div className="mt-6 flex items-center gap-4 md:mt-8">
              <Button iconRight={<RxChevronRight />} variant="link" size="link">
                Select
              </Button>
            </div>
          </div>
          <div className="w-full">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
              Step 3: Integration and Implementation of Tools
            </h3>
            <p>
              We ensure that your selected tools are integrated smoothly into
              your workflow.
            </p>
            <div className="mt-6 flex items-center gap-4 md:mt-8">
              <Button iconRight={<RxChevronRight />} variant="link" size="link">
                Integrate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
