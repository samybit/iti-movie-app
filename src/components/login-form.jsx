import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useState } from "react"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../lib/firebase"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import toast, { Toaster } from "react-hot-toast"

 function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Email login
const handleLogin = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    await signInWithEmailAndPassword(auth, email, password)
    toast.success("Logged in successfully ✅")
  } catch (error) {

   switch (error.code) {

  case "auth/user-not-found":
    toast.error("No account found with this email ❌")
    break

  case "auth/wrong-password":
  case "auth/invalid-credential":
    toast.error("Incorrect email or password ❌")
    break

  case "auth/invalid-email":
    toast.error("Invalid email format ❌")
    break

  case "auth/network-request-failed":
    toast.error("Check your internet connection 🌐")
    break

  case "auth/too-many-requests":
    toast.error("Too many attempts. Try again later ⏳")
    break

  default:
    toast.error("Login failed. Please try again ❌")
}

  } finally {
    setIsSubmitting(false)
  }
}

  // Google login
  const handleGoogleLogin = async () => {
    setIsSubmitting(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast.success("Logged in with Google ✅")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
   
    <div className={cn( " flex flex-col items-center justify-center mt-5 gap-6", className)} {...props}>
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <Card className="w-full max-w-md mx-auto p-6">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              {/* Buttons */}
              <Field className="flex flex-col gap-3 mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                   <FontAwesomeIcon
                      icon={faGoogle}
                      className="text-[#DB4437]"
                    />
                  Login with Google
                </Button>

                <FieldDescription className="text-center mt-2">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="text-indigo-600 hover:underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default LoginForm