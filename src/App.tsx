import React, { useState, useEffect } from "react";
import {
  Search,
  Settings,
  Bell,
  User,
  LayoutGrid,
  Calendar,
  FileText,
  PenTool,
  MoreVertical,
} from "lucide-react";
import axios from "axios";

type userData = {
  custid: number;
  documentname: string;
  templateid: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  status: string;
  priority: number;
  duedate: string;
};

function App() {
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [summary, setSummary] = useState({
    PendingSignatures: 0,
    Completed: 0,
    DueSoon: 0,
    TotalDocuments: 0,
  });
  const [userData, setUserData] = useState<userData[]>([
    {
      custid: 0,
      documentname: "",
      templateid: "",
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      status: "",
      priority: 0,
      duedate: "",
    },
  ]);
  const baseURL =
    "https://smartbox-digital-signature-api-1001466762095.us-central1.run.app";

  const fetchSummary = async () => {
    const { data } = await axios.get(`${baseURL}/customers/summary`);
    setSummary(data);
  };

  const fetchUserData = async () => {
    const { data } = await axios.get(`${baseURL}/customers_information`);
    setUserData(data);
  };

  useEffect(() => {
    fetchSummary();
    fetchUserData();
  }, []);

  const handleSelectAll = () => {
    if (selectedDocuments.length === userData.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(userData.map((user) => user.custid));
    }
  };

  const handleSelectDocument = (id: number) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter((custid) => custid !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  const handleSendForSignature = async () => {
    await axios.post(`${baseURL}/digital-sign/send-document`, {
      customer_ids: selectedDocuments,
    });
  };

  const handleActionClick = async (action: string, id: number) => {
    switch (action) {
      case "send":
        try {
          await axios.post(`${baseURL}/digital-sign/send-document`, {
            customer_ids: [activeDropdown],
          });
        } catch (error) {
          alert("Error sending document for signature");
          console.error(
            "Error sending document for signature:",
            error instanceof Error ? error.message : String(error)
          );
        }
        break;
      case "download":
        alert(`Downloading document ${id}`);
        break;
      case "delete":
        alert(`Deleting document ${id}`);
        break;
    }
    setActiveDropdown(null);
  };

  const toggleDropdown = (custid: number) => {
    setActiveDropdown(activeDropdown === custid ? null : custid);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-emerald-700 font-semibold text-xl">
              <PenTool className="h-6 w-6 mr-2" />
              DeloitteSign
            </div>
            <div className="w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="h-6 w-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-gray-500">Administrator</div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-auto border-r">
          <nav className="p-4 space-y-2">
            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LayoutGrid className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">
              Documents Pending Signature
            </h1>
            <p className="text-gray-600">
              Manage and track document signatures
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Total Documents</h3>
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-3xl font-semibold">{summary.TotalDocuments}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Pending Signatures</h3>
                <PenTool className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-3xl font-semibold">
                {summary.PendingSignatures}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Completed</h3>
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-3xl font-semibold">{summary.Completed}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Due Soon</h3>
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-3xl font-semibold">{summary.DueSoon}</p>
            </div>
          </div>

          {/* Document List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-2 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.length === userData.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  <p>Select All</p>
                  {/* <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus:ring-0 text-sm placeholder-gray-400"
                  /> */}
                </div>
                <button
                  onClick={handleSendForSignature}
                  disabled={selectedDocuments.length === 0}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send for Signature
                </button>
              </div>
            </div>
            <div style={{ height: "300px", overflowY: "auto" }}>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userData.map((user) => (
                    <tr key={user.custid} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(user.custid)}
                          onChange={() => handleSelectDocument(user.custid)}
                          className="h-4 w-4 text-emerald-600 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">{user.documentname}</td>
                      <td className="px-6 py-4">
                        {`${user.firstname} ${user.lastname}`}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.priority === 1
                              ? "bg-red-100 text-red-800"
                              : user.priority === 2
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.priority === 1
                            ? "High"
                            : user.priority === 2
                            ? "Medium"
                            : "Low"}
                        </span>
                      </td>
                      <td className="px-6 py-4">{user.duedate}</td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(user.custid)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-600" />
                          </button>
                          {activeDropdown === user.custid && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                              <div className="py-1">
                                <button
                                  onClick={() =>
                                    handleActionClick("send", user.custid)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Send for Signature
                                </button>
                                <button
                                  onClick={() =>
                                    handleActionClick("download", user.custid)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Download
                                </button>
                                <button
                                  onClick={() =>
                                    handleActionClick("delete", user.custid)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
