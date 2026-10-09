import { FetchMethods, fetchResponse } from "src/api/helpers";
import {
  type HubspotLeadApiBody,
  hubspotLeadApiSchema,
} from "src/lib/forms/contactForm.schema";
import { isNonProductionContactEnvironment } from "src/utils/helpers";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  if (isNonProductionContactEnvironment()) {
    return Response.json({
      message: "HubSpot skipped outside production",
      status: 200,
    });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const parsed = hubspotLeadApiSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const res: HubspotLeadApiBody = parsed.data;
  const email = res.email;
  const firstName = res.name.split(" ")[0] || "";
  const lastName = res.name.split(" ")[1] || "";
  const phone = res.phone;
  const companyName = res.companyName || "";

  const checkEmailInHubspotApiUrl = `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile`;
  const leadGenFormApiUrl = `https://api.hsforms.com/submissions/v3/integration/secure/submit/${process.env.HUBSPOT_PORTAL_ID}/${process.env.HUBSPOT_LEAD_GENERATION_FORM_ID}`;

  try {
    const checkEmailInHubspot = await fetch(checkEmailInHubspotApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (checkEmailInHubspot.status === 200) {
      return Response.json({
        message: "Email already exists in Hubspot!",
        status: 200,
      });
    }

    const submitLeadForm = await fetch(leadGenFormApiUrl, {
      body: JSON.stringify({
        fields: [
          {
            name: "email",
            objectTypeId: "0-1",
            value: email,
          },
          {
            name: "firstname",
            objectTypeId: "0-1",
            value: firstName,
          },
          {
            name: "lastname",
            objectTypeId: "0-1",
            value: lastName,
          },
          {
            name: "phone",
            objectTypeId: "0-1",
            value: phone,
          },
          {
            name: "company",
            objectTypeId: "0-1",
            value: companyName,
          },
          {
            name: "hs_lead_status",
            objectTypeId: "0-2",
            value: "New",
          },
        ],
      }),
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: FetchMethods.Post,
    });

    if (submitLeadForm.ok) {
      const leadFormResponse = await fetchResponse<Record<string, unknown>>(
        Promise.resolve(submitLeadForm),
      );

      if (leadFormResponse) {
        return Response.json(leadFormResponse, { status: 200 });
      }
    }

    return Response.json(
      { error: "Failed to submit lead form." },
      { status: 500 },
    );
  } catch (error) {
    console.error("HubSpot lead generation error:", error);
    return Response.json(
      { error: "Failed to submit lead form." },
      { status: 500 },
    );
  }
}
