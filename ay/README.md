# 🌿 Dr. Priyanka Likhar — Ayurvedic Child Health Landing Page

A premium, conversion-focused landing page with a patient enquiry form that **saves to a database** and **emails you instantly**.

---

## ✏️ PART 1 — How to tweak the data (content)

**Everything you'd want to change lives in ONE file:**

```
src/content/site.ts
```

Open it, edit the values, save. The whole site updates automatically.

| What you want to change | Where in `site.ts` | Section |
|---|---|---|
| Your name, degree, clinic name | `SITE.doctorName`, `SITE.qualification`, `SITE.clinicName` | 1 |
| Phone / WhatsApp number | `SITE.phoneDisplay`, `SITE.phoneHref`, `SITE.whatsapp` | 1 |
| Email shown on site | `SITE.email` | 1 |
| Address, timings, languages | `SITE.addressShort`, `SITE.hours`, `SITE.languages` | 1 |
| Patients treated, years, rating | `STATS` | 2 |
| Menu items | `NAV_LINKS` | 3 |
| Scrolling condition pills | `CONDITIONS` | 4 |
| The 6 specialty cards | `SPECIALTIES` | 5 |
| 4-step method & therapies | `METHOD_STEPS`, `THERAPIES` | 6 |
| Benefits & comparison table | `BENEFITS`, `COMPARE` | 7 |
| **Patient testimonials** | `TESTIMONIALS`, `MINI_WINS` | 8 |
| **Prices & plan inclusions** | `PLANS` | 9 |
| FAQ questions & answers | `FAQS` | 10 |
| Form dropdown options | `CONCERNS`, `PLAN_OPTIONS` | 11 |

### ⚠️ Important placeholders to replace before going live
1. `SITE.phoneDisplay` / `phoneHref` / `whatsapp` → your **real** number
2. `SITE.email` → your real email
3. `SITE.addressShort` / `addressFull` → your real clinic address
4. `TESTIMONIALS` → real patient stories (**always take written consent**)
5. `STATS` → your true numbers (avoid inflated medical claims)
6. `PLANS` → your actual fees

---

## 🖼️ PART 1B — How to use YOUR real photos

Every image on the site is listed in the `IMAGES` block near the top of `src/content/site.ts`.

### The easiest way (2 steps)
1. Drop your photo into the **`public/images/`** folder — e.g. `public/images/doctor.jpg`
2. In `site.ts`, point the entry at it:
   ```ts
   doctorPortrait: "/images/doctor.jpg",
   ```

> **Path rule:** start with `/images/...` — never include the word `public`.
> ✅ `/images/doctor.jpg`  ❌ `public/images/doctor.jpg`

### Even easier: keep the existing filenames
Just overwrite these two files and change nothing in code:
- `public/images/doctor-portrait.jpg` → your professional portrait
- `public/images/clinic-care.jpg` → a real consultation/clinic photo

### What each image is used for

| Key in `IMAGES` | Where it appears | Best size | Tips |
|---|---|---|---|
| `doctorPortrait` | Big hero photo + small avatars | Portrait ~1000×1300 | Face in the **top half** (bottom is covered by a caption) |
| `clinicCare` | "Meet the Doctor" section | ~1200×1400 | You examining a child, or your clinic interior |
| `therapySuvarnaprashan` | Therapy tab 1 | Landscape ~1200×800 | Herbal drops / medicines |
| `therapyAbhyanga` | Therapy tab 2 | Landscape ~1200×800 | Oil massage / therapy room |
| `therapyAhara` | Therapy tab 3 | Landscape ~1200×800 | Healthy food / herbs |
| `therapyNidra` | Therapy tab 4 | Landscape ~1200×800 | Calm child / sleep / yoga |
| `parent1`…`parent6` | Testimonial + hero avatars | Square ~400×400 | Real parents **only with written consent** |

