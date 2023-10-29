import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // Get data submitted in the request's body.
  const body = req.body;

  // If email is missing, return an error.
  if (body.email == "") {
    res.status(400).json({ data: `Error: no valid email found in request` });
    return;
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
    res.status(200).json({ data: `Think we successfully subscribed ${body.email}` });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ data: `Error: ${error.message}` });
    } else {
      // If error is not an instance of Error, it's a type we weren't expecting and we'll just log it as is.
      console.error(error);
      res.status(500).json({ data: `An unknown error occurred` });
    }
  }
}

