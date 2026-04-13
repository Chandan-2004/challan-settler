import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Challan Settler",
  description: "Traffic Challan Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Toast container */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}