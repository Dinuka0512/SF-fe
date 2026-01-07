import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../componnts/NavBar";
import Banner from "../componnts/Banner";
import SubNavBar from "../componnts/SubNavBar";
import Footer from "../componnts/Footer";
import { getAllAds } from "../services/Ad";

export default function Explore() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [adsData, setAdsData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const adsPerPage = 12;
  const isSignIn = localStorage.getItem("logedEmail");

  // 🔹 Load ads whenever page changes
  useEffect(() => {
    async function loadAds() {
      setLoading(true);
      try {
        const res = await getAllAds(currentPage, adsPerPage);
        setAdsData(res.ads);         // ads from API
        setTotalPages(res.totalPages); // total pages from API
      } catch (err) {
        console.error("Failed to load ads:", err);
      }
      setLoading(false);
    }
    loadAds();
  }, [currentPage]);

  // 🔹 Show modal if not signed in after 10 seconds
  useEffect(() => {
    if (!isSignIn) {
      const timer = setTimeout(() => setShowModal(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [isSignIn]);

  // 🔹 Filter ads based on search term
  const filteredAds = useMemo(() => {
    return adsData.filter((ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [adsData, searchTerm]);

  // 🔹 Pagination handler
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-white relative min-h-screen">
      <NavBar />
      <Banner />
      <SubNavBar />

      <div className={`p-6 ${showModal ? "blur-sm pointer-events-none" : ""}`}>
        {/* Heading + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-green-800">Available Ads</h1>

          <div className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <p className="text-green-800">Loading ads...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredAds.length > 0 ? (
                filteredAds.map((ad) => (
                  <div
                    key={ad._id}
                    className="bg-white border border-green-200 rounded-xl shadow-sm p-5"
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "160px",
                        borderRadius: "12px",
                        marginBottom: "16px",
                        backgroundColor: "#d1fae5",
                        backgroundImage: `url(${ad.images[0] || ""})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    ></div>

                    <h2 className="text-xl font-semibold text-green-800">
                      {ad.title.length > 25 ? ad.title.substring(0, 25) + "..." : ad.title}
                    </h2>

                    <p className="text-green-700 mt-2">
                      {ad.description.length > 100
                        ? ad.description.substring(0, 100) + "..."
                        : ad.description}
                    </p>

                    <p className="text-2xl font-bold text-green-800 mt-3">
                      Rs.{ad.price}
                    </p>

                    <button
                      onClick={() => {
                        if (!isSignIn) {
                          setShowModal(true);
                        } else {
                          navigate(`/ad/${ad._id}`);
                        }
                      }}
                      className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      View Details
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-green-800 col-span-full text-center">
                  No ads match your search.
                </p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded hover:bg-green-200 ${
                      page === currentPage ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />

      {/* Modal for non-signed-in users */}
      {showModal && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Sign Up Required</h2>
            <p className="text-gray-700 mb-6">
              To continue exploring Smart Farmer, please sign up or sign in.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/signUp")}
                className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/signIn")}
                className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
