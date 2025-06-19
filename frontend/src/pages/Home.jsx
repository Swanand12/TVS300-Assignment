import axios from "axios";
import { useState } from "react";
import { ImSpinner9 } from "react-icons/im";

const Home = () => {
  const [domainName, setDomainName] = useState(""); // stores domain name
  const [infoType, setInfoType] = useState(""); // stores info type
  const [data, setData] = useState(null); // holds response data
  const [error, setError] = useState(""); // stores error message
  const [loading, setLoading] = useState(false); // loading variable
  const backend_url = import.meta.env.VITE_BACKEND_URL; // backend url

  // Function for fetching data from server
  const handleLookUp = async () => {
    setLoading(true);
    setError("");

    if (!domainName) {
      setError("Please enter a domainName");
      return;
    }

    if (!infoType) {
      setError("Please select an infoType");
      return;
    }

    try {
      const res = await axios.get(`${backend_url}/api/v1/dns/get`, {
        params: {
          domainName,
          infoType,
        },
      });

      if (res?.data?.success) {
        setLoading(false);
        setData(res?.data?.dnsData);
        console.log(res?.data?.dnsData);
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Failed to fetch domain data.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col  items-center p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-[520px] space-y-5 my-10">
        <h1 className="text-2xl font-bold text-center">Domain Lookup Tool</h1>
        <input
          type="text"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          placeholder="Enter domain (e.g. example.com)"
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
        />

        <select
          value={infoType}
          onChange={(e) => setInfoType(e.target.value)}
          className={`w-full border px-4 py-2 rounded-md focus:outline-none ${
            infoType === "" ? "text-gray-500" : "text-black"
          }`}
        >
          <option value="" disabled hidden className="text-gray-500">
            Select InfoType
          </option>
          <option value="domain">Domain Information</option>
          <option value="contact">Contact Information</option>
        </select>

        {error && (
          <div className="text-red-500 font-semibold px-2">{error}</div>
        )}

        <button
          onClick={handleLookUp}
          className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? (
            <span className="animate-spin">
              <ImSpinner9 size={24} />
            </span>
          ) : (
            "Lookup"
          )}
        </button>

        {data && (
          <table className="mt-4 w-full text-sm border-2">
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key} className="border-t-2">
                  <td className="font-medium px-2 py-2">
                    {key.split("_").join(" ")}
                  </td>
                  <td className="px-2 py-1">{value || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Home;
