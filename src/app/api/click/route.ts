// app/api/click/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const EO_API = "https://emailoctopus.com/api/1.6";
const EO_API_KEY = process.env.EMAIL_OCTOPUS_API_KEY!;
const EO_LIST_ID = process.env.EMAIL_OCTOPUS_LIST_ID!;
const DEFAULT_REDIRECT = process.env.CLICK_REDIRECT_DEFAULT || "https://zackproser.com/thanks";

function md5Lower(email: string) {
  return crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
}

/**
 * Query params:
 *   e    = subscriber email address (merge tag in EmailOctopus, e.g. {{EmailAddress}})
 *   tag  = one or many tag parameters, e.g. ?tag=intent:build&tag=newsletter:ai
 *   r    = redirect URL (optional; falls back to DEFAULT_REDIRECT)
 *   f    = final URL alias (optional, for prettiness; ignored if r present)
 *
 * Example:
 *   /api/click?e={{EmailAddress}}&tag=intent:build&r=https://zackproser.com/ai/build
 *   /api/click?e={{EmailAddress}}&tag=intent:strategy&tag=blog:clicked
 */
export async function GET(req: NextRequest) {
  try {
    if (!EO_API_KEY || !EO_LIST_ID) {
      return NextResponse.json(
        { error: "Server not configured: missing EMAIL_OCTOPUS_API_KEY or EMAIL_OCTOPUS_LIST_ID" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);

    const email = searchParams.get("e") || "";
    const tags = searchParams.getAll("tag"); // supports multiple tag params
    const redirectParam = searchParams.get("r") || "";
    const finalUrl = redirectParam || DEFAULT_REDIRECT;

    if (!email) {
      // If no email, just bounce through to final URL to avoid breaking the user journey
      return NextResponse.redirect(finalUrl, 302);
    }

    // Build payloads
    const memberId = md5Lower(email);
    
    // First, get the contact to find the actual contact ID
    const getRes = await fetch(
      `${EO_API}/lists/${encodeURIComponent(EO_LIST_ID)}/contacts/${memberId}?api_key=${EO_API_KEY}`
    );
    
    if (getRes.ok) {
      const contactData = await getRes.json();
      const contactId = contactData.id;
      
      console.log('📋 Found contact:', { contactId, currentTags: contactData.tags });
      
      // First, create any tags that don't exist
      for (const tag of tags) {
        try {
          console.log('🏷️ Creating tag:', tag);
          const createTagRes = await fetch(
            `${EO_API}/lists/${encodeURIComponent(EO_LIST_ID)}/tags`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                api_key: EO_API_KEY,
                tag: tag
              }),
            }
          );
          
          if (createTagRes.ok) {
            console.log('✅ Tag created:', tag);
          } else {
            const tagError = await createTagRes.json();
            // Tag might already exist, which is fine
            console.log('ℹ️ Tag creation response:', tagError);
          }
        } catch (e) {
          console.log('⚠️ Error creating tag:', tag, e);
        }
      }
      
      // Now update the contact with new tags
      const tagObject: Record<string, boolean> = {};
      tags.forEach(tag => {
        tagObject[tag] = true;
      });
      
      const updateBody: any = {
        api_key: EO_API_KEY,
        email_address: email,
        tags: tagObject
      };

      console.log('🔄 Updating contact with tags:', updateBody.tags);
      
      const updateRes = await fetch(
        `${EO_API}/lists/${encodeURIComponent(EO_LIST_ID)}/contacts/${contactId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateBody),
        }
      );
      
      console.log('📊 Update response status:', updateRes.status);
      
      if (updateRes.ok) {
        console.log('✅ Contact updated successfully');
      } else {
        const errorData = await updateRes.json();
        console.log('❌ Update failed:', errorData);
      }
    } else {
      // Contact not found, create new contact
      console.log('❌ Contact not found, creating new contact');
      
      const createBody: any = {
        api_key: EO_API_KEY,
        email_address: email,
        status: "SUBSCRIBED"
      };
      if (tags.length) createBody.tags = tags;

      console.log('🔄 Creating new contact with tags:', createBody.tags);

      const createRes = await fetch(
        `${EO_API}/lists/${encodeURIComponent(EO_LIST_ID)}/contacts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createBody),
        }
      );

      if (createRes.ok) {
        console.log('✅ Contact created successfully');
      } else {
        const createErr = await createRes.json();
        console.log('❌ Create failed:', { status: createRes.status, error: createErr });
      }
    }

    // Always redirect to the final URL
    return NextResponse.redirect(finalUrl, 302);
  } catch (e) {
    // Safety: never break the click path
    console.log('❌ Error in click handler:', e);
    return NextResponse.redirect(DEFAULT_REDIRECT, 302);
  }
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}