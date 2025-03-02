import { ServerClient } from "postmark";
import { type MessageSendingResponse } from "postmark/dist/client/models";
import { renderPaywalledContent, loadContent } from "./content-handlers";
import { ExtendedMetadata } from '@/types' 

const ReactDOMServer = (await import('react-dom/server')).default

// Define the return type for extractPreviewContent
interface PreviewContentResult {
	previewContent: string;
	metadata: ExtendedMetadata;
}

const client = new ServerClient(
	process.env.POSTMARK_API_KEY as unknown as string,
);

interface SendReceiptEmailInput {
	From: string;
	To: string;
	TemplateAlias: string;
	TemplateModel: {
		CustomerName: string;
		ProductURL: string;
		ProductName: string;
		Date: string;
		ReceiptDetails: {
			Description: string;
			Amount: string;
			SupportURL: string;
		};
		Total: string;
		SupportURL: string;
		ActionURL: string;
		CompanyName: string;
		CompanyAddress: string;
	};
}

// Send a receipt email to a purchasing student that includes the details of their purchase
// And a link to get started with their course
const sendReceiptEmail = async (
	receipt: SendReceiptEmailInput,
): Promise<MessageSendingResponse> => {
	console.log('📧 Postmark API Key configured:', !!process.env.POSTMARK_API_KEY)
	console.log('📧 Sending receipt email to:', receipt.To)
	console.log('📧 From address:', receipt.From)
	console.log('📧 Template:', receipt.TemplateAlias)
	
	const emailData = {
		From: receipt.From,
		To: receipt.To,
		TemplateAlias: "receipt",
		TemplateModel: {
			product_url: receipt.TemplateModel.ProductURL,
			product_name: receipt.TemplateModel.ProductName,
			name: receipt.TemplateModel.CustomerName,
			date: receipt.TemplateModel.Date,
			receipt_details: [
				{
					description: receipt.TemplateModel.ReceiptDetails.Description,
					amount: receipt.TemplateModel.ReceiptDetails.Amount,
				},
			],
			total: receipt.TemplateModel.Total,
			support_url: receipt.TemplateModel.SupportURL,
			action_url: receipt.TemplateModel.ActionURL,
			company_name: "Zachary Proser's School for Hackers",
			company_address: "2416 Dwight Way Berkeley CA 94704",
		},
	};
	
	console.log('📧 Sending email with data:', JSON.stringify(emailData, null, 2))
	
	try {
		const response = await client.sendEmailWithTemplate(emailData);
		console.log('📧 Email sent successfully:', response)
		return response;
	} catch (error) {
		console.error('📧 Failed to send email:', error)
		throw error;
	}
};

interface SendFreeChaptersEmailInput {
	To: string;
	ProductName: string;
	ProductSlug: string;
	ChapterLinks?: {
		title: string;
		url: string;
	}[];
}

/**
 * Extract preview content from a product's MDX content using server-side approach
 * @param productSlug The slug of the product
 * @returns An object containing preview content and metadata
 */
async function extractPreviewContent(productSlug: string): Promise<PreviewContentResult | null> {
	// Remove any leading slashes from the productSlug
	const normalizedSlug = productSlug.replace(/^\/+/, '');
	
	// For blog posts, the content type is 'blog'
	// This assumes all products are blog posts - adjust if you have different content types
	const contentType = 'blog';
	
	console.log(`📧 [PROCESS] Extracting preview content for: ${contentType}/${normalizedSlug}`);
	const result = await loadContent(contentType, normalizedSlug);
	if (!result) {
		console.log(`📧 [WARN] No content found for slug: ${productSlug}`);
		return null;
	}
	const { MdxContent, metadata } = result;
	if (!result) {
		return null;
	}
	
	// Log the metadata we received
	console.log(`📧 [DEBUG] Metadata received:`, JSON.stringify({
		title: metadata.title,
		description: metadata.description ? `${metadata.description.substring(0, 100)}...` : 'No description',
		commerce: metadata.commerce ? {
			price: metadata.commerce.price,
			isPaid: metadata.commerce.isPaid,
			previewLength: metadata.commerce.previewLength,
			previewElements: metadata.commerce.previewElements
		} : 'No commerce data'
	}, null, 2));
	
	// Render the preview content to HTML
	console.log(`📧 [PROCESS] Rendering preview content to HTML...`);
	try {
		// Get the React elements from renderPaywalledContent
		const reactElements = renderPaywalledContent(MdxContent, metadata, false);

		const previewContent = ReactDOMServer.renderToString(reactElements)
		// Convert React elements to HTML string
		
		// Log the full HTML for debugging
		console.log(`📧 [DEBUG] Full HTML output:`);
		console.log('----------------------------------------');
		console.log(previewContent);
		console.log('----------------------------------------');

		return {
			previewContent,
			metadata
		};
	} catch (error) {
		console.error(`📧 [ERROR] Failed to render preview content:`, error);
		// Fallback to description
		console.log(`📧 [WARN] Using description as fallback for preview content`);
		return {
			previewContent: metadata.description || 'No preview available.',
			metadata
		};
	}
}


