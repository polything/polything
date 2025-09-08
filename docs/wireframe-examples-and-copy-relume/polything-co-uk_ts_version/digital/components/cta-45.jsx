"use client";

import { Button, Card } from "@relume_io/relume-ui";
import React from "react";

export function Cta45() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <Card className="grid grid-cols-1 items-start justify-start gap-6 p-8 md:grid-cols-[1fr_max-content] md:items-center md:justify-between md:gap-x-12 md:gap-y-8 lg:gap-x-20 lg:p-12">
          <div className="md:mr-12 lg:mr-0">
            <div className="w-full max-w-lg">
              <h3 className="mb-3 text-4xl leading-[1.2] font-bold md:mb-4 md:text-5xl lg:text-6xl">
                Transform Your Digital Marketing Today
              </h3>
              <p className="md:text-md">
                Unlock your potential with our expert guidance.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-start gap-4 md:w-auto md:justify-end">
            <Button title="Book">Book</Button>
            <Button title="Learn More" variant="secondary">
              Learn More
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
