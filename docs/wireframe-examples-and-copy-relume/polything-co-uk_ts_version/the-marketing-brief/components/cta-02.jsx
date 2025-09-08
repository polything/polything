"use client"

import { Button, Input } from "@relume_io/relume-ui";
import React from "react";



export function Cta2() {
return (<section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28"><div className="container"><div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center"><div><h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">Stay Ahead in Marketing</h2><p className="md:text-md">Join our newsletter for the latest marketing strategies, tips, and industry news delivered to you.</p><div className="mt-6 w-full max-w-sm md:mt-8"><form className="rb-4 mb-4 grid max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4"><Input id="email" type="email" placeholder="Your Email Here"/><Button title="Join Now">Join Now</Button></form><div dangerouslySetInnerHTML={{__html:"
    <p class='text-xs'>
      By clicking Sign Up you're confirming that you agree with our
      <a href='#' class='underline'>Terms and Conditions</a>.
    </p>
    ",}}/></div></div><div><img src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg" className="w-full rounded-image object-cover" alt="Relume placeholder image"/></div></div></div></section>);
}