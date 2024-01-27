const postmark = require("postmark");

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

export function sendReceiptEmail() {
	client.sendEmailWithTemplate({
		From: "orders@zackproser.com",
		To: "zachary@zackproser.com",
		TemplateAlias: "receipt",
		TemplateModel: {
			product_url: "https://zackproser.com/learn/git-going/0",
			product_name: "Git Going",
			name: "Zack",
			credit_card_statement_name: "",
			credit_card_brand: "credit_card_brand_Value",
			credit_card_last_four: "credit_card_last_four_Value",
			billing_url: "billing_url_Value",
			expiration_date: "expiration_date_Value",
			receipt_id: "receipt_id_Value",
			date: "date_Value",
			receipt_details: [
				{
					description: "description_Value",
					amount: "$150 USD",
				},
			],
			total: "150",
			support_url: "support_url_Value",
			action_url: "action_url_Value",
			company_name: "Zachary Proser's School for Hackers",
			company_address: "2416 Dwight Way Berkeley CA 94704",
		},
	});
}
