export default async function handler(req, res) {
  // Get data submitted in request's body.
  const body = req.body

  // if email is missing, return an error 
  if (body.email == "") {
    res.status(400).json({ data: `Error: no valid email found in request`})
  }

  const emailOctopusAPIKey = process.env.EMAIL_OCTOPUS_API_KEY
  const emailOctopusListId = process.env.EMAIL_OCTOPUS_LIST_ID
  const newMemberEmailAddress = body.email
  const emailOctopusAPIEndpoint = `https://emailoctopus.com/api/1.6/lists/${emailOctopusListId}/contacts`

  const data = {
    api_key: emailOctopusAPIKey, 
    email_address: newMemberEmailAddress,
    status: "SUBSCRIBED"
  } 

  const requestOptions = {
    crossDomain: true, 
    method: 'POST', 
    headers: {'Content-type':'application/json'}, 
    body: JSON.stringify(data)
  }

  const response = await fetch(emailOctopusAPIEndpoint, requestOptions)
    .then((response) => response.json())
    .then((data) => console.dir(data))
    .catch((error) => console.dir(error))

  // Sends a HTTP success code
  res.status(200).json({ data: `Think we successfully subscribed ${body.email}` })
}
