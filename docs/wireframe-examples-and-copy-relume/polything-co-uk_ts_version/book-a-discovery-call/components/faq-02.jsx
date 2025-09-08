"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@relume_io/relume-ui";
import React from "react";

export function Faq2() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            FAQs
          </h2>
          <p className="md:text-md">
            Here are some common questions about our discovery call process and
            how to prepare.
          </p>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is a discovery call?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              A discovery call is an initial conversation where we explore your
              business needs. It allows us to understand your goals and
              challenges. This session sets the stage for a tailored marketing
              strategy.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:py-5 md:text-md">
              How long is it?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              The discovery call typically lasts about 30 minutes. This time
              allows for a thorough discussion of your objectives. We want to
              ensure all your questions are answered.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:py-5 md:text-md">
              What should I prepare?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Come prepared with information about your business goals and any
              current marketing efforts. Think about specific challenges you
              face. This will help us provide the most relevant advice.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:py-5 md:text-md">
              Is it really free?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Yes, the discovery call is completely free of charge. We believe
              in providing value upfront to build trust. There are no
              obligations after the call.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:py-5 md:text-md">
              How do I book?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Booking your discovery call is easy! Simply click the 'Book a
              call' button on our website. You'll be guided through the
              scheduling process.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-12 md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Still have questions?
          </h4>
          <p className="md:text-md">We're here to help!</p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
