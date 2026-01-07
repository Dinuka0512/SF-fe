import AdminPage from "../pages/AdminPage";
import BuyerPage from "../pages/BuyerPage";
import FarmerPage from "../pages/FarmerPage";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-800 font-semibold">Loading...</p>
        </div>
      </div>
    );

  /* ================= UNAUTHORIZED ================= */
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Unauthorized
          </h2>
          <p className="text-green-700 mb-6">
            Your session has expired. Please login again.
          </p>

          <button
            onClick={() => navigate("/signIn")}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );

  /* ================= ROLE BASED DASHBOARD ================= */
  const role = user.roles[0];

  if (role === "ADMIN") return <AdminPage />;
  if (role === "BUYER") return <BuyerPage />;
  if (role === "FARMER") return <FarmerPage />;

  /* ================= NO ROLE ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-red-600 font-semibold text-lg">
        No role assigned to this account
      </p>
    </div>
  );
}
