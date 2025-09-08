"use client";

import { Badge } from "@relume_io/relume-ui";
import React from "react";
import {
  BiLinkAlt,
  BiLogoFacebookCircle,
  BiLogoLinkedinSquare,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { RxChevronLeft } from "react-icons/rx";

export function BlogPostHeader2() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 flex flex-col items-start justify-start md:mb-18 lg:mb-20">
          <a
            className="rounded-button inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none border-0 text-text-primary gap-2 bg-transparent p-0 mb-8 md:mb-10 lg:mb-12"
            href={undefined}
          >
            <RxChevronLeft />
            View Case Studies
          </a>
          <div className="rb-4 mb-4 flex w-full items-center justify-start">
            <Badge className="mr-4">Marketing</Badge>
            <p className="inline text-sm font-semibold">5 min read</p>
          </div>
          <h1 className="text-5xl font-bold md:text-7xl lg:text-8xl">
            Scaling WOLF's Marketing Strategy Overseas
          </h1>
        </div>
        <div className="mx-auto mb-8 w-full overflow-hidden md:mb-12 lg:mb-8">
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
            className="aspect-[5/2] size-full rounded-image object-cover"
            alt="Relume placeholder image"
          />
        </div>
        <div className="flex w-full flex-col items-start justify-between md:flex-row">
          <div className="rb-4 mb-4 flex items-center sm:mb-8 md:mb-0">
            <div className="mr-8 md:mr-10 lg:mr-12">
              <p className="mb-2">Authored by</p>
              <p className="font-medium">Jane Doe</p>
            </div>
            <div className="mr-8 md:mr-10 lg:mr-12">
              <p className="mb-2">Posted on</p>
              <p className="font-medium">22 January 2021</p>
            </div>
          </div>
          <div className="grid grid-flow-col grid-cols-[max-content] items-start gap-2">
            <a
              href="#"
              className="rounded-[1.25rem] bg-background-secondary p-1"
            >
              <BiLinkAlt className="size-6" />
            </a>
            <a
              href="#"
              className="rounded-[1.25rem] bg-background-secondary p-1"
            >
              <BiLogoLinkedinSquare className="size-6" />
            </a>
            <a
              href="#"
              className="rounded-[1.25rem] bg-background-secondary p-1"
            >
              <FaXTwitter className="size-6 p-0.5" />
            </a>
            <a
              href="#"
              className="rounded-[1.25rem] bg-background-secondary p-1"
            >
              <BiLogoFacebookCircle className="size-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
