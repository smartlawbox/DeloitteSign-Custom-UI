import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PenTool, Shield } from "lucide-react";
import axios from "axios";

function VerifyIdentity() {
  const [ssn, setSsn] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);
  const { custId } = useParams();
  const navigate = useNavigate();
  const baseURL =
    "https://smartbox-digital-signature-api-1001466762095.us-central1.run.app";

  const handleVerifyIdentity = async () => {
    setValidating(true);
    axios
      .post(`${baseURL}/digital-sign/validate-user`, {
        ssn,
        date_of_birth: dob,
        custid: custId,
      })
      .then((response) => {
        console.log("validating response: ", response);
        setValidating(false);
        alert("Verification successful! Redirecting to document...");
        // Navigate to the document signing page after successful verification
        navigate(`/docauth/${custId}`);
      })
      .catch((error) => {
        console.log("Document authentication error: ", error);
        setValidating(false);
        alert("Verification failed!");
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (ssn.length !== 4) {
      setError("Please enter the last 4 digits of your SSN");
      return;
    }

    if (!dob) {
      setError("Please enter your date of birth");
      return;
    }

    try {
      handleVerifyIdentity();
    } catch (error) {
      console.log(error);
      setError("Failed to verify identity. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center text-emerald-700 font-semibold text-xl">
            <PenTool className="h-6 w-6 mr-2" />
            DeloitteSign
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">
            Verify Your Identity
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Please verify your identity to access the document
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="ssn"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last 4 Digits of SSN
              </label>
              <input
                type="password"
                id="ssn"
                maxLength={4}
                value={ssn}
                onChange={(e) => setSsn(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter last 4 digits"
              />
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={validating}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {validating ? "Verifying..." : "Verify Identity"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Having trouble? Contact support at support@deloittesign.com
          </p>
        </div>
      </main>
    </div>
  );
}

export default VerifyIdentity;
