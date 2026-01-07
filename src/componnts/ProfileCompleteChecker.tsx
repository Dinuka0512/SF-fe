import { useEffect } from "react"
import Swal from "sweetalert2"
import { useAuth } from "../context/authContext"

interface Props {
  onIncomplete?: () => void
}

export default function ProfileCompletionGuard({ onIncomplete }: Props) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading || !user) return

    const missingFields: string[] = []

    if (!user.fristName) missingFields.push("First Name")
    if (!user.lastName) missingFields.push("Last Name")
    if (!user.email) missingFields.push("Email")
    if (!user.phone) missingFields.push("Phone Number")
    if (!user.address) missingFields.push("Address")
    if (!user.location?.district) missingFields.push("District")
    if (!user.location?.city) missingFields.push("City")

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Profile Incomplete",
        html: `
          <p>Please complete your profile.</p>
          <ul style="text-align:left;margin-top:10px">
            ${missingFields.map(f => `<li>• ${f}</li>`).join("")}
          </ul>
        `,
        confirmButtonText: "Update Profile",
        confirmButtonColor: "#15803d",
        allowOutsideClick: false,
      }).then(() => {
        onIncomplete?.()
      })
    }
  }, [user, loading])

  return null
}