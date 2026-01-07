import NavBar from '../componnts/NavBar'
import ContactBody from '../componnts/ContactBody'
import Footer from '../componnts/Footer'

export default function ContactUsPage() {
  return (
     <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* Contact Body takes remaining height */}
      <div className="flex-1">
        <ContactBody />
      </div>

      <Footer />
    </div>
  )
}