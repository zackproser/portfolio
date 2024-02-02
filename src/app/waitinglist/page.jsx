"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { Container } from "@/components/Container";

import ProductWaitinglistForm from "@/components/ProductWaitinglistForm";

export default function Page() {
  const [userEmail, setUserEmail] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productName, setProductName] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email") || "";
    const slug = searchParams.get("product") || "";
    const productName = searchParams.get("productName") || null;
    setUserEmail(email);
    setProductSlug(slug);
    setProductName(productName ?? "Zachary Proser's School for Hackers");
  }, [searchParams]);

  return (
    <Container className="mt-16 sm:mt-32">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
        Your thirst for knowledge is commendable!
      </h1>


      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        But hand-crafted project-based learning takes time.
      </p>


      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        Enter your email below to secure your spot on the waiting list, and we&apos;ll let you know as soon as{" "}
        <span className="font-semibold">{productName}</span> is ready.
      </p>

      <ProductWaitinglistForm
        userEmail={userEmail}
        productSlug={productSlug}
        productName={productName}
      />

    </Container>
  );
}
