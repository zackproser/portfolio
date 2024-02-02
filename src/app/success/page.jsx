"use client";
import React, { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";

import { Container } from "@/components/Container";
import PurchaseSuccess from "@/components/PurchaseSuccess";

export default function CheckoutSuccess() {
	const [status, setStatus] = useState(null);
	const [customerEmail, setCustomerEmail] = useState("");

	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");
	const productSlug = searchParams.get("product");

	useEffect(() => {
		fetch(`/api/checkout-sessions?session_id=${sessionId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("success page fetched json:");
				console.log(data);
				setStatus(data.status);
				setCustomerEmail(data.customer_email);
			});
	}, [sessionId]);

	useEffect(() => {
		if (status === "paid" || status === "complete") {
			fetch("/api/purchases", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					sessionId,
					customerEmail,
					productSlug,
				}),
			}).then((res) => {
				if (res.ok) {
					console.log("Purchase updated successfully!");
				} else {
					console.log("Error updating purchase");
				}
			});
		}
	}, [status, sessionId, customerEmail, productSlug]);

	if (status === "open") {
		return redirect("/");
	}

	if (status === "paid" || status === "complete") {
		return (
			<Container className="mt-16 sm:mt-32">
				<PurchaseSuccess
					customerEmail={customerEmail}
					productName={productSlug.replace("-", " ")}
					courseUrl={`/learn/${productSlug}/0`}
				/>
			</Container>
		);
	}
}
