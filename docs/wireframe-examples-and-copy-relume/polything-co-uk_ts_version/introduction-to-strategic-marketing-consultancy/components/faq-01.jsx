"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@relume_io/relume-ui";
import React from "react";

export function Faq1() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            FAQs
          </h2>
          <p className="md:text-md">
            Explore common questions about our strategic marketing consultancy
            services and how they can benefit you.
          </p>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is strategic marketing?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Strategic marketing involves analyzing your market and competition
              to create effective marketing strategies. It helps businesses
              align their marketing efforts with their overall goals. This
              approach ensures that resources are used efficiently to maximize
              growth.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:py-5 md:text-md">
              Who needs consultancy services?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Start-ups, scale-ups, and SMEs can greatly benefit from
              consultancy services. If you're looking to enhance your marketing
              strategies and achieve sustainable growth, our expertise can guide
              you. We tailor our approach to meet your specific needs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:py-5 md:text-md">
              How does it work?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Our process begins with a thorough assessment of your current
              marketing strategies. We then develop a customized plan that
              addresses your unique challenges and opportunities. Finally, we
              implement and monitor the strategies to ensure effectiveness.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:py-5 md:text-md">
              What are the benefits?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Consultancy services provide clarity and direction for your
              marketing efforts. They help you identify key areas for
              improvement and optimize your resources. Ultimately, this leads to
              increased efficiency and better results.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:py-5 md:text-md">
              How to get started?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Getting started is easy! Simply reach out to us for an initial
              consultation. We’ll discuss your goals and how we can assist you
              in achieving them.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mx-auto mt-12 max-w-md text-center md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Still have questions?
          </h4>
          <p className="md:text-md">We're here to help you.</p>
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
