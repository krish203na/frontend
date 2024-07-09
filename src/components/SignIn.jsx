// src/components/SignIn.js
import React, { useEffect } from "react";
import { SignInButton, useAuth } from "@clerk/clerk-react";

const SignIn = () => {
  const { isSignedIn, user } = useAuth();

  useEffect(() => {
    if (isSignedIn && user) {
      const saveUser = async () => {
        try {
          const response = await fetch("https://backend-pgv8.onrender.com/user/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.idToken}`, // Include the user's idToken for authentication
            },
            body: JSON.stringify({
              userId: user.id,
              email: user.emailAddresses[0].emailAddress,
              username: user.username,
              fullname: user.fullName,
            }),
          });

          if (response.ok) {
            console.log("User data saved successfully");
          } else {
            console.error("Error saving user data:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      saveUser();
    }
  }, [isSignedIn, user]);

  return (
    <SignInButton>
      <button className="min-h-[40px] max-h-[30px] hover:bg-[white] hover:text-blue-500 duration-500 h-full max-w-[200px] items-center justify-center text-lg rounded-md px-[2vw] bg-blue-500 border-none flex text-white">
        Sign in
      </button>
    </SignInButton>
  );
};

export default SignIn;
