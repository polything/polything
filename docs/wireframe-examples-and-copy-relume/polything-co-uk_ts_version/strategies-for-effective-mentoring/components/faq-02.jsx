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
            Explore our answers to common questions about effective mentoring
            strategies and their implementation.
          </p>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is mentoring?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Mentoring is a developmental partnership where an experienced
              individual guides someone less experienced. It fosters personal
              and professional growth through shared knowledge and insights.
              Effective mentoring can significantly enhance skills and
              confidence.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:py-5 md:text-md">
              Why is it important?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Mentoring is crucial for nurturing talent and fostering
              innovation. It helps individuals navigate challenges and develop
              essential skills. Moreover, it strengthens organizational culture
              and promotes knowledge sharing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:py-5 md:text-md">
              How to find a mentor?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Finding a mentor involves identifying individuals with relevant
              experience and a willingness to share. Networking events,
              professional associations, and online platforms can be excellent
              resources. It's essential to establish a genuine connection and
              mutual goals.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:py-5 md:text-md">
              What makes mentoring effective?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Effective mentoring requires clear communication, trust, and
              commitment from both parties. Setting specific goals and providing
              constructive feedback are vital components. Additionally, a
              supportive environment enhances the mentoring experience.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:py-5 md:text-md">
              How can Polything help?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Polything offers tailored mentoring strategies that address your
              unique business challenges. Our expert consultants provide
              guidance on establishing effective mentoring programs. We help you
              implement best practices to maximize the impact of mentoring.
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
