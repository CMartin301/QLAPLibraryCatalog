import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Book,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { BorrowRequestDto } from "../../types/borrowRequests";
import { borrowRequestService } from "../../services/borrowRequestService";
import { loanService } from "../../services/loanService";
import { Loan } from "../../types/loans";
import { BorrowRequestsTable } from "./BorrowRequestsTable";
import LoansTable from "./LoansTable";

type StatusFilter = "all" | "pending" | "approved" | "denied" | "cancelled";
type Section = "requests" | "loans";
type RequestsTab = "sent" | "received";

const BorrowingDashboard: React.FC = () => {
  const { userID } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Section + tab states
  const [activeSection, setActiveSection] = useState<Section>("requests");
  const [activeRequestsTab, setActiveRequestsTab] =
    useState<RequestsTab>("sent");

  // Data states
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequestDto[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Fetch borrow requests
  useEffect(() => {
    if (activeSection !== "requests" || !userID) return;
    loadBorrowRequests();
  }, [activeRequestsTab, activeSection, userID]);

  // Fetch loans
  useEffect(() => {
    if (activeSection !== "loans" || !userID) return;
    loadLoans();
  }, [activeSection, userID]);

  const loadBorrowRequests = async () => {
    if (!userID) return;
    
    setIsLoading(true);
    setError(null);

    try {
      let requests: BorrowRequestDto[];
      if (activeRequestsTab === "sent") {
        requests = await borrowRequestService.getBorrowRequestsForBorrower(
          userID
        );
      } else {
        requests = await borrowRequestService.getBorrowRequestsForLender(
          userID
        );
      }
      setBorrowRequests(requests);
    } catch (err) {
      setError("Failed to load borrow requests");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLoans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loanService.getLoans();
      setLoans(data);
    } catch (err) {
      setError("Failed to load loans");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter requests by status
  const filteredRequests = borrowRequests.filter((r) =>
    statusFilter === "all" ? true : r.status === statusFilter
  );

  if (isLoading) {
    return (
      <div className="container-fluid py-4 bg-pattern min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-500"></div>
            <p className="mt-4 text-gray-600">
              {activeSection === "requests"
                ? "Loading borrow requests..."
                : "Loading loans..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lavender-600 mb-2">
            Borrowing Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your borrow requests and active loans
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Section Tabs: Borrow Requests vs Loans */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveSection("requests")}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === "requests"
                    ? "border-lavender-500 text-lavender-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Borrow Requests</span>
                </div>
              </button>

              <button
                onClick={() => setActiveSection("loans")}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === "loans"
                    ? "border-lavender-500 text-lavender-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Book className="w-4 h-4" />
                  <span>Loans</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Borrow Requests Section */}
        {activeSection === "requests" && (
          <div className="bg-white rounded-lg shadow-sm">
            {/* Sub Tabs for Sent / Received */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveRequestsTab("sent")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeRequestsTab === "sent"
                      ? "border-lavender-500 text-lavender-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Requests I've Made</span>
                    <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {activeRequestsTab === "sent" ? borrowRequests.length : 0}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveRequestsTab("received")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeRequestsTab === "received"
                      ? "border-lavender-500 text-lavender-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Requests for My Media</span>
                    <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {activeRequestsTab === "received"
                        ? borrowRequests.length
                        : 0}
                    </span>
                  </div>
                </button>
              </nav>
            </div>

            <BorrowRequestsTable
              requests={filteredRequests}
              userRole={activeRequestsTab === "sent" ? "borrower" : "lender"}
              onRefresh={loadBorrowRequests}
            />
          </div>
        )}

        {/* Loans Section */}
        {activeSection === "loans" && (
          <div className="bg-white rounded-lg shadow-sm">
            <LoansTable loans={loans} 
              onRefresh={loadLoans} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowingDashboard;
