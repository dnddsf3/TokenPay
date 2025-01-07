import React, { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { Label, Input, Button, WindmillContext } from "@roketid/windmill-react-ui";
import { GithubIcon, TwitterIcon } from "icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useUser } from "context/UserContext";

// Initialize Toast Notifications

function LoginPage() {
  const { mode } = useContext(WindmillContext);
  const router = useRouter();
  const { handleLogin } = useUser();

  const imgSource = mode === "dark" ? "/assets/img/telkom-bg.png" : "/assets/img/telkom-bg.png";

  // Local state for form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    try {
      const result = await handleLogin(username, password);

      if (result?.success) {
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <ToastContainer />
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
                  Tokenpay Login
                </h1>
                <form onSubmit={onSubmit}>
                  <Label>
                    <span>Username</span>
                    <Input
                      className="mt-1"
                      type="text"
                      placeholder="Enter your SSO username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Label>

                  <Label className="mt-4">
                    <span>Password</span>
                    <Input
                      className="mt-1"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Label>

                  <Button
                    className="mt-4 bg-red-500"
                    block
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Log in"}
                  </Button>
                </form>

                <hr className="my-8" />
                {/*}
                <Button block layout="outline">
                  <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                  Github
                </Button>
                <Button className="mt-4" block layout="outline">
                  <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                  Twitter
                </Button>
                */}
                <p className="mt-4">
                  <Link
                    href="/signup"
                    className="text-sm font-medium text-red-600 dark:text-purple-400 hover:underline"
                  >
                    If you don't have an account, just create it!
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

