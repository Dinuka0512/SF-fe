import { useLocation, useNavigate } from "react-router-dom";

type Ad = {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
};

export default function AdDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ad = location.state?.ad as Ad;

  if (!ad) {
    return (
      <div className="p-6">
        <p className="text-red-600">Ad details not found!</p>
        <button
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <button
        className="mb-4 bg-green-600 text-white py-2 px-4 rounded-lg"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="max-w-3xl mx-auto bg-white border border-green-200 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-green-800 mb-4">{ad.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {ad.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={ad.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>

        <p className="text-green-700 mb-4">{ad.description}</p>
        <p className="text-2xl font-bold text-green-800">Rs. {ad.price}</p>

        <button className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Contact Seller
        </button>
      </div>
    </div>
  );
}
