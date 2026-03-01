export const metadata = {
  title: "Become a Funding Partner | Earn Daily Commissions | Moonshine Capital",
  description:
    "Join Moonshine Capital's partner network. Earn $500-$5K per deal with zero upfront costs. Free training, daily payouts, unlimited earning potential. Apply now.",
  openGraph: {
    title: "Become a Funding Partner | Earn Daily Commissions | Moonshine Capital",
    description:
      "Earn $500-$5K per deal with zero upfront costs. Free training + daily payouts.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
