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
    const productName = searchParams.get("productName") || "";
    setUserEmail(email);
    setProductSlug(slug);
    setProductName(productName);
  }, [searchParams]);

  return (
    <Container className="mt-16 sm:mt-32">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
        Hand-crafted project-based learning takes time...
      </h1>
      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        So, we truly appreciate your patience. If you like, you can subscribe to
        the waitinglist here, by clicking the Count me in button, and we&apos;ll
        reach out as soon as the{" "}
        <span className="font-semibold">{productName}</span> course is ready.
      </p>
      <ProductWaitinglistForm
        userEmail={userEmail}
        productSlug={productSlug}
        productName={productName}
      />
    </Container>
  );
}
