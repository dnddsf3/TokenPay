import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input, Label, Button, WindmillContext } from "@roketid/windmill-react-ui";
import { useAuth } from "hooks/auth/auth-store";
import { useRouter } from "next/router";

function CreateAccount() {
  const { mode } = useContext(WindmillContext);
  const { signup } = useAuth();
  const imgSource = mode === "dark" ? "/assets/img/telkom-bg.png" : "/assets/img/telkom-bg.png";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToPrivacyPolicy: false,
  });

  const router = useRouter();
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setError("");

    // Validate email domain
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(student\.telkomuniversity\.ac\.id|telkomuniversity\.ac\.id)$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email invalid!");
      return;
    }

    // Validate password length and complexity
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters long and include both letters and numbers.");
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate privacy policy agreement
    if (!formData.agreeToPrivacyPolicy) {
      setError("You must agree to the privacy policy");
      return;
    }

    try {
      // Call signup function
      await signup({
        username: formData.email.split("@")[0], // Use the email's username part as a default
        email: formData.email,
        password: formData.password,
        roleIds: [2], // Default role ID, replace as needed
        status: "ACTIVE",
        createdById: 1, // Replace with the appropriate createdById
      });

      alert("Account created successfully!");
      router.push("/login");
    } catch (error) {
      alert("Error!");
      console.error("Failed to create account:", error);
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/2">
            <Image
              aria-hidden="true"
              className="object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout="fill"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>
              {error && <p className="text-red-600">{error}</p>}
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your SSO email"
                />
              </Label>
              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                />
              </Label>
              <Label className="mt-4">
                <span>Confirm password</span>
                <Input
                  className="mt-1"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Retype your password"
                />
              </Label>

              <Label className="mt-6" check>
                <Input
                  type="checkbox"
                  name="agreeToPrivacyPolicy"
                  checked={formData.agreeToPrivacyPolicy}
                  onChange={handleInputChange}
                />
                <span className="ml-2">
                  I agree to the <span className="underline">privacy policy</span>
                </span>
              </Label>

              <Button block className="mt-4 bg-red-500 hover:bg-red-600" onClick={handleSubmit}>
                Create account
              </Button>

              <hr className="my-8" />

              <p className="mt-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-red-600 dark:text-purple-400 hover:underline"
                >
                  Already have an account? Login
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
