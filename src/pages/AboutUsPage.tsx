import NavBar from '../componnts/NavBar';
import Banner from '../componnts/Banner';
import Footer from '../componnts/Footer';
import { FaLeaf, FaHandshake, FaShoppingBasket, FaUsers } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();
  const features = [
    { 
      title: "Direct Connections", 
      desc: "Farmers connect directly with buyers — no middlemen, no hidden costs.", 
      icon: <FaHandshake className="text-green-800 text-3xl mb-3" /> 
    },
    { 
      title: "Simple Listings", 
      desc: "Easily list fresh produce and reach buyers instantly.", 
      icon: <FaShoppingBasket className="text-green-800 text-3xl mb-3" /> 
    },
    { 
      title: "Support Local", 
      desc: "Empower Sri Lankan farmers while buyers enjoy fresh, trusted produce.", 
      icon: <FaLeaf className="text-green-800 text-3xl mb-3" /> 
    },
    { 
      title: "Community Growth", 
      desc: "Strengthen local agriculture and build sustainable food networks.", 
      icon: <FaUsers className="text-green-800 text-3xl mb-3" /> 
    }
  ];

  return (
    <div className="relative">
      <NavBar />
      <Banner />

      {/* Hero Section */}
      <section className="bg-green-800 text-white py-16 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Smart Farmer</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-100">
          A modern platform connecting Sri Lankan farmers and buyers directly. 
          Fresh produce, fair trade, and sustainable agriculture — all in one place.
        </p>
      </section>

      {/* Features Section */}
      <section className="p-6 md:p-12 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-green-800">
          Why Smart Farmer?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition"
            >
              {feature.icon}
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-green-800">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-800 text-white py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Smart Farmer Today</h2>
        <p className="max-w-xl mx-auto mb-6 text-lg text-gray-100">
          Whether you’re a farmer or a buyer, Smart Farmer makes agriculture simple, fair, and sustainable.
        </p>
        <button onClick={(()=>{
          navigate("/signup")
          localStorage.clear()
        })} className="bg-white text-green-800 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">
          Get Started
        </button>
      </section>

      <Footer />
    </div>
  );
}
