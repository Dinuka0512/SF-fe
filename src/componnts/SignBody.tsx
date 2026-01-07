import { useState, type FormEvent } from "react"
import "../styles/SigninPageCss.css"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  changePassword,
  getMyDetails,
} from "../services/User"
import { useAuth } from "../context/authContext"

export default function SignBody({ type }: { type: string }) {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [fristName, setFristName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conformPassword, setConformPassword] = useState("")
  const [role, setRole] = useState("BUYER")
  const [otp, setOtp] = useState("")

  /* ================= REGISTER ================= */
  const handelRegister = async (e: FormEvent) => {
    e.preventDefault()

    if (!fristName || !lastName || !email || !password || !conformPassword) {
      Swal.fire("Error!", "All fields are required", "error")
      return
    }

    if (password !== conformPassword) {
      Swal.fire("Error!", "Passwords do not match", "error")
      return
    }

    try {
      await registerUser({
        fristName,
        lastName,
        email,
        password,
        conformPassword,
        role,
      })

      Swal.fire("Success!", "Registered successfully", "success").then(() => {
        navigate("/signin")
      })
    } catch (err: any) {
      Swal.fire("Error!", err.response?.data || "Registration failed", "error")
    }
  }

  /* ================= LOGIN ================= */
  const handelLogin = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      Swal.fire("Error!", "Email & password required", "error")
      return
    }

    try {
      const res = await loginUser({ email, password })

      localStorage.setItem("accessToken", res.data.accessToken)
      localStorage.setItem("refreshToken", res.data.refreshToken)

      const userDetails = await getMyDetails()
      setUser(userDetails.data)

      Swal.fire("Success!", "Login successful", "success").then(() => {
        navigate("/dashboard")
      })
    } catch (err: any) {
      Swal.fire("Error!", err.response?.data || "Login failed", "error")
    }
  }

  /* ================= SEND OTP ================= */
  const sendEmail = async (e: FormEvent) => {
    e.preventDefault()

    if (!email) {
      Swal.fire("Error!", "Email is required", "error")
      return
    }

    try {
      const res = await sendOtp(email)
      localStorage.setItem("otpEmail", email)

      Swal.fire("Success!", res.data, "success").then(() => {
        navigate("/checkOtp")
      })
    } catch (err: any) {
      Swal.fire("Error!", err.response?.data || "OTP sending failed", "error")
    }
  }

  /* ================= VERIFY OTP ================= */
  const checkOtpHandler = async (e: FormEvent) => {
    e.preventDefault()

    const localEmail = localStorage.getItem("otpEmail")

    if (!otp || !localEmail) {
      Swal.fire("Error!", "OTP is required", "error")
      return
    }

    try {
      const res = await verifyOtp({ email: localEmail, otp })

      Swal.fire("Success!", res.data, "success").then(() => {
        navigate("/changePassword")
      })
    } catch (err: any) {
      Swal.fire("Error!", err.response?.data || "Invalid OTP", "error")
    }
  }

  /* ================= CHANGE PASSWORD ================= */
  const changePwHandler = async (e: FormEvent) => {
    e.preventDefault()

    const localEmail = localStorage.getItem("otpEmail")

    if (!password || !conformPassword || !localEmail) {
      Swal.fire("Error!", "All fields are required", "error")
      return
    }

    if (password !== conformPassword) {
      Swal.fire("Error!", "Passwords do not match", "error")
      return
    }

    try {
      const res = await changePassword({
        email: localEmail,
        password,
      })

      localStorage.removeItem("otpEmail")

      Swal.fire("Success!", res.data, "success").then(() => {
        navigate("/signin")
      })
    } catch (err: any) {
      Swal.fire("Error!", err.response?.data || "Password change failed", "error")
    }
  }

  /* ================= JSX ================= */
  return (
    <div id="LogingBody">
      <section id="formSection">

        {type === "signup" && (
          <form>
            <input placeholder="First Name" onChange={(e) => setFristName(e.target.value)} />
            <input placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" onChange={(e) => setConformPassword(e.target.value)} />

            <select onChange={(e) => setRole(e.target.value)}>
              <option value="BUYER">Buyer</option>
              <option value="FARMER">Farmer</option>
            </select>

            <button type="button" onClick={handelRegister}>Register</button>
            <p onClick={() => navigate("/signin")}>Login here</p>
          </form>
        )}

        {type === "signin" && (
          <form>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

            <button type="button" onClick={handelLogin}>Sign In</button>

            <p onClick={() => navigate("/forgetPassword")}>Forgot password?</p>
            <p onClick={() => navigate("/signup")}>Create new account</p>
          </form>
        )}

        {type === "forget" && (
          <form>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <button type="button" onClick={sendEmail}>Send OTP</button>
          </form>
        )}

        {type === "checkOtp" && (
          <form>
            <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
            <button type="button" onClick={checkOtpHandler}>Verify OTP</button>
          </form>
        )}

        {type === "changePassword" && (
          <form>
            <input type="password" placeholder="New Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" onChange={(e) => setConformPassword(e.target.value)} />
            <button type="button" onClick={changePwHandler}>Change Password</button>
          </form>
        )}

      </section>

      <section id="imageSection"></section>
    </div>
  )
}
