import { ServerClient } from "postmark";
import { type MessageSendingResponse } from "postmark/dist/client/models";

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

export { type SendReceiptEmailInput, sendReceiptEmail };
