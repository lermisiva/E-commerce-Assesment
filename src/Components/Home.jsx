import React, { useEffect, useState } from "react";
import "../Styles/style.css";

const SkeletonCard = () => (
  <div className="animate-pulse p-4 border rounded-lg shadow-md bg-white w-64 shimmering">
    <div className="h-40 bg-gray-300 rounded mb-4"></div>
    <div className="h-5 bg-gray-300 rounded mb-3"></div>
    <div className="h-4 bg-gray-300 rounded mb-2"></div>
    <div className="h-4 bg-gray-300 rounded"></div>
  </div>
);

const ProductCard = ({ product, addToCart }) => (
  <div className="p-4 m-3 border rounded-lg shadow-md bg-white w-64 product-card">
    <img
      src={product.image}
      alt={`Image of ${product.name}`}
      className="w-full h-40 object-cover rounded mb-4"
    />
    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
    <p className="text-sm font-medium text-green-500 mb-2">
      Price: ${product.price}
    </p>
    <div className="flex justify-between">
      <button
        className="overflow-hidden border border-slate-500 px-2 py-2 bg-slate-800 rounded-2xl text-gray-200 hover:text-slate-800 hover:bg-gray-200"
        onClick={(e) => addToCart(e)}
      >
        Add To Cart
        <span className="ripple"></span>
      </button>
      <a
        className="border border-slate-500 px-2 py-2 bg-slate-800 rounded-2xl text-gray-200 hover:text-slate-800 hover:bg-gray-200"
        href="#"
      >
        Buy Now
      </a>
    </div>
  </div>
);

export function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    priceRange: [0, 300],
    rating: 0,
    stock: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("./products.json");
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
        setFilters(data.filters);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderSkeletons = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ));
  };

  const handleAddToCart = (e) => {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = button.querySelector(".ripple");
    ripple.style.top = `${y}px`;
    ripple.style.left = `${x}px`;
    ripple.classList.add("animate");

    setTimeout(() => {
      ripple.classList.remove("animate");
    }, 600);

    setCartCount(cartCount + 1);
  };

  const applyFilters = () => {
    let filtered = products;

    if (selectedFilters.category) {
      filtered = filtered.filter(
        (product) => product.category === selectedFilters.category
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= selectedFilters.priceRange[0] &&
        product.price <= selectedFilters.priceRange[1]
    );

    if (selectedFilters.rating > 0) {
      filtered = filtered.filter(
        (product) => Math.floor(product.rating) >= selectedFilters.rating
      );
    }

    if (selectedFilters.stock) {
      filtered = filtered.filter(
        (product) =>
          (selectedFilters.stock === "In Stock" && product.stock > 0) ||
          (selectedFilters.stock === "Out of Stock" && product.stock === 0)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters({ ...selectedFilters, [key]: value });
  };

  return (
    <div>
      {/* Cart Icon */}
      <div className="fixed top-5 right-5 z-50">
        <div className="relative text-2xl text-gray-800">
          🛒
          <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-sm px-2 py-1">
            {cartCount}
          </span>
        </div>
      </div>

      {/* Filter button */}
      <div className=" text-white font-semibold flex text-sm w-24 mx-5 rounded-md px-4 py-2 bg-blue-500 fixed"onClick={() => setIsFilterOpen(!isFilterOpen)}>

        <button
          className="px-2"
          
        >
          Filter
        </button>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
        

      </div>

      {/* Sliding filter menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-200 shadow-lg transform transition-transform ${isFilterOpen ? "translate-x-0" : "-translate-x-full"
          } w-64 p-5`}
      >
        <h2 className="text-lg font-bold mb-4">Filter Options</h2>
        <button
          className="absolute top-4 right-4 text-gray-600"
          onClick={() => setIsFilterOpen(false)}
        >
          ✕
        </button>
        <div className="flex flex-col space-y-3">
          <label>
            Category:
            <select
              value={selectedFilters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
            >
              <option value="">All</option>
              {filters.categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Price Range:
            <input
              type="range"
              min={filters.priceRange?.min || 0}
              max={filters.priceRange?.max || 300}
              value={selectedFilters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange("priceRange", [
                  selectedFilters.priceRange[0],
                  Number(e.target.value),
                ])
              }
              className="w-full mt-2"
            />
          </label>
          <label>
            Rating:
            <input
              type="number"
              min={0}
              max={5}
              value={selectedFilters.rating}
              onChange={(e) => handleFilterChange("rating", Number(e.target.value))}
              className="w-full mt-2 p-2 border rounded-md"
            />
          </label>
          <label>
            Stock:
            <select
              value={selectedFilters.stock}
              onChange={(e) => handleFilterChange("stock", e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
            >
              <option value="">All</option>
              {filters.stockAvailability?.map((stock) => (
                <option key={stock} value={stock}>
                  {stock}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={applyFilters}
            className="bg-gray-800 text-white rounded-md px-4 py-2 mt-4"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Product list */}
      <div className="flex  min-h-screen py-5 px-1 bg-slate-200">
        <div className="flex flex-wrap gap-2 justify-center">
          {loading && renderSkeletons(products.length || 10)}
          {!loading && error && (
            <p className="text-red-500">Failed to load products.</p>
          )}
          {!loading && filteredProducts.length === 0 && !error && (
            <p className="text-gray-500">No products available.</p>
          )}
          {!loading &&
            !error &&
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={handleAddToCart}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
