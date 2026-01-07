import { Routes, Route } from "react-router-dom"
import SignInPage from "../pages/SignInPage"
import SignUpPage from "../pages/SignUpPage"
import Explore from "../pages/ExplorePage"
import Contact from "../pages/ContactUsPage"
import ForgotPassword from "../pages/ForgotPassword"
import CheckOtpPage from "../pages/CheckOtp"
import ChangePassword from "../pages/ChangePassword"
import Dashboard from "../componnts/Dashboard"
import AboutUs from "../pages/AboutUsPage"
import ChangeUserPassword from "../pages/ChangeUserPassword"
import ViewSingleAd from "../pages/ViewSingleAd"

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Explore />} />
      <Route path="/signIn" element={<SignInPage />} />
      <Route path="/signUp" element={<SignUpPage />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/forgetPassword" element={<ForgotPassword/>} />
      <Route path="/checkOtp" element={<CheckOtpPage />} />
      <Route path="/changePassword" element={<ChangePassword/>} />
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/passwordChange" element={<ChangeUserPassword/>}/>
      <Route path="/viewAd/:id" element={<ViewSingleAd/>}/>
    </Routes>
  )
}
