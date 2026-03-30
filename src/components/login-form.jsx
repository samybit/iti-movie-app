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
import { useNavigate, Link } from "react-router-dom"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../lib/firebase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import toast, { Toaster } from "react-hot-toast"
import { useLanguage } from "@/contexts/LanguageContext"

function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()

  // Email login
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Check if email is verified
      if (!user.emailVerified) {
        toast.error(t('verifyEmailError'))
        await auth.signOut()
        setIsSubmitting(false)
        return
      }

      toast.success(t('loginSuccess'))
      navigate("/wishlist") // redirect after successful login

    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          toast.error(t('userNotFoundError'))
          break
        case "auth/wrong-password":
        case "auth/invalid-credential":
          toast.error(t('wrongPasswordError'))
          break
        case "auth/invalid-email":
          toast.error(t('invalidEmailError'))
          break
        case "auth/network-request-failed":
          toast.error(t('networkError'))
          break
        case "auth/too-many-requests":
          toast.error(t('tooManyRequestsError'))
          break
        default:
          toast.error(t('loginFailedError'))
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
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Optional: Check if Google email is verified
      if (!user.emailVerified) {
        toast.error(t('verifyEmailError'))
        await auth.signOut()
        setIsSubmitting(false)
        return
      }

      toast.success(t('loginGoogleSuccess'))
      navigate("/wishlist") // redirect after Google login

    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center mt-5 gap-6", className)} {...props}>
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <Card className="w-full max-w-md mx-auto p-6">
        <CardHeader>
          <CardTitle>{t('loginAccount')}</CardTitle>
          <CardDescription>
            {t('enterEmail')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
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
                  <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t('forgotPass')}
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
                  {isSubmitting ? t('loggingIn') : t('login')}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faGoogle} className="text-[#DB4437]" />
                  {t('loginGoogle')}
                </Button>

                <FieldDescription className="text-center mt-2">
                  {t('noAccount')}{" "}
                  <Link to="/register" className="text-indigo-600 hover:underline">
                    {t('signUp')}
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