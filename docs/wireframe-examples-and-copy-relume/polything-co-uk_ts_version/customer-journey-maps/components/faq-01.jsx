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
            Explore common questions about customer journey mapping and enhance
            your understanding of the process.
          </p>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is journey mapping?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Customer journey mapping is a visual representation of the
              customer’s experience with your brand. It outlines each
              interaction and touchpoint, helping you understand customer needs
              and pain points. This process is essential for improving customer
              satisfaction and loyalty.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:py-5 md:text-md">
              Why is it important?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Mapping the customer journey is crucial for identifying gaps in
              service and opportunities for improvement. It allows businesses to
              tailor their marketing strategies to better meet customer
              expectations. Ultimately, this leads to increased engagement and
              higher conversion rates.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:py-5 md:text-md">
              How to create one?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Start by defining your customer personas and their goals. Next,
              outline the stages of their journey, from awareness to purchase.
              Finally, gather feedback and refine the map to ensure it
              accurately reflects the customer experience.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:py-5 md:text-md">
              What are the benefits?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              The benefits of customer journey mapping include enhanced customer
              insights, improved service delivery, and increased sales. It helps
              businesses identify what works and what doesn’t in their customer
              interactions. This strategic approach ultimately drives better
              business outcomes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:py-5 md:text-md">
              What pitfalls to avoid?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Common pitfalls include failing to involve key stakeholders and
              not updating the map regularly. Additionally, relying solely on
              assumptions without customer feedback can lead to inaccuracies.
              Ensure your mapping process is collaborative and data-driven for
              the best results.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mx-auto mt-12 max-w-md text-center md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Still have questions?
          </h4>
          <p className="md:text-md">
            Reach out to our team for more information.
          </p>
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
