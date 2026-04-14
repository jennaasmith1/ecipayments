# Customer Portal – Front-End Prototype

High-fidelity React prototype for a dealer customer portal (Summit + Tesla demos, billing, equipment, service, admin console). **Demo/presentation only** – no backend, auth, or production logic.

## Run the prototype

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). The app opens on the **invoice email** screen.

## Demo flow

1. **Invoice email** (`/email`) – Branded email mockup with outstanding invoices and **Pay Now**. Click **Pay Now** to go to the payment page.
2. **Payment landing** (`/pay`) – Select invoices, choose payment method (ACH recommended), **View invoice** (modal), **Add new payment method** (modal). Click **Pay $X,XXX.XX** to complete.
3. **Payment success** (`/pay/success`) – Confirmation, receipt summary, and **Set up AutoPay** CTA.
4. **AutoPay setup** (`/settings/autopay`) – Toggle, payment method, invoice types, max amount, timing. Save to see success state.
5. **Notification settings** (`/settings/notifications`) – Billing/service toggles, channels (Email, SMS, In-portal, Connect Teams, Connect Slack).

**Portal shell** – Header with dealer logo (links to `/pay`), notification bell (dropdown with recent notifications and “Manage notification settings”), and customer name. “Manage notification settings” in the dropdown goes to `/settings/notifications`.

## Tech

- **React 19** + **Vite** + **React Router**
- CSS with design tokens (navy primary, teal accent, light gray backgrounds)
- All data is fake and in `src/data/fakeData.js`

## Build

```bash
npm run build
npm run preview
```
