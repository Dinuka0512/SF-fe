import { useEffect, useState } from "react";
import axios from "axios";

interface Farmer {
  _id: string;
  fristName: string;
  lastName: string;
  phone: string;
  address: string;
  location: { city: string; district: string };
}

interface Ad {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  farmer: Farmer;
}

export default function ViewAddComponent({ adId }: { adId: string }) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await axios.get(
          `https://sf-be.vercel.app/api/v1/ads/getAdAllDetails/${adId}`
        );
        setAd(res.data);
        console.log("ad : " + res.data)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [adId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading Ad...</p>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Ad not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{ad.title}</h2>

        {/* Images */}
        <div className="flex overflow-x-scroll gap-4 mb-4">
          {ad.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Ad image ${idx + 1}`}
              className="h-48 w-48 object-cover rounded-lg flex-shrink-0"
            />
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 whitespace-pre-line">{ad.description}</p>

        {/* Price */}
        <p className="text-xl font-semibold text-green-800 mb-4">
          Rs. {ad.price}
        </p>

        {/* Farmer Info */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-green-800 mb-2">Farmer Details</h3>
          <p>
            <span className="font-medium">Name:</span> {ad.farmer.fristName}{" "}
            {ad.farmer.lastName}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {ad.farmer.phone}
          </p>
          <p>
            <span className="font-medium">Address:</span> {ad.farmer.address}
          </p>
          <p>
            <span className="font-medium">Location:</span>{" "}
            {ad.farmer.location.district}, {ad.farmer.location.city}
          </p>
        </div>

        {/* Contact Button */}
        <button className="mt-6 w-full bg-green-800 hover:bg-green-700 text-white py-2 rounded-xl transition">
          Contact Seller
        </button>
      </div>
    </div>
  );
}
