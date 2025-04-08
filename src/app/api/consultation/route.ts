import { NextRequest, NextResponse } from "next/server";
import { ServerClient } from 'postmark';

export const maxDuration = 300;

// Initialize Postmark client
const client = new ServerClient(process.env.POSTMARK_API_KEY || '');

export async function POST(req: NextRequest) {
  // Get data submitted in the request's body.
  const body = await req.json();

  // Validate required fields
  if (!body.email || !body.email.trim()) {
    return new NextResponse(
      JSON.stringify({ error: "Email is required" }),
      { status: 400 }
    );
  }

  if (!body.name || !body.name.trim()) {
    return new NextResponse(
      JSON.stringify({ error: "Name is required" }),
      { status: 400 }
    );
  }

  try {
    // Prepare the email data
    const emailData = {
      From: "notifications@zackproser.com",
      To: "zackproser@gmail.com",
      Subject: "New Consultation Request",
      HtmlBody: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>New Consultation Request</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e40af; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e5e7eb; border-top: none; }
            .label { font-weight: bold; margin-bottom: 5px; color: #4b5563; }
            .value { margin-bottom: 15px; }
            .footer { margin-top: 20px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">New Consultation Request</h1>
          </div>
          <div class="content">
            <p>You have received a new request for an AI transformation consultation:</p>
            
            <div class="label">Name:</div>
            <div class="value">${body.name}</div>
            
            <div class="label">Email:</div>
            <div class="value">${body.email}</div>

            ${body.company ? `
            <div class="label">Company:</div>
            <div class="value">${body.company}</div>
            ` : ''}
            
            ${body.phoneNumber ? `
            <div class="label">Phone Number:</div>
            <div class="value">${body.phoneNumber}</div>
            ` : ''}
            
            ${body.message ? `
            <div class="label">Message:</div>
            <div class="value">${body.message}</div>
            ` : ''}
            
            <div class="label">Submitted At:</div>
            <div class="value">${new Date().toLocaleString()}</div>
          </div>
          <div class="footer">
            <p>This email was sent from your AI Blueprint consultation form.</p>
          </div>
        </body>
        </html>
      `,
      TextBody: `
NEW CONSULTATION REQUEST

Name: ${body.name}
Email: ${body.email}
${body.company ? `Company: ${body.company}\n` : ''}${body.phoneNumber ? `Phone Number: ${body.phoneNumber}\n` : ''}${body.message ? `Message: ${body.message}\n` : ''}
Submitted At: ${new Date().toLocaleString()}

This email was sent from your AI Blueprint consultation form.
      `,
      MessageStream: "outbound",
    };

    console.log('📧 Sending consultation request email with data:', JSON.stringify({
      To: emailData.To,
      From: emailData.From,
      Subject: emailData.Subject
    }, null, 2));

    // Send the email using Postmark
    const response = await client.sendEmail(emailData);
    console.log('📧 Email sent successfully:', response);

    // Return success response
    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: "Consultation request submitted successfully"
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('📧 Failed to send consultation request email:', error);
    
    // Return error response
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: "Failed to submit consultation request" 
      }),
      { status: 500 }
    );
  }
} 