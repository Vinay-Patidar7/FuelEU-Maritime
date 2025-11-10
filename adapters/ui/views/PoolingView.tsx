import React, { useState, useEffect, useMemo } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { PoolMember } from "../../../core/domain/types";
import { mockApiService } from "../../infrastructure/mockApi";

const PoolingView: React.FC = () => {
  const [potentialMembers, setPotentialMembers] = useState<PoolMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<PoolMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [poolResult, setPoolResult] = useState<{
    success: boolean;
    pool?: PoolMember[];
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      const data = await mockApiService.getAdjustedCbForPooling(2025);
      setPotentialMembers(data);
      setIsLoading(false);
    };
    fetchMembers();
  }, []);

  const handleToggleMember = (member: PoolMember) => {
    setPoolResult(null); // Reset result on change
    setSelectedMembers((prev) =>
      prev.some((m) => m.shipId === member.shipId)
        ? prev.filter((m) => m.shipId !== member.shipId)
        : [...prev, member]
    );
  };

  const handleCreatePool = async () => {
    if (selectedMembers.length < 2) {
      setPoolResult({
        success: false,
        message: "Select at least two members for a pool.",
      });
      return;
    }
    const result = await mockApiService.createPool(selectedMembers);
    setPoolResult(result);
  };

  const poolSum = useMemo(() => {
    return selectedMembers.reduce((sum, member) => sum + member.cb_before, 0);
  }, [selectedMembers]);

  const isPoolValid = poolSum >= 0;

  const formatNumber = (num: number, withSign = false) => {
    const color =
      num > 0 ? "text-green-400" : num < 0 ? "text-red-400" : "text-gray-300";
    const sign = withSign && num > 0 ? "+" : "";
    return (
      <span className={color}>
        {sign}
        {num.toLocaleString()}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Available Ships for Pooling">
          {isLoading ? (
            <p>Loading ships...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {potentialMembers.map((member) => (
                <div
                  key={member.shipId}
                  className={`p-4 rounded-md cursor-pointer border-2 transition-all ${
                    selectedMembers.some((m) => m.shipId === member.shipId)
                      ? "bg-cyan-900/50 border-cyan-500"
                      : "bg-navy-800 border-navy-700 hover:border-navy-600"
                  }`}
                  onClick={() => handleToggleMember(member)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{member.shipId}</span>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        Compliance Balance
                      </div>
                      <div className="font-semibold text-lg">
                        {formatNumber(member.cb_before)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        {poolResult && (
          <Card title="Pool Creation Result">
            <p
              className={`${
                poolResult.success ? "text-green-400" : "text-red-400"
              }`}
            >
              {poolResult.message}
            </p>
            {poolResult.success && poolResult.pool && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Final Balances:</h4>
                {poolResult.pool.map((member) => (
                  <div
                    key={member.shipId}
                    className="flex justify-between p-2 bg-navy-800 rounded"
                  >
                    <span>{member.shipId}</span>
                    <div>
                      <span className="text-gray-400 text-sm">Before: </span>
                      {formatNumber(member.cb_before)}
                      <span className="text-gray-400 mx-2">→</span>
                      <span className="text-gray-400 text-sm">After: </span>
                      {formatNumber(member.cb_after!)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="lg:col-span-1">
        <Card title="Pool Summary">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">
              Selected Members ({selectedMembers.length})
            </h4>
            {selectedMembers.length > 0 ? (
              <ul className="space-y-2">
                {selectedMembers.map((m) => (
                  <li
                    key={m.shipId}
                    className="flex justify-between items-center bg-navy-800 p-2 rounded-md"
                  >
                    <span>{m.shipId}</span>
                    <span>{formatNumber(m.cb_before)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">
                Select ships from the list to form a pool.
              </p>
            )}

            <hr className="border-navy-700" />

            <div>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-bold">Pool Sum</span>
                <span
                  className={`text-2xl font-bold ${
                    isPoolValid ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {poolSum.toLocaleString()}
                </span>
              </div>
              <div
                className={`mt-2 text-sm text-center p-2 rounded-md ${
                  isPoolValid
                    ? "bg-green-900/50 text-green-300"
                    : "bg-red-900/50 text-red-300"
                }`}
              >
                {isPoolValid
                  ? "Pool is valid (Sum ≥ 0)"
                  : "Pool is invalid (Sum < 0)"}
              </div>
            </div>

            <Button
              onClick={handleCreatePool}
              disabled={!isPoolValid || selectedMembers.length < 2}
              className="w-full"
            >
              Create Pool
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PoolingView;
