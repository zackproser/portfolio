import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

// Get data submitted in the request's body.
const body = await req.json();

// If email is missing, return an error.
if (body.email == "") {
  return new NextResponse(JSON.stringify({ data: `Error: no valid email found in request` }), { status: 400 });
}




  const emailOctopusAPIKey = process.env.EMAIL_OCTOPUS_API_KEY;
  const emailOctopusListId = process.env.EMAIL_OCTOPUS_LIST_ID;
  const newMemberEmailAddress = body.email;
  const emailOctopusAPIEndpoint = `https://emailoctopus.com/api/1.6/lists/${emailOctopusListId}/contacts`;

  const data = {
    api_key: emailOctopusAPIKey,
    email_address: newMemberEmailAddress,
    fields: {
      Referrer: body.referrer,
    },
    status: "SUBSCRIBED"
  };

  const requestOptions = {
    crossDomain: true,
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(emailOctopusAPIEndpoint, requestOptions);
    if (!response.ok) {
      throw new Error(`Failed to subscribe: ${response.statusText}`);
    }
    console.dir(await response.json());
    return new NextResponse(JSON.stringify({ data: `Think we successfully subscribed ${body.email}` }), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return new NextResponse(JSON.stringify({ data: `Error: ${error.message}` }), { status: 500 });
    } else {
      // If error is not an instance of Error, it's a type we weren't expecting and we'll just log it as is.
      console.error(error);
      return new NextResponse(JSON.stringify({ data: `An unknown error occurred` }), { status: 500 });
    }
  }
}

