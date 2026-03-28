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

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth"

import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../lib/firebase"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"

import { Link, useNavigate } from "react-router-dom"

import registerImage from "../assets/registerImage.webp"

// Toast
import toast, { Toaster } from "react-hot-toast"

/////////////////////////////
// Validation Schema
/////////////////////////////

const signupSchema = z
  .object({
    name: z
      .string()
      .min(7, "Full name must be at least two words")
      .regex(/^[A-Za-z]{3,}\s[A-Za-z]{3,}/, "Enter first and last name (each at least 4 letters)"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

/////////////////////////////
// Component
/////////////////////////////

function SignupForm(props) {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  })

  /////////////////////////////
  // Email Signup
  /////////////////////////////

  const submitLogic = async (data) => {
    try {
      // create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      const user = userCredential.user

      // save data in firebase
      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        wishlist: [],
      })

      // send verification email
      await sendEmailVerification(user)

      toast.success(
        "Account created successfully ✅ Please verify your email 📩"
      )

      // redirect to login after signup
      navigate("/login")
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("This email is already registered ❌")
          break
        case "auth/invalid-email":
          toast.error("Invalid email format ❌")
          break
        case "auth/weak-password":
          toast.error("Password should be at least 6 characters ❌")
          break
        default:
          toast.error("Something went wrong. Try again later ❌")
      }
    }
  }

  /////////////////////////////
  // Google Signup
  /////////////////////////////

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "Guest",
          email: user.email,
          wishlist: [],
        },
        { merge: true }
      )

      toast.success(
        "Account created successfully ✅ Please verify your email 📩",
        {
          duration: 7000, // 
          position: "top-center",
        }
      );

      navigate("/login");
      // navigate("/wishlist") 
    } catch (error) {
      toast.error(error.message)
    }
  }

  /////////////////////////////
  // UI
  /////////////////////////////

  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Main Container */}
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
        {/* Left Image */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${registerImage})` }}
        />

        {/* Right Form */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-10 bg-white dark:bg-gray-900">
          <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Enter your information below to create your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(submitLogic)}>
                <FieldGroup>
                  {/* Name */}
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <Input placeholder="Your name" {...register("name")} />
                    {errors.name && (
                      <FieldDescription className="text-red-600">
                        {errors.name.message}
                      </FieldDescription>
                    )}
                  </Field>

                  {/* Email */}
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <FieldDescription className="text-red-600">
                        {errors.email.message}
                      </FieldDescription>
                    )}
                  </Field>

                  {/* Password */}
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <Input type="password" {...register("password")} />
                    {errors.password && (
                      <FieldDescription className="text-red-600">
                        {errors.password.message}
                      </FieldDescription>
                    )}
                  </Field>

                  {/* Confirm Password */}
                  <Field>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <Input type="password" {...register("confirm")} />
                    {errors.confirm && (
                      <FieldDescription className="text-red-600">
                        {errors.confirm.message}
                      </FieldDescription>
                    )}
                  </Field>

                  {/* Submit Button */}
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>

                  {/* Google Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex gap-2"
                    onClick={handleGoogleSignup}
                  >
                    <FontAwesomeIcon icon={faGoogle} className="text-[#DB4437]" />
                    Sign up with Google
                  </Button>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-500 dark:text-gray-300">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SignupForm