import headerComponent from "@/components/headerComponent";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <headerComponent />
      <body>{children}</body>
    </html>
  );
}
