import React, { useState } from "react";
import { FaSearch, FaRobot, FaBrain, FaSpinner } from "react-icons/fa";
import { useAiSearchMutation } from "../../redux/api/api";
import { toast } from "react-toastify";

interface SearchResult {
  foundItems: any[];
  lostItems: any[];
  reasoning: string;
  totalFound: number;
  totalLost: number;
}

const AiSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [aiSearch, { isLoading }] = useAiSearchMutation();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    try {
      const result = await aiSearch({ query: searchQuery }).unwrap();
      setSearchResults(result);
      toast.success("AI search completed successfully!");
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(error?.data?.message || "Search failed. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaBrain className="text-4xl text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              AI-Powered Search
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use our advanced AI to find lost or found items. Just describe what you're looking for in natural language!
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <FaRobot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., I lost a black iPhone 13 near the library yesterday..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaSearch />
                )}
                <span>{isLoading ? "Searching..." : "Search"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="max-w-6xl mx-auto">
            {/* AI Reasoning */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <FaBrain className="mr-2 text-indigo-600" />
                AI Analysis
              </h3>
              <p className="text-gray-700 bg-indigo-50 p-4 rounded-lg">
                {searchResults.reasoning}
              </p>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <h4 className="text-lg font-semibold text-green-800">Found Items</h4>
                <p className="text-2xl font-bold text-green-600">{searchResults.totalFound}</p>
              </div>
              <div className="bg-red-100 rounded-lg p-4 text-center">
                <h4 className="text-lg font-semibold text-red-800">Lost Items</h4>
                <p className="text-2xl font-bold text-red-600">{searchResults.totalLost}</p>
              </div>
            </div>

            {/* Found Items Results */}
            {searchResults.foundItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  📍 Found Items That Match Your Search
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.foundItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.foundItemName}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {item.foundItemName}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.description}
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><strong>Category:</strong> {item.category?.name}</p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Date:</strong> {formatDate(item.date)}</p>
                        <p><strong>By:</strong> {item.user?.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lost Items Results */}
            {searchResults.lostItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  🔍 Lost Items That Match Your Search
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.lostItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.lostItemName}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {item.lostItemName}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.description}
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><strong>Category:</strong> {item.category?.name}</p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Date:</strong> {formatDate(item.date)}</p>
                        <p><strong>By:</strong> {item.user?.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.totalFound === 0 && searchResults.totalLost === 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search query or check back later for new items.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search Tips */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              💡 Search Tips
            </h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>• Be descriptive: "I lost a black iPhone 13 with a cracked screen"</li>
              <li>• Include location: "near the library" or "in the cafeteria"</li>
              <li>• Mention timing: "yesterday afternoon" or "last week"</li>
              <li>• Add unique features: "blue case" or "silver keychain attached"</li>
              <li>• Use natural language - our AI understands context!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSearch;
