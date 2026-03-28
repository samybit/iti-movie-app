import { Navigate } from "react-router-dom"
import { auth } from "../lib/firebase"
function ProtectedRoute({ children }) {

  const user = auth.currentUser

  if (!user || !user.emailVerified) {
    return <Navigate to="/login" replace />
  }

  return children
}
export default ProtectedRoute