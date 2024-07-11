import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";
import { motion } from "framer-motion";
import SignIn from "./components/SignIn";
import Dashboard from "./Dashboard";

const socket = io.connect("https://backend-pgv8.onrender.com");

function App() {
  return (
    <>
      <SignedOut>
        <div className="w-screen lg:h-screen flex flex-col items-center justify-between overflow-hidden">
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className=" top-0 flex w-full min-h-[70px] bg-[#efefef] px-[3vw] items-center justify-between"
          >
            <div>
              <img
                className="w-[50px] rounded-lg"
                src="images/testify.jpg"
                alt=""
              />
            </div>
            <SignIn />
          </motion.div>
          <div className="flex h-full items-center">
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-[60%] pl-[5vw]  flex flex-col gap-[5vh]"
            >
              <div className="flex">
                <h1 className="text-8xl font-bold ">Taskify</h1>
              </div>
              <p className="text-4xl font-medium">
                We help you to <br />{" "}
                <span className="text-blue-500">
                  {" "}
                  "Optimize Your Workflow <br /> & Simplify Success."
                </span>
              </p>

              <SignIn />
            </motion.div>
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-[60%] shadow-none flex justify-center items-center"
            >
              <img className="-z-10" src="images/image.png" alt="" />
            </motion.div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <Dashboard socket={socket} />
      </SignedIn>
    </>
  );
}

export default App;
