import { useQuery } from "@tanstack/react-query";
import {
  fetchBlockCount,
  fetchBlockchainInfo,
  fetchTransactionCount,
  fetchNodeStatus,
  fetchDagStats,
  fetchConsensusWave,
  fetchValidators
} from "../../constants/api-routes";
import { ConsensusWave, DAGStats, NodeStatus, Validators } from "../../types";

// Main blockchain info hook that combines data from multiple endpoints
export default function useBlockchainInfo() {
  return useQuery<any, any, {
    nodeID: string;
    currentWave: number;
    totalBlocks: number;
    validatorBlocks: Record<string, number>;
    waveStatus: string;
    status: string;
  }>({
    queryKey: ["query_blockchain_info_key"],
    queryFn: async () => {
      console.log("useBlockchainInfo: Fetching blockchain info...");
      try {
        const data = await fetchBlockchainInfo();
        console.log("useBlockchainInfo: Received data:", data);
        return data;
      } catch (error) {
        console.error("useBlockchainInfo: Error fetching blockchain info:", error);
        throw error;
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds for more responsive UI
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    initialData: {
      nodeID: "unknown",
      currentWave: 0,
      totalBlocks: 0,
      validatorBlocks: {},
      waveStatus: "unknown",
      status: "unknown"
    }
  });
}

// Transaction count hook
export function useTotalTransactionCount() {
  return useQuery({
    queryKey: ["query_total_transactions_key"],
    queryFn: async () => {
      console.log("useTotalTransactionCount: Fetching transaction count...");
      try {
        const count = await fetchTransactionCount();
        console.log("useTotalTransactionCount: Received count:", count);
        return count;
      } catch (error) {
        console.error("useTotalTransactionCount: Error fetching count:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  });
}

// Block count hook
export function useTotalBlockCount() {
  return useQuery({
    queryKey: ["query_total_blocks_key"],
    queryFn: async () => {
      console.log("useTotalBlockCount: Fetching block count...");
      try {
        const count = await fetchBlockCount();
        console.log("useTotalBlockCount: Received count:", count);
        return count;
      } catch (error) {
        console.error("useTotalBlockCount: Error fetching count:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  });
}

// Node status hook
export function useNodeStatus() {
  return useQuery<NodeStatus>({
    queryKey: ["query_node_status_key"],
    queryFn: async () => {
      console.log("DEBUG useNodeStatus: Starting fetch...");
      try {
        const status = await fetchNodeStatus();
        console.log("DEBUG useNodeStatus: Received status:", status);
        return status;
      } catch (error) {
        console.error("DEBUG useNodeStatus: Error fetching status:", error);
        throw error;
      }
    },
    refetchInterval: 3000, // Refresh more frequently
    retry: 5, // Increase retries
    staleTime: 1000, // Reduce stale time
    cacheTime: 2000, // Reduce cache time
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    initialData: {
      nodeID: "unknown",
      currentWave: 0,
      validators: [],
      status: "unknown"
    }
  });
}

// DAG stats hook
export function useDagStats() {
  return useQuery<DAGStats>({
    queryKey: ["query_dag_stats_key"],
    queryFn: async () => {
      console.log("DEBUG useDagStats: Starting fetch...");
      try {
        const stats = await fetchDagStats();
        console.log("DEBUG useDagStats: Received stats:", stats);
        return stats;
      } catch (error) {
        console.error("DEBUG useDagStats: Error fetching stats:", error);
        throw error;
      }
    },
    refetchInterval: 3000,
    retry: 5,
    staleTime: 1000,
    cacheTime: 2000,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    initialData: {
      totalBlocks: 0,
      validatorBlocks: {}
    }
  });
}

// Consensus wave hook
export function useConsensusWave() {
  return useQuery<ConsensusWave>({
    queryKey: ["query_consensus_wave_key"],
    queryFn: async () => {
      console.log("DEBUG useConsensusWave: Starting fetch...");
      try {
        const wave = await fetchConsensusWave();
        console.log("DEBUG useConsensusWave: Received wave:", wave);
        return wave;
      } catch (error) {
        console.error("DEBUG useConsensusWave: Error fetching wave:", error);
        throw error;
      }
    },
    refetchInterval: 3000,
    retry: 5,
    staleTime: 1000,
    cacheTime: 2000,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    initialData: {
      currentWave: 0,
      waveStatus: "unknown"
    }
  });
}

// Validators hook
export function useValidators() {
  return useQuery<Validators>({
    queryKey: ["query_validators_key"],
    queryFn: async () => {
      console.log("DEBUG useValidators: Starting fetch...");
      try {
        const validators = await fetchValidators();
        console.log("DEBUG useValidators: Received validators:", validators);
        return validators;
      } catch (error) {
        console.error("DEBUG useValidators: Error fetching validators:", error);
        throw error;
      }
    },
    refetchInterval: 3000,
    retry: 5,
    staleTime: 1000,
    cacheTime: 2000,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    initialData: {
      count: 0,
      validators: []
    }
  });
}
