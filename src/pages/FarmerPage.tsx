import { useEffect, useState } from "react";
import Banner from "../componnts/Banner";
import NavBar from "../componnts/NavBar";
import SubNavBar from "../componnts/SubNavBar";
import Footer from "../componnts/Footer";
import { useNavigate } from "react-router-dom";
import ProfileCompletionGuard from "../componnts/ProfileCompleteChecker";
import { useAuth } from "../context/authContext";
import Swal from "sweetalert2";
import { updateUser } from "../services/User";
import { createNewPost, deleteAdById, getUserAllAds, updateAd } from "../services/Ad";
import TodayNewsSection from "../componnts/TodayTopNews";


function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}

export default function FarmerPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();
  const [adsData, setAdsData] = useState<any[]>([]);

  // Profile fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.fristName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setDistrict(user.location?.district || "");
      setCity(user.location?.city || "");
    }
  }, [user]);

  // HERE UPDATE THE USER
  async function UserUpdate() {
    if (!user) return;

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !address || !district || !city) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields before updating your profile.",
      });
      return;
    }

    try {
      const email = user.email;
      console.log(firstName + " " + lastName + " " + email + " " + phone + " " + address + " " + district+ " "+ city)

      const res = await updateUser({
        firstName,
        lastName,
        email,
        phone,
        address,
        district,
        city,
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been updated successfully.",
      })

      setIsEditing(false);
      console.log(res);

    } catch (err: any) {
      console.log(err)
      
      Swal.fire(
        "Error!",
        err.response?.data?.message || "User Update Failed!",
        "error"
      );
    }
  }
 
  const uploadImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };


  //Here Need to post the add
  async function postAd() {
    if (!title || !description || !price || !category || images.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "All fields and at least one image are required",
      });
      return;
    }

    // Show loading alert 
    Swal.fire(
      { title: "Posting your ad...", 
        text: "Please wait", 
        allowOutsideClick: false, 
        didOpen: () => 
          { Swal.showLoading();}, 
      }
    );

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      images.forEach((files) => {
        formData.append("images", files); // MUST match multer field name
      });

      //Here Creating the post
      await createNewPost(formData);

      Swal.fire("Success", "Ad posted successfully!", "success");
      clearTextPostAdd();
      setImages([]);

    } catch (err: any) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to post ad",
        "error"
      );

      console.log(err)
    }
  }


  async function clearTextPostAdd() {
    setTitle("")
    setDescription("")
    setPrice("")
    setCategory("")
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {getUserAds();}, []);

  //Here Getting All Users Ads
  async function getUserAds() {
    try {
      const res = await getUserAllAds();
      setAdsData(res);
    } catch (err) {
      console.log("Error:", err);
    }
  }

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




  const handleEditAd = (ad: any) => {
  Swal.fire({
    title: `<span style="color:#065f46;font-weight:700">Edit Ad</span>`,
    background: "#f0fdf4", // light green
    html: `
      <div style="
        background:#ffffff;
        padding:16px;
        border-radius:16px;
        display:flex;
        flex-direction:column;
        gap:12px;
        text-align:left;
      ">
        <label style="color:#065f46;font-weight:600">Title</label>
        <input id="title"
          value="${ad.title}"
          style="padding:10px;border:1px solid #16a34a;border-radius:10px;width:100%;" />

        <label style="color:#065f46;font-weight:600">Description</label>
        <textarea id="desc"
          style="padding:10px;border:1px solid #16a34a;border-radius:10px;width:100%;min-height:80px;"
        >${ad.description}</textarea>

        <label style="color:#065f46;font-weight:600">Price (Rs.)</label>
        <input id="price"
          type="number"
          value="${ad.price}"
          style="padding:10px;border:1px solid #16a34a;border-radius:10px;width:100%;" />

        <label style="color:#065f46;font-weight:600">Category</label>
        <input id="category"
          value="${ad.category}"
          style="padding:10px;border:1px solid #16a34a;border-radius:10px;width:100%;" />
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Update Ad",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#065f46", // bg-green-800
    cancelButtonColor: "#d1d5db",
    focusConfirm: false,
    preConfirm: () => ({
      title: (document.getElementById("title") as HTMLInputElement).value,
      description: (document.getElementById("desc") as HTMLTextAreaElement).value,
      price: (document.getElementById("price") as HTMLInputElement).value,
      category: (document.getElementById("category") as HTMLInputElement).value,
    }),
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    try {
      await updateAd(ad._id, result.value);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Ad updated successfully",
        confirmButtonColor: "#065f46",
      });

      setAdsData((prev) =>
        prev.map((item) =>
          item._id === ad._id ? { ...item, ...result.value } : item
        )
      );
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Update failed",
        confirmButtonColor: "#065f46",
      });
    }
  });
};



  const activeAdsCount = adsData.filter(ad => ad.isActive === true || ad.isActive === "true").length;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBar />
      <Banner />
      <SubNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <ProfileCompletionGuard onIncomplete={() => setActiveTab("profile")} />
      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <div className="max-w-7xl mx-auto px-4 py-10 flex-1" id="DashboardContent">
          <TodayNewsSection/>
          <h1 className="text-3xl font-bold text-green-800 mt-7 mb-6">Farmer Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500">Total Ads</p>
              <h2 className="text-3xl font-bold text-green-800">{adsData.length}</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500">Active Ads</p>
              <h2 className="text-3xl font-bold text-green-800">{activeAdsCount}</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500">Total Impressions</p>
              <h2 className="text-3xl font-bold text-green-800">1,248</h2>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="font-bold text-2xl text-green-800 mb-6">Manage Ads</h1>
            <div className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {adsData.map((ad) => (
              <div
                key={ad.id}
                className="bg-white border border-green-200 rounded-xl p-5 shadow-sm flex flex-col gap-4" 
                onClick={()=> navigate(`/viewAd/${ad._id}`)}
              >
                <div
                  style={{
                    width: "100%",
                    height: "128px",
                    backgroundImage: `url(${ad.images[0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "12px",
                  }}
                />

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-800">
                    {ad.title.length > 20 ? ad.title.substring(0, 20) + "..." : ad.title}
                  </h3>
                  <p className="text-green-700">
                    {ad.description.length > 100
                      ? ad.description.substring(0, 100) + "..."
                      : ad.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xl font-bold text-green-800">Rs.{ad.price}</p>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    onClick={() => handleEditAd(ad)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white"
                    onClick={() => handleDelete(ad)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>


            </div>
          </div>
        </div>
      )}

      {/* Post New Ad */}
      {activeTab === "newAd" && (
        <div className="w-full px-4 py-10 flex justify-center items-center">
          <div className="w-full max-w-2xl">
            <h1 className="font-bold text-2xl text-green-800 mb-6 text-center">Post New Ad</h1>
            
            {/* POST ADD FORM */}
            <form className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-green-800 font-semibold mb-1">Product Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="e.g. Fresh Tomatoes"
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-green-800 font-semibold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your product"
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-green-800 font-semibold mb-1">Price (Rs.)</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="e.g. 150"
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-green-800 font-semibold mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                    <option value="">Select category</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-green-800 font-semibold mb-1">Upload Images</label>
                <input type="file" 
                  multiple
                  onChange={uploadImages}
                  className="w-full border border-green-300 rounded-lg p-2" />
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  onClick={postAd}
                  className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition">
                  Post Ad
                </button>
                <button
                  type="reset"
                  onClick={clearTextPostAdd}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile */}
      {activeTab === "profile" && (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-green-800 text-center mb-6">My Profile</h1>

          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            {!isEditing ? (
              <>
                {/* Profile View Mode */}
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold text-3xl">
                      {firstName ? firstName[0].toUpperCase() : "U"}
                    </span>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-green-800">
                      {firstName || "First Name"} {lastName || "Last Name"}
                    </h2>
                    <p className="text-gray-600">{email || "email@example.com"}</p>
                    <span className="inline-block mt-2 px-4 py-1 text-sm rounded-full bg-green-100 text-green-700">
                      Farmer
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <ProfileItem label="Phone" value={user.phone || "-"} />
                  <ProfileItem label="Address" value={user.address || "-"} />
                  <ProfileItem label="District" value={user.location.district || "-"} />
                  <ProfileItem label="City" value={user.location.city || "-"} />
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/passwordChange")}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Change Password
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode Form */}
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-green-800 font-semibold mb-1">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-green-800 font-semibold mb-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-green-800 font-semibold mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-green-800 font-semibold mb-1">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-green-800 font-semibold mb-1">District</label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-green-800 font-semibold mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:border-green-600"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center pt-4">
                    <button
                     type="submit"
                      className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                      onClick={UserUpdate}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() =>{
                        setIsEditing(false)
                        setPhone("")
                        setAddress("")
                        setDistrict("")
                        setCity("")    
                      }
                    }
                      className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
