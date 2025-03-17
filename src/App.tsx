import React, { useState } from 'react';
import { Search, Settings, Bell, User, LayoutGrid, Users, Calendar, FileText, DollarSign, BarChart2, PenTool, MoreVertical } from 'lucide-react';
import axios from 'axios';

interface Document {
  id: string;
  templateId: number;
  name: string;
  type: string;
  recipient: string;
  status: string;
  priority: string;
  dueDate: string;
}

function App() {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const documents: Document[] = [
    {
      id: '1',
      templateId: 1001,
      name: 'Adult Financial Renewal Form',
      type: 'HSConnect',
      recipient: 'john.smith@example.com',
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: '3/14/2024'
    },
    {
      id: '2',
      templateId: 1002,
      name: 'DOC-2024-002',
      type: 'Agreement',
      recipient: 'sarah.johnson@example.com',
      status: 'PENDING',
      priority: 'MEDIUM',
      dueDate: '3/19/2024'
    },
    {
      id: '3',
      templateId: 1003,
      name: 'DOC-2024-003',
      type: 'Contract',
      recipient: 'michael.brown@example.com',
      status: 'PENDING',
      priority: 'LOW',
      dueDate: '3/9/2024'
    }
  ];

  const stats = {
    totalDocuments: documents.length,
    pendingSignatures: documents.filter(doc => doc.status === 'PENDING').length,
    completed: 1,
    dueSoon: 3
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map(doc => doc.id));
    }
  };

  const handleSelectDocument = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  const handleSendForSignature = () => {
    alert(`Sending ${selectedDocuments.length} document(s) for signature`);
  };

  const handleActionClick = async (action: string, docId: string) => {
    const document = documents.find(doc => doc.id === docId);
    
    switch (action) {
      case 'send':
        try {
          const response = await axios.post('/api/send-for-signature', {
            templateId: document?.templateId,
            documentId: docId,
            recipient: document?.recipient,
            documentName: document?.name
          });
          alert(`Success: ${response.data.message}`);
          console.log('Email preview URL:', response.data.previewUrl);
        } catch (error) {
          alert('Error sending document for signature');
          console.error('Error sending document for signature:', error instanceof Error ? error.message : String(error));
        }
        break;
      case 'download':
        alert(`Downloading document ${docId}`);
        break;
      case 'delete':
        alert(`Deleting document ${docId}`);
        break;
    }
    setActiveDropdown(null);
  };

  const toggleDropdown = (docId: string) => {
    setActiveDropdown(activeDropdown === docId ? null : docId);
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
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] border-r">
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <LayoutGrid className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Users className="h-5 w-5" />
              <span>Recipients</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <DollarSign className="h-5 w-5" />
              <span>Billing</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BarChart2 className="h-5 w-5" />
              <span>Reports</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Documents Pending Signature</h1>
            <p className="text-gray-600">Manage and track document signatures</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Total Documents</h3>
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-3xl font-semibold">{stats.totalDocuments}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Pending Signatures</h3>
                <PenTool className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-3xl font-semibold">{stats.pendingSignatures}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Completed</h3>
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-3xl font-semibold">{stats.completed}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Due Soon</h3>
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-3xl font-semibold">{stats.dueSoon}</p>
            </div>
          </div>

          {/* Document List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.length === documents.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus:ring-0 text-sm placeholder-gray-400"
                  />
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
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => handleSelectDocument(doc.id)}
                        className="h-4 w-4 text-emerald-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">{doc.name}</td>
                    <td className="px-6 py-4">{doc.type}</td>
                    <td className="px-6 py-4">{doc.recipient}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        doc.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        doc.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {doc.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">{doc.dueDate}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(doc.id)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                        {activeDropdown === doc.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              <button
                                onClick={() => handleActionClick('send', doc.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Send for Signature
                              </button>
                              <button
                                onClick={() => handleActionClick('download', doc.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Download
                              </button>
                              <button
                                onClick={() => handleActionClick('delete', doc.id)}
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
        </main>
      </div>
    </div>
  );
}

export default App;