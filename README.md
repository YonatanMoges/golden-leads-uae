# Golden Leads UAE

**AI-powered WhatsApp lead qualification and CRM for real estate agencies.**

Golden Leads UAE helps agencies respond to property enquiries, collect buyer requirements, organize prospects in one place, and notify agents when a human follow-up is needed.

[**Open CRM demo**](https://golden-leads-uae.netlify.app) · [**Watch the video walkthrough**](docs/demo/golden-leads-demo.mp4)

> **Project status:** Portfolio demonstration. The CRM frontend is deployed on Netlify. The WhatsApp AI workflow has been tested end-to-end with sample enquiries on self-hosted n8n; it is not presented as a continuously hosted production service.

## What it does

1. **Instant WhatsApp intake:** A buyer messages an agency in natural language.
2. **AI qualification:** The assistant responds and collects known requirements such as location, budget, property type, bedrooms, and timeline.
3. **Lead tracking:** Supabase stores prospect details and conversation history.
4. **CRM visibility:** The team can manage leads, pipeline stages, and follow-ups through the web dashboard.
5. **Agent alerts:** Gmail notifies the team when qualified handoff or message-delivery issues require attention.

The system is designed to cut repetitive data entry and reduce the chance of an enquiry being overlooked. No conversion improvement or customer ROI has been claimed or measured.

## Demo

🎬 [Watch the Golden Leads demonstration](docs/demo/golden-leads-demo.mp4)

The walkthrough shows the WhatsApp conversation, automated qualification, CRM record, and agent notification.

## Screenshots

### Dashboard

![Golden Leads UAE dashboard](docs/screenshots/dashboard.png)

### Lead management

![Lead database](docs/screenshots/leads.png)

### Sales pipeline

![Sales pipeline](docs/screenshots/pipeline.png)

### Follow-ups

![Follow-up management](docs/screenshots/follow-ups.png)

### Analytics

![CRM analytics](docs/screenshots/analytics.png)

### Add lead form

![Add lead form](docs/screenshots/add-lead.png)

---

## How it works

```mermaid
flowchart TD
  A["Buyer sends WhatsApp enquiry"] --> B["Meta WhatsApp Cloud API"]
  B --> C["n8n + AI qualification"]
  C --> D["Supabase lead and conversation"]
  D --> E["Golden Leads CRM"]
  C --> F["WhatsApp response"]
  C --> G["Gmail agent alert"]
```

## Features

- AI-assisted, multi-turn WhatsApp lead qualification
- Real-estate requirement extraction and conversation history
- Lead database, sales pipeline, follow-up views, and agent assignment
- CRM dashboard and lead-source analytics
- Agent Gmail notifications and error alerts
- Responsive browser-based frontend

## Technology

| Component | Stack |
|---|---|
| CRM frontend | React, TypeScript, TanStack Start |
| Database | Supabase |
| Workflow | Self-hosted n8n (Docker) |
| Messaging | Meta WhatsApp Cloud API |
| AI inference | Groq-hosted language model |
| Notifications | Gmail |
| Web hosting | Netlify |

The n8n workflow uses a development tunnel for local WhatsApp webhook testing. A separate, tested B2B sales-intake prototype qualifies agencies interested in the service; it is not the property-buyer workflow demonstrated in the CRM.

## Screenshots and case study

For a larger view, open any screenshot above. See the [project case study](docs/case-study/golden-leads-uae-case-study.pdf).

## Run the CRM locally

```bash
git clone https://github.com/YonatanMoges/golden-leads-uae.git
cd golden-leads-uae
npm install
npm run dev
```

Configure Supabase and webhook environment variables required by your deployment. The private n8n configuration and credentials are not published in this repository.

## Privacy and limitations

- Screenshots, sample leads, and example conversations are demonstrations, not verified client results.
- Never commit API keys, WhatsApp tokens, Supabase service-role keys, or private webhook URLs.
- Redact real phone numbers, email addresses, and private customer data in portfolio media.
- Production use requires appropriate hosting, monitoring, access controls, and client-specific setup.

## Author

**Yonatan Moges** · [GitHub](https://github.com/YonatanMoges) · [Live CRM](https://golden-leads-uae.netlify.app)
