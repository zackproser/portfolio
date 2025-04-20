import { ServerClient } from 'postmark'
// import { renderPaywalledContent, loadContent } from "./content-handlers"; // Note: loadContent might be deprecated, check content-handlers
import { getContentWithComponentByDirectorySlug } from "./content-handlers"; // Use this instead of loadContent
import { ExtendedMetadata } from '@/types'
import { emailLogger as logger } from '@/utils/logger' // Import centralized email logger

// Define the MessageSendingResponse interface based on Postmark API response
interface MessageSendingResponse {
	To?: string;
	SubmittedAt?: string;
	MessageID?: string;
	ErrorCode?: number;
	Message?: string;
	MessageStream?: string;
}

// Define the return type for extractPreviewContent
interface PreviewContentResult {
	previewContent: string;
	metadata: ExtendedMetadata;
}

// Initialize Postmark client
const client = new ServerClient(process.env.POSTMARK_API_KEY || '')

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
	logger.debug('Postmark API Key configured:', !!process.env.POSTMARK_API_KEY)
	logger.info('Sending receipt email to:', receipt.To)
	logger.debug('From address:', receipt.From)
	logger.debug('Template:', receipt.TemplateAlias)
	
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
	
	logger.debug('Sending email with data:', JSON.stringify(emailData, null, 2))
	
	try {
		const response = await client.sendEmailWithTemplate(emailData);
		logger.info('Email sent successfully:', response)
		return response;
	} catch (error) {
		logger.error('Failed to send receipt email:', error)
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

// Function to get the content URL based on content type
const getContentUrl = (type: string, slug: string) => {
	// Remove any leading slashes from the slug
	const cleanSlug = slug.replace(/^\/+/, '');
	
	// For all content types, use the /blog/ path since we're only selling blog content
	return `/blog/${cleanSlug}`;
};

/**
 * Extract preview content from a product's MDX content using server-side approach
 * @param productSlug The slug of the product
 * @returns An object containing preview content and metadata
 * 
 * TODO: In the future, we may want to implement a more sophisticated approach
 * that extracts actual preview content from the MDX files. For now, we're using
 * a simple approach that just provides a link to the content, which already
 * shows a preview to users who haven't purchased it.
 */
async function extractPreviewContent(productSlug: string): Promise<PreviewContentResult | null> {
	// Remove any leading slashes from the productSlug
	const normalizedSlug = productSlug.replace(/^\/+/, '');
	
	// For blog posts, the content type is 'blog'
	// This assumes all products are blog posts - adjust if you have different content types
	const contentType = 'blog';
	
	logger.info(`Extracting preview content for: ${contentType}/${normalizedSlug}`);
	// Use getContentWithComponentByDirectorySlug to load content + metadata
	const result = await getContentWithComponentByDirectorySlug(contentType, normalizedSlug);
	if (!result) {
		logger.warn(`No content found for slug: ${productSlug}`);
		return null;
	}
	// Access the metadata via result.content
	const { content: metadata } = result;
	
	// Create a simple HTML preview with a link to the content
	logger.info(`Creating preview content...`);
	try {
		// Get the base URL
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
		const productUrl = `${baseUrl}${getContentUrl(contentType, normalizedSlug)}`;
		
		// Create a simple HTML preview with the description and a link
		const title = typeof metadata.title === 'string' 
			? metadata.title 
			: (metadata.title as any)?.default || 'Untitled';
		
		// Simple HTML email with link to the content
		const previewContent = `
			<h1 style="color: #333; font-size: 24px; margin-bottom: 16px;">${title}</h1>
			${metadata.description ? `<p style="font-size: 16px; line-height: 1.5; color: #555; margin-bottom: 20px;">${metadata.description}</p>` : ''}
			<p style="margin-top: 24px; margin-bottom: 24px;">
				<a href="${productUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
					Get your free preview
				</a>
			</p>
			<p style="font-size: 14px; color: #666; margin-top: 32px; border-top: 1px solid #e9e9e9; padding-top: 16px;">
				To view the free preview, simply click the button above or visit <a href="${productUrl}">${productUrl}</a>
			</p>
		`;
		
		logger.debug(`Preview content created`);
		// Debugging large content can be noisy, consider removing or shortening
		// logger.debug('----------------------------------------');
		// logger.debug(previewContent);
		// logger.debug('----------------------------------------');

		return {
			previewContent,
			metadata
		};
	} catch (error) {
		logger.error(`Failed to create preview content:`, error);
		// Fallback to description
		logger.warn(`Using description as fallback for preview content`);
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
	logger.info(`[START] Sending free chapters email to: ${input.To}`);
	logger.debug(`[CONFIG] Postmark API Key configured: ${!!process.env.POSTMARK_API_KEY}`);
	logger.debug(`[CONFIG] Product slug: ${input.ProductSlug}`);
	
	// Get the base URL for links
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
	logger.debug(`[CONFIG] Base URL: ${baseUrl}`);
	
	// Normalize the slug and construct the product URL
	const normalizedSlug = input.ProductSlug.replace(/^\/+/, '');
	const productUrl = `${baseUrl}${getContentUrl('article', normalizedSlug)}`;
	logger.debug(`[CONFIG] Product URL: ${productUrl}`);
	
	// Extract preview content from the actual product
	logger.info(`[PROCESS] Starting content extraction...`);

	const result = await extractPreviewContent(normalizedSlug);

	if (!result) {
		logger.warn(`No content found for slug: ${input.ProductSlug}`);
		return null;
	}

	// The result from extractPreviewContent already contains the correct metadata
	const { previewContent, metadata } = result;

	logger.debug(`[DEBUG] Result extracted content length: ${previewContent.length} characters`);
	
	// Get the title
	const title = typeof metadata.title === 'string' 
		? metadata.title 
		: (metadata.title as any)?.default || 'Untitled';
		
	logger.info(`[PROCESS] Building email data...`);
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
				${previewContent}
				
				<div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d;">
					<p>You're receiving this email because you requested a preview from Zachary Proser.</p>
				</div>
			</body>
			</html>
		`,
		TextBody: `
${title}

To view the free preview, please visit: ${productUrl}

You're receiving this email because you requested a preview from Zachary Proser.
		`,
		MessageStream: "outbound",
	};
	
	logger.debug('[SEND] Sending email with data:', { 
    To: emailData.To, 
    Subject: emailData.Subject, 
    HtmlBodyLength: emailData.HtmlBody?.length, 
    TextBodyLength: emailData.TextBody?.length 
  }); // Avoid logging full potentially large body

	try {
		const response = await client.sendEmail(emailData);
		logger.info(`[SUCCESS] Email sent successfully to ${input.To}:`, response);
		return response;
	} catch (error) {
		logger.error(`[FAIL] Failed to send email to ${input.To}:`, error);
		// Handle specific Postmark errors if needed
		// e.g., if (error.code === 406) { ... }
		return null;
	}
};

export { sendReceiptEmail, sendFreeChaptersEmail, type SendReceiptEmailInput, type SendFreeChaptersEmailInput };