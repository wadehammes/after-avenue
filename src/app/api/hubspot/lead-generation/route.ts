import { FetchMethods } from "src/api/helpers";
import type { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";

export async function POST(request: Request) {
  const res: ContactFormInputs = await request.json();

  const email = res.email;
  const firstName = res.name.split(" ")[0] || "";
  const lastName = res.name.split(" ")[1] || "";
  const phone = res.phone;
  const companyName = res.companyName || "";

  // API endpoint to check if email is already in Hubspot
  const checkEmailInHubspotApiUrl = `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile`;

  // API endpoint for the Hubspot lead generation form
  const leadGenFormApiUrl = `https://api.hsforms.com/submissions/v3/integration/secure/submit/${process.env.HUBSPOT_PORTAL_ID}/${process.env.HUBSPOT_LEAD_GENERATION_FORM_ID}`;

  try {
    const checkEmailInHubspot = await fetch(checkEmailInHubspotApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (checkEmailInHubspot.status === 200) {
      return Response.json({
        message: "Email already exists in Hubspot!",
        status: 200,
      });
    }

    const submitLeadForm = await fetch(leadGenFormApiUrl, {
      method: FetchMethods.Post,
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: [
          {
            objectTypeId: "0-1",
            name: "email",
            value: email,
          },
          {
            objectTypeId: "0-1",
            name: "firstname",
            value: firstName,
          },
          {
            objectTypeId: "0-1",
            name: "lastname",
            value: lastName,
          },
          {
            objectTypeId: "0-1",
            name: "phone",
            value: phone,
          },
          {
            objectTypeId: "0-1",
            name: "company",
            value: companyName,
          },
          {
            objectTypeId: "0-2",
            name: "hs_lead_status",
            value: "New",
          },
        ],
      }),
    });

    if (submitLeadForm.ok) {
      const leadFormResponse = await submitLeadForm.json();

      if (leadFormResponse) {
        return Response.json(leadFormResponse, { status: 200 });
      }
    }

    return Response.json({ error: "Failed to submit lead form.", status: 500 });
  } catch (error) {
    return Response.json({ error, status: 500 });
  }
}
