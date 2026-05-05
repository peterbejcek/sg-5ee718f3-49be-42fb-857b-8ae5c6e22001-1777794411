import { useEffect, useRef } from "react";

declare global {
  interface Window {
    startSensetForm?: (
      selector: string,
      apiKey: string,
      reCaptchaKey: string,
      options: { cc: string },
      successCallback: (data: any) => void,
      errorCallback: (error: any) => void
    ) => void;
  }
}

export function SensetBookingForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const script = document.createElement("script");
    script.src = "https://system.senset.sk/scripts/order-form";
    script.async = true;
    
    script.onload = () => {
      scriptLoaded.current = true;
      if (window.startSensetForm) {
        const reCaptchaKey = "";
        window.startSensetForm(
          "#senset-form",
          "HJYZHVUHCD",
          reCaptchaKey,
          { cc: "sk" },
          (success) => {
            console.log("Senset form success:", success);
          },
          (error) => {
            console.error("Senset form error:", error);
          }
        );
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="senset-form-wrapper">
      <div id="senset-form" ref={formRef}></div>
      
      <style jsx global>{`
        /* Senset Form Custom Styling - E-TAXI Košice Theme */
        .senset-form-wrapper {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Form container */
        #senset-form,
        #senset-form form {
          font-family: 'Inter', system-ui, sans-serif !important;
        }

        /* Headings */
        #senset-form h1,
        #senset-form h2,
        #senset-form h3,
        #senset-form h4 {
          font-family: 'IBM Plex Sans', system-ui, sans-serif !important;
          font-weight: 700 !important;
          color: hsl(240 10% 15%) !important;
        }

        /* Input fields */
        #senset-form input[type="text"],
        #senset-form input[type="email"],
        #senset-form input[type="tel"],
        #senset-form input[type="number"],
        #senset-form input[type="date"],
        #senset-form input[type="time"],
        #senset-form input[type="datetime-local"],
        #senset-form select,
        #senset-form textarea {
          font-family: 'Inter', system-ui, sans-serif !important;
          font-size: 16px !important;
          padding: 12px 16px !important;
          border: 1px solid hsl(240 6% 90%) !important;
          border-radius: 8px !important;
          background: white !important;
          color: hsl(240 10% 15%) !important;
          transition: all 0.2s !important;
          min-height: 48px !important;
        }

        #senset-form input:focus,
        #senset-form select:focus,
        #senset-form textarea:focus {
          outline: none !important;
          border-color: hsl(248 62% 27%) !important;
          box-shadow: 0 0 0 3px hsla(248 62% 27% / 0.1) !important;
        }

        /* Labels */
        #senset-form label {
          font-family: 'Inter', system-ui, sans-serif !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: hsl(240 10% 15%) !important;
          margin-bottom: 6px !important;
          display: block !important;
        }

        /* Primary Button (Submit) */
        #senset-form button[type="submit"],
        #senset-form .btn-primary,
        #senset-form .submit-btn {
          font-family: 'IBM Plex Sans', system-ui, sans-serif !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          padding: 14px 32px !important;
          background: hsl(248 62% 27%) !important;
          color: white !important;
          border: none !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          min-height: 48px !important;
          width: 100% !important;
          margin-top: 16px !important;
        }

        #senset-form button[type="submit"]:hover,
        #senset-form .btn-primary:hover {
          background: hsl(248 62% 22%) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px hsla(248 62% 27% / 0.3) !important;
        }

        #senset-form button[type="submit"]:active {
          transform: translateY(0) !important;
        }

        /* Secondary buttons */
        #senset-form .btn-secondary,
        #senset-form button:not([type="submit"]) {
          font-family: 'Inter', system-ui, sans-serif !important;
          font-weight: 500 !important;
          background: hsl(240 5% 96%) !important;
          color: hsl(240 10% 15%) !important;
          border: 1px solid hsl(240 6% 90%) !important;
          border-radius: 8px !important;
          padding: 10px 20px !important;
          transition: all 0.2s !important;
        }

        #senset-form .btn-secondary:hover {
          background: hsl(240 5% 92%) !important;
        }

        /* Error messages */
        #senset-form .error,
        #senset-form .error-message,
        #senset-form .invalid-feedback {
          font-family: 'Inter', system-ui, sans-serif !important;
          font-size: 14px !important;
          color: hsl(0 84% 60%) !important;
          margin-top: 4px !important;
        }

        /* Success messages */
        #senset-form .success,
        #senset-form .success-message {
          font-family: 'Inter', system-ui, sans-serif !important;
          font-size: 16px !important;
          color: hsl(142 71% 45%) !important;
          padding: 16px !important;
          background: hsl(142 76% 96%) !important;
          border-radius: 8px !important;
          margin-top: 16px !important;
        }

        /* Form groups */
        #senset-form .form-group,
        #senset-form .field-group {
          margin-bottom: 20px !important;
        }

        /* Radio buttons & Checkboxes */
        #senset-form input[type="radio"],
        #senset-form input[type="checkbox"] {
          accent-color: hsl(248 62% 27%) !important;
          width: 20px !important;
          height: 20px !important;
          min-height: unset !important;
        }

        /* Select dropdown arrow */
        #senset-form select {
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23282462' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 20px !important;
          padding-right: 40px !important;
        }

        /* Loading state */
        #senset-form .loading,
        #senset-form .spinner {
          border-color: hsl(248 62% 27%) !important;
          border-top-color: transparent !important;
        }

        /* Responsive */
        @media (max-width: 640px) {
          #senset-form input,
          #senset-form select,
          #senset-form textarea,
          #senset-form button {
            font-size: 16px !important;
          }
        }

        /* Remove any default margins/padding that might conflict */
        #senset-form * {
          box-sizing: border-box !important;
        }

        /* Phone number hint */
        #senset-form .phone-hint,
        #senset-form .hint-text {
          font-family: 'Inter', system-ui, sans-serif !important;
          font-size: 13px !important;
          color: hsl(240 5% 64%) !important;
          margin-top: 4px !important;
        }
      `}</style>
    </div>
  );
}