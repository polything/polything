"use client";

import { Badge, Button, Card } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Blog36() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Blog</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Insights from Chris Talintyre
            </h2>
            <p className="md:text-md">
              Explore marketing strategies and insights from Chris.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          <Card className="flex size-full flex-col items-center justify-start">
            <a href="#" className="w-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="aspect-[3/2] size-full object-cover"
              />
            </a>
            <div className="px-5 py-6 md:p-6">
              <div className="rb-4 mb-4 flex w-full items-center justify-start">
                <Badge className="mr-4">Marketing</Badge>
                <p className="inline text-sm font-semibold">5 min read</p>
              </div>
              <a className="mb-2 block max-w-full" href="#">
                <h2 className="text-xl font-bold md:text-2xl">
                  The Art of Storytelling in Marketing
                </h2>
              </a>
              <p>
                Discover how storytelling can elevate your marketing efforts.
              </p>
              <Button
                title="Read more"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
                className="mt-6 flex items-center justify-center gap-x-2"
              >
                Read more
              </Button>
            </div>
          </Card>
          <Card className="flex size-full flex-col items-center justify-start">
            <a href="#" className="w-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="aspect-[3/2] size-full object-cover"
              />
            </a>
            <div className="px-5 py-6 md:p-6">
              <div className="rb-4 mb-4 flex w-full items-center justify-start">
                <Badge className="mr-4">Strategy</Badge>
                <p className="inline text-sm font-semibold">5 min read</p>
              </div>
              <a className="mb-2 block max-w-full" href="#">
                <h2 className="text-xl font-bold md:text-2xl">
                  Effective Branding for Start-ups
                </h2>
              </a>
              <p>
                Learn essential branding tips to launch your start-up
                successfully.
              </p>
              <Button
                title="Read more"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
                className="mt-6 flex items-center justify-center gap-x-2"
              >
                Read more
              </Button>
            </div>
          </Card>
          <Card className="flex size-full flex-col items-center justify-start">
            <a href="#" className="w-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="aspect-[3/2] size-full object-cover"
              />
            </a>
            <div className="px-5 py-6 md:p-6">
              <div className="rb-4 mb-4 flex w-full items-center justify-start">
                <Badge className="mr-4">Growth</Badge>
                <p className="inline text-sm font-semibold">5 min read</p>
              </div>
              <a className="mb-2 block max-w-full" href="#">
                <h2 className="text-xl font-bold md:text-2xl">
                  Digital Marketing Trends to Watch
                </h2>
              </a>
              <p>
                Stay ahead with the latest digital marketing trends and
                insights.
              </p>
              <Button
                title="Read more"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
                className="mt-6 flex items-center justify-center gap-x-2"
              >
                Read more
              </Button>
            </div>
          </Card>
        </div>
        <div className="flex items-center justify-center">
          <Button
            title="View all"
            variant="secondary"
            className="mt-10 md:mt-14 lg:mt-16"
          >
            View all
          </Button>
        </div>
      </div>
    </section>
  );
}
