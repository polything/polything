"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@relume_io/relume-ui";
import React from "react";

export function Faq3() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[.75fr,1fr] lg:gap-x-20">
        <div>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            FAQs
          </h2>
          <p className="md:text-md">
            Find quick answers to your most pressing marketing questions right
            here.
          </p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is marketing strategy?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              A marketing strategy is a comprehensive plan to reach specific
              business goals. It outlines target audiences, messaging, and
              channels. This strategic approach ensures effective resource
              allocation and maximizes impact.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:py-5 md:text-md">
              How to measure success?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Success can be measured through various metrics such as ROI,
              customer engagement, and conversion rates. Regular analysis of
              these metrics helps refine strategies. This continuous improvement
              leads to better outcomes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is content marketing?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Content marketing involves creating and sharing valuable content
              to attract and engage a target audience. It builds trust and brand
              loyalty over time. This approach ultimately drives profitable
              customer action.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:py-5 md:text-md">
              Why is SEO important?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              SEO is crucial for increasing visibility in search engines,
              driving organic traffic. It helps potential customers find your
              business more easily. A strong SEO strategy can significantly
              enhance online presence and credibility.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:py-5 md:text-md">
              How to engage customers?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Engaging customers requires understanding their needs and
              preferences. Utilizing personalized communication and interactive
              content fosters connection. Consistent engagement builds loyalty
              and encourages repeat business.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
