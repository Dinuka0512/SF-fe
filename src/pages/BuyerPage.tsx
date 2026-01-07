import { useEffect, useState } from "react";
import NavBar from "../componnts/NavBar";
import Banner from "../componnts/Banner";
import SubNavBar from "../componnts/SubNavBar";
import Footer from "../componnts/Footer";
import { getAllAds } from "../services/Ad";
import TodayNewsSection from "../componnts/TodayTopNews";
import { useNavigate } from "react-router-dom";

export default function BuyerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [adsData, setAdsData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const adsPerPage = 6;

  // Filter ads based on search term
  const filteredAds = adsData.filter((ad) =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [activeTab, setActiveTab] = useState("dashboard");

  // Load ads for current page
  useEffect(() => {
    async function loadAds() {
      setLoading(true);
      try {
        const res = await getAllAds(currentPage, adsPerPage);
        setAdsData(res.ads);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error("Failed to load ads:", err);
      }
      setLoading(false);
    }
    loadAds();
  }, [currentPage]);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  async function viewDetails(ad : any) {
    navigate(`/viewAd/${ad._id}`);
  }

  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <Banner />
      <SubNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <TodayNewsSection/>

      <div className="p-6">
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#d1fae5",
                        backgroundImage: `url(${ad.images[0]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>

                    <h2 className="text-xl font-semibold text-green-800">
                      {ad.title.length > 25 ? ad.title.substring(0, 25) + "..." : ad.title}
                    </h2>

                    <p className="text-green-700 mt-2">
                      {ad.description.length > 100 ? ad.description.substring(0, 100) + "..." : ad.description}
                    </p>

                    <p className="text-2xl font-bold text-green-800 mt-3">Rs.{ad.price}</p>

                    <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700" 
                      onClick={() => viewDetails(ad)}
                    >
                      View Details
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-green-800 col-span-full">No ads found.</p>
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
    </div>
  );
}
