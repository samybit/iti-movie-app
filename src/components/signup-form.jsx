import { useMemo } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext"

const FieldStatus = ({ name, errors, dirtyFields, t }) => {
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
      {t('looksGood')}
    </FieldDescription>
  )
}

/////////////////////////////
// Component
/////////////////////////////

function SignupForm(props) {
  const { t } = useLanguage()
  const signupSchema = useMemo(() => z
    .object({
      name: z
        .string()
        .min(7, t('zod_name_min'))
        .regex(/^[\u0600-\u06FFa-zA-Z]{3,}\s[\u0600-\u06FFa-zA-Z]{3,}/, t('zod_name_regex')),
      email: z.string().email(t('zod_email_invalid')),
      password: z.string().min(6, t('zod_password_min'))
        .regex(/[A-Z]/, t('zod_password_regex'))
      ,
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: t('zod_confirm_match'),
      path: ["confirm"],
    }), [t]);

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

      toast.success(t('accountCreateSuccess'))

      navigate("/verify-email")
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error(t('emailInUseError'))
          break
        case "auth/invalid-email":
          toast.error(t('invalidEmailError'))
          break
        case "auth/weak-password":
          toast.error(t('weakPasswordError'))
          break
        default:
          toast.error(t('somethingWentWrong'))
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

      toast.success(t('accountCreateSuccess'), {
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
              <CardTitle>{t('createAccount')}</CardTitle>
              <CardDescription>
                {t('enterInfo')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(submitLogic)}>
                <FieldGroup>
                  {/* Name */}
                  <Field>
                    <FieldLabel>{t('fullName')}</FieldLabel>
                    <Input placeholder={t('fullName')} {...register("name")} />
                    <FieldStatus name="name" errors={errors} dirtyFields={dirtyFields} t={t} />
                  </Field>

                  {/* Email */}
                  <Field>
                    <FieldLabel>{t('email')}</FieldLabel>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                    />
                    <FieldStatus name="email" errors={errors} dirtyFields={dirtyFields} t={t} />
                  </Field>

                  {/* Password */}
                  <Field>
                    <FieldLabel>{t('password')}</FieldLabel>
                    <Input type="password" {...register("password")} />
                    <FieldStatus name="password" errors={errors} dirtyFields={dirtyFields} t={t} />
                  </Field>

                  {/* Confirm Password */}
                  <Field>
                    <FieldLabel>{t('confirmPass')}</FieldLabel>
                    <Input type="password" {...register("confirm")} />
                    <FieldStatus name="confirm" errors={errors} dirtyFields={dirtyFields} t={t} />
                  </Field>

                  {/* Submit */}
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? t('creatingAccount') : t('createAccountBtn')}
                  </Button>

                  {/* Google */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex gap-2"
                    onClick={handleGoogleSignup}
                  >
                    <FontAwesomeIcon icon={faGoogle} className="text-[#DB4437]" />
                    {t('signUpGoogle')}
                  </Button>

                  {/* Login Link */}
                  <p className="text-center text-sm text-muted-foreground">
                    {t('haveAccount')}{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                      {t('signIn')}
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