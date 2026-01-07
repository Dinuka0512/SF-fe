import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function SubNavBar({ activeTab, setActiveTab }: any) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="bg-white py-3 flex justify-center">
        <div className="flex items-center gap-2 text-green-800 font-semibold">
          <div className="w-5 h-5 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="bg-gray-50 py-6 px-4">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Unauthorized</h2>
          <p className="text-green-700 mb-4">Please sign in to access this section</p>
          <button
            onClick={() => navigate("/signIn")}
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );

  const role = user.roles[0];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signIn");
  };

  /* Tabs per role */
  let tabs: { key: string; label: string }[] = [];
  if (role === "FARMER") {
    tabs = [
      { key: "dashboard", label: "Dashboard" },
      { key: "newAd", label: "Post New Ad" },
      { key: "profile", label: "Profile" },
    ];
  } else if (role === "BUYER") {
    tabs = [
      { key: "explore", label: "Explore" },
      { key: "savedAds", label: "Saved Ads" },
    ];
  } else if (role === "ADMIN") {
    tabs = [
      { key: "dashboard", label: "Dashboard" },
      { key: "userManage", label: "Manage Users" },
      { key: "adsManage", label: "Manage Ads" },
    ];
  }
  
  return (
    <div className="bg-white shadow px-4 py-3">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        {/* Left nav */}
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-1">
          {tabs.map((tab) => (
            <NavBtn
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </NavBtn>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition sm:self-center"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

/* Reusable NavBtn */
function NavBtn({ children, active = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold shrink-0 transition ${
        active
          ? "bg-green-700 text-white"
          : "bg-green-50 text-green-800 hover:bg-green-100"
      }`}
    >
      {children}
    </button>
  );
}
