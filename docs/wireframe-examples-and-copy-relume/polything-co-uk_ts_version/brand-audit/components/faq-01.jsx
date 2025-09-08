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
            Find answers to your questions about our brand audit process and
            services.
          </p>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is a brand audit?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              A brand audit is a comprehensive evaluation of your brand's
              current position in the market. It assesses your brand's
              strengths, weaknesses, and opportunities for growth. This process
              helps identify areas for improvement and strategic development.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:py-5 md:text-md">
              How long does it take?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              The brand audit takes approximately 3 minutes to complete using
              our online tool. Once submitted, our experts will analyze your
              responses. You will receive your report shortly after.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is included?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              You will receive a detailed brand report highlighting key insights
              and recommendations. Additionally, you will have a 30-minute
              strategy session with our brand experts via Google Meet. This
              session allows for personalized discussion and guidance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:py-5 md:text-md">
              Is it really free?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Yes, the brand audit and the initial strategy session are
              completely free of charge. We believe in providing value upfront
              to help you understand your brand better. There are no hidden fees
              or obligations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:py-5 md:text-md">
              How do I start?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              To begin your brand audit, simply click on the link to our online
              tool. Follow the prompts to complete the audit in just a few
              minutes. Once finished, you will receive your report and session
              details.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mx-auto mt-12 max-w-md text-center md:mt-18 lg:mt-20">
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
