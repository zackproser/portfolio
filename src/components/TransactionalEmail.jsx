import * as React from 'react';

import { Tailwind, Button } from "@react-email/components";

export default function EmailTemplate({
    fullName,
    productSlug
}) {
    return (
        <Tailwind
            config={{
                theme: {
                    extend: {
                        colors: {
                            brand: "#007291",
                        },
                    },
                },
            }}
        >
            <div className="border border-gray-300 rounded-lg max-w-md mx-auto p-6">
                <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
                    <h2 className="text-lg font-medium">Thank You, {fullName}!</h2>
                    <div className="flex gap-4">
                        <FacebookIcon className="h-6 w-6" />
                        <TwitterIcon className="h-6 w-6" />
                        <InstagramIcon className="h-6 w-6" />
                    </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                    We appreciate your business and look forward to serving you again soon.
                </p>
                <div className="mt-8">
                    <h3 className="text-md font-medium">Order Details</h3>
                    <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">Order</div>
                            <div className="text-sm text-gray-500">{productSlug}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">Order Date</div>
                            <div className="text-sm text-gray-500">Oct 10, 2023</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">Order Total</div>
                            <div className="text-sm text-gray-500">$250.00</div>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="text-md font-medium">Billing Address</h3>
                    <div className="mt-4 text-sm text-gray-500">123 Street Name, City, State, Country, Postal Code</div>
                </div>
                <div className="mt-8">
                    <h3 className="text-md font-medium">Shipping Address</h3>
                    <div className="mt-4 text-sm text-gray-500">Same as billing address</div>
                </div>
                <Button
                    href="https://zackproser.com"
                    className="bg-brand px-3 py-2 font-medium leading-4 text-white"
                >
                    Zachary Proser's School for Hackers
                </Button>
            </div>
        </Tailwind>
    )
}

function FacebookIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    )
}


function InstagramIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    )
}


function TwitterIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
    )
}