### Photo tips that make a big difference
- **Compress first** — drag files through [squoosh.app](https://squoosh.app) and keep each under ~400KB. Large photos slow the page and hurt Google ranking.
- **Use JPG** for photos, **PNG** only for logos/transparency.
- **Portrait photo:** shoot against a clean, bright background in your white coat with soft daylight. Avoid heavy filters.
- **Privacy:** never publish a child's photo or name without **written parental consent**. Using generic stock photos for testimonials is safer and completely normal — just keep the quote genuine.

### Currently placeholder images
The doctor portrait and clinic photo are **AI-generated placeholders**, and the parent avatars are **stock photos**. Replace the two doctor/clinic images before launch — patients recognise stock photography, and a real photo of you measurably increases enquiries.

---

## 🚀 PART 2 — How to make it LIVE

### Step 1 — Get a free cloud database (2 min)
Your local database won't work online, so create a free one:

1. Go to **[neon.com](https://neon.com)** (free tier, no card) → Sign up
2. Create a project → copy the **Connection String**
3. It looks like: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

> Alternative: [supabase.com](https://supabase.com) works exactly the same way.

### Step 2 — Set up email notifications (3 min)
So enquiries reach your inbox:

1. Sign up free at **[resend.com](https://resend.com)** (3,000 emails/month free)
2. Go to **API Keys → Create API Key** → copy it
3. You'll paste it as `RESEND_API_KEY` in Step 3

> Prefer Gmail? Use the SMTP option in `.env.example` with a Gmail **App Password**.

### Step 3 — Deploy (choose Netlify **or** Vercel — both work)

Whichever you pick, you'll add these **3 environment variables**:

| Name | Value |
|---|---|
| `DATABASE_URL` | your Neon connection string |
| `DOCTOR_EMAIL` | the email where you want enquiries |
| `RESEND_API_KEY` | your Resend API key |

#### 🟢 Option A — Netlify
This project includes a ready-made `netlify.toml`, so there's nothing to configure.

1. Push this project to a **GitHub** repository
2. Go to **[netlify.com](https://netlify.com)** → **Add new site → Import an existing project**
3. Connect GitHub and pick your repo
4. Build settings are auto-filled from `netlify.toml` (`npm run build`, publish `.next`) — leave them as they are
5. Click **Add environment variables** and enter the 3 variables above
6. Click **Deploy** 🎉

> Netlify automatically detects Next.js and installs its official runtime adapter, so SSR, the API route and the enquiry form all work. **Don't** install `@netlify/plugin-nextjs` manually — Netlify keeps it updated for you.

#### ▲ Option B — Vercel
1. Push this project to a **GitHub** repository
2. Go to **[vercel.com](https://vercel.com)** → Sign in with GitHub → **Add New Project**
3. Import your repo
4. Before clicking Deploy, open **Environment Variables** and add the 3 variables above
5. Click **Deploy** 🎉

> **Netlify vs Vercel:** both are free to start and fully supported here. Vercel is made by the Next.js team so it's the most seamless. Netlify is equally fine for this site — a landing page with one form. Pick whichever you already use.

### Step 4 — Create the database table (1 min)
After the first deploy, run this once on your computer with the **production** `DATABASE_URL` in your `.env`:

```bash
npx drizzle-kit push
```

This creates the `patient_inquiries` table in your cloud database.

### Step 5 — Connect your domain
1. Buy a domain (GoDaddy / Namecheap / Cloudflare)
2. Add it in your host:
   - **Netlify:** Site configuration → **Domain management → Add a domain**
   - **Vercel:** Project → Settings → **Domains → Add**
3. Follow the DNS records your host shows (usually one CNAME record)
4. HTTPS is automatic and free on both ✅
5. Finally, update `SITE.siteUrl` in `src/content/site.ts` to your new domain

### Step 6 — Test it
Open your live site, submit the enquiry form, and confirm:
- ✅ You see the success message
- ✅ The email arrives in your inbox

---

## 📥 Where do enquiries go?

Every submission does **two** things:
1. **Saved to your database** (permanent record — never lost, even if email fails)
2. **Emailed to `DOCTOR_EMAIL`** with the child's name, age, concern, symptoms, preferred slot and phone number

To view all enquiries anytime:
```bash
psql "YOUR_DATABASE_URL" -c "SELECT * FROM patient_inquiries ORDER BY created_at DESC;"
```
Neon and Supabase also give you a visual table editor in their dashboard.

---

## 💻 Running locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Build for production:
```bash
npm run build && npm start
```

---

## ⚖️ Before going live — a quick compliance checklist
- [ ] Replace all placeholder contact details
- [ ] Use only **real, consented** patient testimonials
- [ ] Keep the medical disclaimer in the footer
- [ ] Ensure claims comply with your medical council's advertising guidelines
- [ ] Add a Privacy Policy page if you collect patient data (recommended in India under DPDP Act)
