import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../lib/firebase"
import registerImage from "../assets/registerImage.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"

// Validation Schema
const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const user = userCredential.user
      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        wishlist: [],
      })
      alert("Account created successfully ✅")
    } catch (error) {
      alert(error.message)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "Guest",
        email: user.email,
        wishlist: [],
      }, { merge: true })
      alert("Signed in with Google ✅")
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="flex min-h-screen">
     
      <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${registerImage})` }}>
      
      </div>

      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50 p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-center text-gray-500 mb-6">Get started with MovieApp today.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gy-4">
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm h-4">{errors.name?.message}</p>

            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm h-4">{errors.email?.message}</p>

            <input
              type="password"
              placeholder="Create a password"
              {...register("password")}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm h-4">{errors.password?.message}</p>

            <input
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm h-4">{errors.confirmPassword?.message}</p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isSubmitting ? "Creating..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              
              className="mt-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faGoogle} className="text-[#DB4437]" />
              Sign up with Google
            </button>

            <p className="text-center text-gray-600 mt-2">
              Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}