/**
 * Send free chapters email to a user who requested them
 * @param input Email input data
 * @returns Postmark response
 */
const sendFreeChaptersEmail = async (
	input: SendFreeChaptersEmailInput
): Promise<MessageSendingResponse | null> => {
	console.log(`📧 [START] Sending free chapters email to: ${input.To}`);
	console.log(`📧 [CONFIG] Postmark API Key configured: ${!!process.env.POSTMARK_API_KEY}`);
	console.log(`📧 [CONFIG] Product slug: ${input.ProductSlug}`);
	
	// Get the base URL for links
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
	console.log(`📧 [CONFIG] Base URL: ${baseUrl}`);
	
	// Normalize the slug and construct the product URL
	const normalizedSlug = input.ProductSlug.replace(/^\/+/, '');
	const productUrl = `${baseUrl}/blog/${normalizedSlug}`;
	console.log(`📧 [CONFIG] Product URL: ${productUrl}`);
	
	// Extract preview content from the actual product
	console.log(`📧 [PROCESS] Starting content extraction...`);
	const result = await extractPreviewContent(normalizedSlug);
	
	// Initialize variables for preview content and metadata
	let previewContent = '';
	let metadata = null;
	
	if (!result) {
		console.log(`📧 [WARN] No preview content extracted. Will send email without preview.`);
	} else {
		previewContent = result.previewContent;
		metadata = result.metadata;
		
		if (!previewContent) {
			console.log(`📧 [WARN] No preview content extracted. Will send email without preview.`);
		} else {
			console.log(`📧 [SUCCESS] Preview content extracted successfully. Length: ${previewContent.length} characters`);
			console.log(`📧 [PREVIEW] First 100 characters: ${previewContent.substring(0, 100)}...`);
		}
		
		if (!metadata) {
			console.log(`📧 [WARN] No metadata found for product.`);
		} else {
			console.log(`📧 [INFO] Metadata found:`, JSON.stringify({
				title: metadata.title,
				description: metadata.description?.substring(0, 100) + '...',
				commerce: metadata.commerce ? {
					price: metadata.commerce.price,
					hasPaywallBody: !!metadata.commerce.paywallBody,
					previewLength: metadata.commerce.previewLength
				} : null
			}, null, 2));
		}
	}
	
	// Prepare content for the email
	console.log(`📧 [PROCESS] Preparing email content...`);
	let previewHtml = '';
	let previewText = '';
	
	// Get product details for the email - using the same price formatting as Paywall.tsx
	// Fix: Don't divide the price again, it's already in cents
	const price = metadata?.commerce?.price || 0;
	const formattedPrice = price > 0 ? `$${(price / 100).toFixed(2)}` : 'Free';
	const title = metadata?.title || input.ProductName;
	
	// Use the preview content from our extraction function
	// This is now a string, not a React element
	const description = previewContent || metadata?.description || 'No preview available.';
	
	console.log(`📧 [INFO] Using price: ${formattedPrice}`);
	console.log(`📧 [INFO] Using title: ${title}`);
	console.log(`📧 [INFO] Description length: ${description.length} characters`);
	
	// Create a cleaner, more professional preview section
	if (previewContent) {
		console.log(`📧 [PROCESS] Formatting preview content for HTML and text...`);
		console.log(`📧 [DEBUG] Raw preview content (first 200 chars): "${previewContent.substring(0, 200)}..."`);
		
		// The previewContent is already HTML, so we don't need to escape it
		// We just need to wrap it in our email-friendly container
		previewHtml = `
			<div style="background-color: #f8f9fa; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #e9ecef;">
				<div style="color: #212529; line-height: 1.6; margin-bottom: 16px; font-size: 16px;">
					${previewContent}
				</div>
				<p style="font-style: italic; color: #6c757d; margin-bottom: 0;">Continue reading for the full content.</p>
			</div>
		`;
		
		// For the text version, we need to strip HTML tags
		const textContent = previewContent.replace(/<[^>]*>?/gm, '');
		previewText = `
${textContent}

Continue reading for the full content.
		`;
		
		console.log(`📧 [DEBUG] Generated previewHtml (first 200 chars): "${previewHtml.substring(0, 200)}..."`);
		console.log(`📧 [DEBUG] Generated previewText (first 200 chars): "${previewText.substring(0, 200)}..."`);
	}
	
	console.log(`📧 [PROCESS] Building email data...`);
	const emailData = {
		From: "newsletter@zackproser.com",
		To: input.To,
		Subject: `Your Preview: ${title}`,
		HtmlBody: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>Your Preview</title>
			</head>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="margin-bottom: 24px;">
					<h1 style="color: #333; margin-bottom: 8px; font-size: 24px;">${title}</h1>
					${!previewContent && metadata?.description ? `<p style="color: #555; font-size: 16px;">${metadata.description}</p>` : ''}
				</div>
				
				${previewHtml || '<p style="color: #6c757d;">Preview content is not available at this time.</p>'}
				
				<div style="margin: 24px 0;">
					<a href="${productUrl}" style="display: inline-block; background-color: #0d6efd; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 16px;">
						${price > 0 ? `Read Full Article (${formattedPrice})` : 'Read Full Article'}
					</a>
				</div>
				
				<div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d;">
					<p>You're receiving this email because you requested a preview from Zachary Proser.</p>
				</div>
			</body>
			</html>
		`,
		TextBody: `
${title}
${!previewText && metadata?.description ? `\n${metadata.description}` : ''}

${previewText || 'Preview content is not available at this time.'}

${price > 0 ? `Read Full Article (${formattedPrice}): ${productUrl}` : `Read Full Article: ${productUrl}`}

You're receiving this email because you requested a preview from Zachary Proser.
		`,
		MessageStream: "outbound",
	};
	
	// Log the final HTML content for debugging
	console.log(`📧 [DEBUG] Final email HTML content:`);
	console.log('----------------------------------------');
	console.log(emailData.HtmlBody);
	console.log('----------------------------------------');
	
	// Log the preview HTML section specifically
	console.log(`📧 [DEBUG] Preview HTML section:`);
	console.log('----------------------------------------');
	console.log(previewHtml || '<p style="color: #6c757d;">Preview content is not available at this time.</p>');
	console.log('----------------------------------------');
	
	try {
		console.log(`📧 [SEND] Preparing to send email via Postmark:`, JSON.stringify({
			To: emailData.To,
			From: emailData.From,
			Subject: emailData.Subject,
			HtmlBodyLength: emailData.HtmlBody.length,
			TextBodyLength: emailData.TextBody.length,
			MessageStream: emailData.MessageStream
		}, null, 2));
		
		// Log the complete email data structure (excluding the actual body content for brevity)
		console.log(`📧 [DEBUG] Complete email data structure:`, {
			...emailData,
			HtmlBody: `[${emailData.HtmlBody.length} characters]`,
			TextBody: `[${emailData.TextBody.length} characters]`
		});
		
		console.log(`📧 [SEND] Calling Postmark client.sendEmail()...`);
		const response = await client.sendEmail(emailData);
		console.log(`📧 [SUCCESS] Email sent successfully:`, response);
		return response;
	} catch (error) {
		console.error(`📧 [ERROR] Failed to send free chapters email:`, error);
		throw error;
	}
};

export { sendReceiptEmail, sendFreeChaptersEmail, type SendReceiptEmailInput, type SendFreeChaptersEmailInput };
