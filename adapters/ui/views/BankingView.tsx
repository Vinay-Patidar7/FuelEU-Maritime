import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { BankingInfo } from "../../../core/domain/types";
import { mockApiService } from "../../infrastructure/mockApi";

const BankingView: React.FC = () => {
  const [bankingInfo, setBankingInfo] = useState<BankingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [history, setHistory] = useState<
    { action: string; cb_before: number; applied: number; cb_after: number }[]
  >([]);

  const fetchBankingInfo = async (selectedYear: number) => {
    setIsLoading(true);
    const data = await mockApiService.getBankingInfo(selectedYear);
    setBankingInfo(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBankingInfo(year);
  }, [year]);

  const showFeedback = (message: string, type: "success" | "error") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 4000);
  };

  const handleBankSurplus = async () => {
    if (!bankingInfo || bankingInfo.complianceBalance <= 0) return;
    const cb_before = bankingInfo.complianceBalance;
    const updatedInfo = await mockApiService.bankSurplus();
    const applied = cb_before - updatedInfo.complianceBalance;
    setBankingInfo(updatedInfo);
    setHistory((prev) => [
      ...prev,
      {
        action: "Banked Surplus",
        cb_before,
        applied,
        cb_after: updatedInfo.complianceBalance,
      },
    ]);
    showFeedback("Surplus successfully banked.", "success");
  };

  const handleApplyBanked = async () => {
    if (
      !bankingInfo ||
      bankingInfo.bankedSurplus <= 0 ||
      bankingInfo.complianceBalance >= 0
    )
      return;
    const cb_before = bankingInfo.complianceBalance;
    const updatedInfo = await mockApiService.applyBanked(
      Math.abs(bankingInfo.complianceBalance)
    );
    const applied = updatedInfo.complianceBalance - cb_before;
    setBankingInfo(updatedInfo);
    setHistory((prev) => [
      ...prev,
      {
        action: "Applied Banked",
        cb_before,
        applied,
        cb_after: updatedInfo.complianceBalance,
      },
    ]);
    showFeedback(
      `Applied ${applied.toLocaleString()} from banked surplus.`,
      "success"
    );
  };

  const formatNumber = (num: number) => {
    const color =
      num > 0 ? "text-green-400" : num < 0 ? "text-red-400" : "text-gray-300";
    return (
      <span className={`font-bold text-2xl ${color}`}>
        {num.toLocaleString()} gCO₂e
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="bg-navy-800 border-navy-700 rounded-md p-2"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-md ${
            feedback.type === "success"
              ? "bg-green-900/50 text-green-300"
              : "bg-red-900/50 text-red-300"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {isLoading ? (
        <p>Loading banking information...</p>
      ) : (
        bankingInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Compliance Balance (CB)">
              {formatNumber(bankingInfo.complianceBalance)}
              <p className="text-sm text-gray-400 mt-2">
                {bankingInfo.complianceBalance > 0
                  ? "Surplus available to be banked."
                  : "Deficit needs to be covered."}
              </p>
            </Card>
            <Card title="Banked Surplus">
              {formatNumber(bankingInfo.bankedSurplus)}
              <p className="text-sm text-gray-400 mt-2">
                Total banked surplus from previous periods.
              </p>
            </Card>
            <Card title="Actions">
              <div className="flex flex-col space-y-4">
                <Button
                  onClick={handleBankSurplus}
                  disabled={bankingInfo.complianceBalance <= 0}
                >
                  Bank Surplus
                </Button>
                <Button
                  onClick={handleApplyBanked}
                  disabled={
                    bankingInfo.bankedSurplus <= 0 ||
                    bankingInfo.complianceBalance >= 0
                  }
                  variant="secondary"
                >
                  Apply Banked Surplus
                </Button>
              </div>
            </Card>
          </div>
        )
      )}

      {history.length > 0 && (
        <Card title="Transaction History">
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index} className="p-3 bg-navy-800 rounded-md text-sm">
                <span className="font-semibold text-cyan-400">
                  {item.action}:
                </span>{" "}
                CB went from{" "}
                <span className="font-mono">
                  {item.cb_before.toLocaleString()}
                </span>{" "}
                to{" "}
                <span className="font-mono">
                  {item.cb_after.toLocaleString()}
                </span>{" "}
                (change of{" "}
                <span className="font-mono">
                  {item.applied.toLocaleString()}
                </span>
                ).
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default BankingView;
