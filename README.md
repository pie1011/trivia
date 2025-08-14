This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


There's a bug with the answer buttons in the trivia app: when I click on an answer button, it turns black and appears to disappear against the dark background.
The following might be a way to fix this:

Find the QuestionCard component and examine the answer button click handlers and styling
Look for any CSS or inline styles that set background-color: black or color: black when buttons are clicked, selected, or in active state
Ensure that when an answer is selected/clicked, it maintains good visibility with the neon arcade theme (use bright neon colors instead of black) and make them solid when chosen.
Check for any :active, :focus, or .selected CSS states that might be causing this
Also check for any Bootstrap button classes that might be overriding the custom neon styling

The buttons should remain visible and use the retro neon color scheme even when clicked or selected. Make sure the selected state is clearly distinguishable but still fits the arcade aesthetic.