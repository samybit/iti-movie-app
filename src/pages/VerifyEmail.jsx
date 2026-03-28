import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function VerifyEmail() {
  return (
    <div className="flex border-2 border-dashed border-gray-200 flex-col p-12  items-center justify-center bg-purple-50 mt-32">

      <div className="text-center space-y-6">

        <h1 className="text-3xl font-bold">
          Verify Your Email 📩
        </h1>

        <p className="max-w-md">
          We sent a verification link to your email.
         Please check your inbox <span className="text-red-500 font-bold ">(and spam folder if needed)</span>  before logging in.
            </p>

        <Button asChild>
          <Link to="/login">
            Go to Login
          </Link>
        </Button>

      </div>

    </div>
  );
}

export default VerifyEmail;