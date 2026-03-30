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

import toast, { Toaster } from "react-hot-toast"

/////////////////////////////
// Validation Schema
/////////////////////////////

const signupSchema = z
  .object({
    name: z
      .string()
      .min(7, "Full name must be at least two words")
      .regex(/^[\u0600-\u06FFa-zA-Z]{3,}\s[\u0600-\u06FFa-zA-Z]{3,}/, "Enter first and last name (each at least 4 letters)"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    ,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

/////////////////////////////
// FieldStatus Helper
/////////////////////////////

const FieldStatus = ({ name, errors, dirtyFields }) => {
  if (!dirtyFields[name]) return null
  if (errors[name]) {
    return (
      <FieldDescription className="text-red-500 flex items-center gap-1 text-sm">
        ❌ {errors[name].message}
      </FieldDescription>
    )
  }
  return (
    <FieldDescription className="text-green-500 flex items-center gap-1 text-sm">
      ✅ Looks good!
    </FieldDescription>
  )
}

/////////////////////////////
// Component
/////////////////////////////

function SignupForm(props) {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields }, // 👈 أضفنا dirtyFields
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // 👈 live validation
  })

  /////////////////////////////
  // Email Signup
  /////////////////////////////

  const submitLogic = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        wishlist: [],
      })

      await sendEmailVerification(user)

      toast.success("Account created successfully ✅ Please verify your email 📩")

      navigate("/verify-email")
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

      toast.success("Account created successfully ✅ Please verify your email 📩", {
        duration: 7000,
        position: "top-center",
      })

      navigate("/login")
    } catch (error) {
      toast.error(error.message)
    }
  }

  /////////////////////////////
  // UI
  /////////////////////////////

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
        {/* Left Image */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${registerImage})` }}
        />

        {/* Right Form */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-10 bg-card text-card-foreground">
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
                    <FieldStatus name="name" errors={errors} dirtyFields={dirtyFields} />
                  </Field>

                  {/* Email */}
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                    />
                    <FieldStatus name="email" errors={errors} dirtyFields={dirtyFields} />
                  </Field>

                  {/* Password */}
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <Input type="password" {...register("password")} />
                    <FieldStatus name="password" errors={errors} dirtyFields={dirtyFields} />
                  </Field>

                  {/* Confirm Password */}
                  <Field>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <Input type="password" {...register("confirm")} />
                    <FieldStatus name="confirm" errors={errors} dirtyFields={dirtyFields} />
                  </Field>

                  {/* Submit */}
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>

                  {/* Google */}
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
                  <p className="text-center text-sm text-muted-foreground">
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