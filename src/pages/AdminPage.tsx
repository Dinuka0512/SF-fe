import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../componnts/NavBar";
import Banner from "../componnts/Banner";
import SubNavBar from "../componnts/SubNavBar";
import Footer from "../componnts/Footer";
import TodayNewsSection from "../componnts/TodayTopNews";
import { deleteAdById, getAllAds } from "../services/Ad";
import Swal from "sweetalert2";

export default function AdminPage() {
  const navigate = useNavigate();

  const [adsData, setAdsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const res = await getAllAds(1, 1000);
      setAdsData(res.ads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

// ad is an object containing at least _id

const handleDelete = async (ad: { _id: string }) => {
  if (!ad._id) return;

  const confirmed = await Swal.fire({
    title: "Delete this ad?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    confirmButtonText: "Yes, delete",
  });

  if (!confirmed.isConfirmed) return;

  try {
    await deleteAdById(ad._id);

    Swal.fire("Deleted!", "Ad deleted successfully", "success");

    setAdsData((prev) => prev.filter((item) => item._id !== ad._id));
  } catch (err) {
    Swal.fire("Error", "Delete failed", "error");
  }
};


  const showCount = adsData.length < 6 ? adsData.length : 5;

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Banner />
      <SubNavBar />
      <TodayNewsSection />

      <div className="p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Admin Dashboard
        </h1>

        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Latest Ads
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ads */}
            {adsData.slice(0, showCount).map((ad) => (
              <div
                key={ad._id}
                className="border border-green-200 rounded-xl p-4 bg-white shadow-sm"
              >
                <div
                  className="h-32 rounded-lg mb-3"
                  style={{
                    backgroundImage: `url(${ad.images?.[0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#d1fae5",
                  }}
                />

                <p className="font-semibold text-green-800 line-clamp-1">
                  {ad.title}
                </p>

                <p className="text-sm text-green-700 line-clamp-2 mt-1">
                  {ad.description}
                </p>

                <p className="font-bold text-green-800 mt-2">
                  Rs. {ad.price}
                </p>

                {/* BUTTONS */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/viewAd/${ad._id}`)}
                    className="flex-1 text-sm bg-green-600 text-white py-1 rounded-lg hover:bg-green-700"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(ad)}
                    className="flex-1 text-sm bg-red-500 text-white py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {/* VIEW MORE */}
            <div
              onClick={() => navigate("/admin/all-ads")}
              className="cursor-pointer bg-green-100 border-2 border-dashed border-green-600 rounded-xl flex items-center justify-center p-6 hover:bg-green-200"
            >
              <div className="text-center">
                <p className="text-xl font-bold text-green-800">
                  View More Ads
                </p>
                <p className="text-sm text-green-700">
                  {adsData.length} total ads
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
