"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { salonAPI } from "@/utils/api";

interface Service {
  _id?: string;
  name: string;
  category: string;
  minDuration: number;
  maxDuration: number;
  price: number;
}

interface Salon {
  _id: string;
  name: string;
  slogan?: string;
  gender: string;
  address: string;
  city: string;
  services: Service[];
  logo?: string;
  gallery?: string[];
  rating?: number;
}

export default function RecommendedPage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const response = await salonAPI.getSalons();

      if (response && response.salons) {
        setSalons(response.salons);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load salons");
    } finally {
      setLoading(false);
    }
  };

  const filterSalons = () => {
    if (activeCategory === "all") {
      return salons;
    }

    return salons.filter((salon) =>
      salon.services.some((service) =>
        service.category.toLowerCase().includes(activeCategory.toLowerCase())
      )
    );
  };

  const filteredSalons = filterSalons();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Recommended For You
          </h1>

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
                activeCategory === "all"
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 hover:bg-pink-50"
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveCategory("hair")}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
                activeCategory === "hair"
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 hover:bg-pink-50"
              }`}
            >
              Hair Styling
            </button>
            <button
              onClick={() => setActiveCategory("nails")}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
                activeCategory === "nails"
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 hover:bg-pink-50"
              }`}
            >
              Nails
            </button>
            <button
              onClick={() => setActiveCategory("face")}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
                activeCategory === "face"
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 hover:bg-pink-50"
              }`}
            >
              Face & Body
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : filteredSalons.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2M12 17a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700">
                No salons found
              </h2>
              <p className="text-gray-500 mt-2">
                Try adjusting your filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSalons.map((salon) => (
                <Link key={salon._id} href={`/salon/${salon._id}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                    <div className="h-48 relative">
                      {salon.gallery && salon.gallery.length > 0 ? (
                        <Image
                          src={salon.gallery[0]}
                          alt={salon.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : salon.logo ? (
                        <Image
                          src={salon.logo}
                          alt={salon.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-pink-100 to-pink-300 flex items-center justify-center">
                          <span className="text-5xl font-extrabold text-white">
                            {salon.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {salon.rating && (
                        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center shadow-sm">
                          <svg
                            className="w-4 h-4 text-yellow-500 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium">
                            {salon.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {salon.name}
                      </h3>
                      {salon.slogan && (
                        <p className="text-gray-600 text-sm italic mb-3 truncate">
                          {salon.slogan}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {salon.services.slice(0, 3).map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-pink-50 text-pink-600 rounded-full text-xs"
                          >
                            {service.name}
                          </span>
                        ))}
                        {salon.services.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-full text-xs">
                            +{salon.services.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">
                          {salon.address}, {salon.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
