import { AxiosResponse } from "axios";
import { BlockData, PaginationParameters, TransactionData } from "../types";
import { assertAndManipulateObjectSchema } from "../utility/validate";
import queryString from "query-string";
import { cacheableFetch } from "../utility/cache";

// BlazeDAG API URL - Use Next.js API proxy to avoid CORS
const baseUrl = "/api"; 

const apiRoutes = {
  blocksRoute: "/blocks",
  blockRoute: "/blocks",
  transactionsRoute: "/transactions",
  transactionRoute: "/transactions",
  statusRoute: "/status",
  dagStatsRoute: "/dag/stats",
  consensusWaveRoute: "/consensus/wave",
  validatorsRoute: "/validators",
};

async function fetchPaginatedBlocks(paginationParameters: PaginationParameters): Promise<Array<BlockData>> {
  const { page, limit, isReverseOrder } = paginationParameters

  if (page < 0 || limit < 0 || typeof isReverseOrder != 'boolean') {
    throw new Error('Invalid pagination parameters.');
  }

  try {
    // BlazeDAG API only supports count parameter
    console.log(`Fetching paginated blocks from ${baseUrl}${apiRoutes.blocksRoute}?count=${limit}`);
    const blockDataResponse = await fetch(
      `${baseUrl}${apiRoutes.blocksRoute}?count=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!blockDataResponse.ok) {
      console.error(`Failed to fetch blocks: ${blockDataResponse.status} ${blockDataResponse.statusText}`);
      return [];
    }

    const newBlockData = await blockDataResponse.json();
    console.log("Successfully fetched blocks:", newBlockData.length);
    // BlazeDAG API returns array directly
    return newBlockData;
  } catch (error) {
    console.error("Error fetching paginated blocks:", error);
    return [];
  }
}

async function fetchPaginatedTransactions(paginationParameters: PaginationParameters): Promise<Array<TransactionData>> {
  const { page, limit, isReverseOrder } = paginationParameters

  if (page < 0 || limit < 0 || typeof isReverseOrder != 'boolean') {
    throw new Error('Invalid pagination parameters.');
  }

  try {
    // BlazeDAG API only supports count parameter
    console.log(`Fetching paginated transactions from ${baseUrl}${apiRoutes.transactionsRoute}?count=${limit}`);
    const transactionDataResponse = await fetch(
      `${baseUrl}${apiRoutes.transactionsRoute}?count=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!transactionDataResponse.ok) {
      console.error(`Failed to fetch transactions: ${transactionDataResponse.status} ${transactionDataResponse.statusText}`);
      return [];
    }

    const newTransactionData = await transactionDataResponse.json();
    console.log("Successfully fetched transactions:", newTransactionData.length);
    // BlazeDAG API returns array directly
    return newTransactionData;
  } catch (error) {
    console.error("Error fetching paginated transactions:", error);
    return [];
  }
}

/**
 * Returns an array of all blocks in the blockchain.
 * @returns Array of blocks
 */
async function fetchBlocks(): Promise<Array<BlockData>> {
  try {
    console.log(`FETCH BLOCKS: Fetching blocks from: ${baseUrl}${apiRoutes.blocksRoute}?count=100`);
    
    // Add timestamp to prevent caching
    const timeStamp = new Date().getTime();
    const urlWithNoCache = `${baseUrl}${apiRoutes.blocksRoute}?count=100&_nocache=${timeStamp}`;
    
    const result = await fetch(urlWithNoCache, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!result.ok) {
      console.error(`FETCH BLOCKS: Failed to fetch blocks: ${result.status} ${result.statusText}`);
      return [];
    }
    
    const data = await result.json();
    console.log(`FETCH BLOCKS: Successfully fetched ${data.length} blocks`);
    return data;
  } catch (error) {
    console.error("FETCH BLOCKS: Unhandled error fetchBlocks(): ", error);
    return [];
  }
}

/**
 * Returns an array of all transactions in the blockchain.
 * @returns Array of transactions
 */
async function fetchTransactions(): Promise<Array<TransactionData>> {
  try {
    console.log(`TRANSACTIONS: Fetching transactions from: ${baseUrl}${apiRoutes.transactionsRoute}?count=100`);
    
    // Add timestamp to prevent caching
    const timeStamp = new Date().getTime();
    const urlWithNoCache = `${baseUrl}${apiRoutes.transactionsRoute}?count=100&_nocache=${timeStamp}`;
    
    const result = await fetch(urlWithNoCache, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!result.ok) {
      console.error(`TRANSACTIONS: Failed to fetch transactions: ${result.status} ${result.statusText}`);
      
      // If transactions endpoint fails, generate mock transactions from blocks
      console.log("TRANSACTIONS: Generating mock transactions from blocks");
      
      // Get blocks with cache busting
      const blockTimeStamp = new Date().getTime();
      const blockUrlWithNoCache = `${baseUrl}${apiRoutes.blocksRoute}?count=10&_nocache=${blockTimeStamp}`;
      
      const blocksResponse = await fetch(blockUrlWithNoCache, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (blocksResponse.ok) {
        const blocks = await blocksResponse.json();
        console.log(`TRANSACTIONS: Successfully fetched ${blocks.length} blocks to generate mock transactions`);
        
        // Generate mock transactions based on blocks
        const mockTransactions = blocks.map((block, index) => ({
          hash: `tx_${block.hash.substring(0, 16)}`,
          from: `wallet_${block.validator}_${index}`,
          to: `wallet_receiver_${(index + 1) % 10}`,
          value: Math.floor(Math.random() * 1000),
          nonce: index,
          gasLimit: 21000,
          gasPrice: 1,
          timestamp: block.timestamp,
          blockHash: block.hash,
          blockWave: block.wave,
          blockRound: block.round
        }));
        return mockTransactions;
      }
      
      return [];
    }
    
    const data = await result.json();
    console.log(`TRANSACTIONS: Successfully fetched ${data.length} transactions`);
    return data;
  } catch (error) {
    console.error("TRANSACTIONS: Unhandled error fetchTransactions(): ", error);
    return [];
  }
}

async function fetchTransactionByHash(tx_hash: string): Promise<any> {
  try {
    // BlazeDAG doesn't have a dedicated transaction endpoint yet
    console.log("Fetching transaction by hash:", tx_hash);
    const result = await fetch(
      `${baseUrl}${apiRoutes.transactionsRoute}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!result.ok) {
      console.error(`Failed to fetch transactions: ${result.status} ${result.statusText}`);
      return null;
    }
    
    const transactions = await result.json();
    const transaction = transactions.find(tx => tx.hash === tx_hash) || null;
    console.log(transaction ? "Found transaction by hash" : "Transaction not found");
    return transaction;
  } catch (error) {
    console.error("Unhandled error fetchTransactionByHash(): ", error);
    return null;
  }
}

async function fetchBlockByHash(block_hash: string): Promise<any> {
  try {
    console.log("Fetching block by hash:", block_hash);
    const result = await fetch(
      `${baseUrl}${apiRoutes.blockRoute}/${block_hash}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!result.ok) {
      console.error(`Failed to fetch block: ${result.status} ${result.statusText}`);
      return {};
    }
    
    const data = await result.json();
    console.log("Successfully fetched block:", data.hash);
    return data;
  } catch (error) {
    console.error("Unhandled error fetchBlockByHash(): ", error);
    return {};
  }
}

async function fetchNodeStatus(): Promise<any> {
  try {
    console.log("NODE STATUS: Fetching node status from:", `${baseUrl}${apiRoutes.statusRoute}`);
    
    // Add timestamp to prevent caching
    const timeStamp = new Date().getTime();
    const urlWithNoCache = `${baseUrl}${apiRoutes.statusRoute}?_nocache=${timeStamp}`;
    
    const response = await fetch(urlWithNoCache, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    console.log("NODE STATUS: Response status:", response.status);
    
    if (!response.ok) {
      console.error(`NODE STATUS: Failed to fetch node status: ${response.status} ${response.statusText}`);
      return {
        nodeID: "unknown",
        currentWave: 0,
        validators: [],
        status: "unknown"
      };
    }
    
    const data = await response.json();
    console.log("NODE STATUS: Successfully fetched node status:", data);
    return data;
  } catch (error) {
    console.error("NODE STATUS: Unhandled error fetchNodeStatus(): ", error);
    return {
      nodeID: "unknown",
      currentWave: 0,
      validators: [],
      status: "unknown"
    };
  }
}

async function fetchDagStats(): Promise<any> {
  try {
    console.log("DAG STATS: Fetching DAG stats");
    
    // Add timestamp to prevent caching
    const timeStamp = new Date().getTime();
    const urlWithNoCache = `${baseUrl}${apiRoutes.dagStatsRoute}?_nocache=${timeStamp}`;
    
    const response = await fetch(urlWithNoCache, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      console.error(`DAG STATS: Failed to fetch DAG stats: ${response.status} ${response.statusText}`);
      return {
        totalBlocks: 0,
        validatorBlocks: {}
      };
    }
    
    const data = await response.json();
    console.log("DAG STATS: Successfully fetched DAG stats:", data);
    return data;
  } catch (error) {
    console.error("DAG STATS: Unhandled error fetchDagStats(): ", error);
    return {
      totalBlocks: 0,
      validatorBlocks: {}
    };
  }
}

async function fetchConsensusWave(): Promise<any> {
  try {
    console.log("CONSENSUS WAVE: Fetching consensus wave");
    
    // Add timestamp to prevent caching
    const timeStamp = new Date().getTime();
    const urlWithNoCache = `${baseUrl}${apiRoutes.consensusWaveRoute}?_nocache=${timeStamp}`;
    
    const response = await fetch(urlWithNoCache, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error(`CONSENSUS WAVE: Failed to fetch consensus wave: ${response.status} ${response.statusText}`);
      return {
        currentWave: 0,
        waveStatus: "unknown"
      };
    }
    
    const data = await response.json();
    console.log("CONSENSUS WAVE: Successfully fetched consensus wave:", data);
    return data;
  } catch (error) {
    console.error("CONSENSUS WAVE: Unhandled error fetchConsensusWave(): ", error);
    return {
      currentWave: 0,
      waveStatus: "unknown"
    };
  }
}

async function fetchValidators(): Promise<any> {
  try {
    console.log("VALIDATORS: Fetching validators");
    
    // Add timestamp to prevent caching
    const timeStamp = new Date().getTime();
    const urlWithNoCache = `${baseUrl}${apiRoutes.validatorsRoute}?_nocache=${timeStamp}`;
    
    const response = await fetch(urlWithNoCache, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error(`VALIDATORS: Failed to fetch validators: ${response.status} ${response.statusText}`);
      return {
        count: 0,
        validators: []
      };
    }
    
    const data = await response.json();
    console.log("VALIDATORS: Successfully fetched validators:", data);
    return data;
  } catch (error) {
    console.error("VALIDATORS: Unhandled error fetchValidators(): ", error);
    return {
      count: 0,
      validators: []
    };
  }
}

async function fetchBlockchainInfo() {
  try {
    console.log("Fetching blockchain info");
    let combinedData = {
      nodeID: "unknown",
      currentWave: 0,
      totalBlocks: 0,
      validatorBlocks: {},
      waveStatus: "unknown",
      status: "unknown"
    };

    try {
      // Use the improved node status fetch method
      const status = await fetchNodeStatus();
      combinedData.nodeID = status.nodeID;
      combinedData.currentWave = status.currentWave;
      combinedData.status = status.status;
    } catch (error) {
      console.error("Error fetching node status:", error);
    }

    try {
      // Use the improved DAG stats fetch method
      const dagStats = await fetchDagStats();
      combinedData.totalBlocks = dagStats.totalBlocks;
      combinedData.validatorBlocks = dagStats.validatorBlocks;
    } catch (error) {
      console.error("Error fetching DAG stats:", error);
    }

    try {
      // Use the improved consensus wave fetch method
      const wave = await fetchConsensusWave();
      combinedData.waveStatus = wave.waveStatus;
    } catch (error) {
      console.error("Error fetching consensus wave:", error);
    }
    
    console.log("Combined blockchain info:", combinedData);
    return combinedData;
  } catch (error) {
    console.error("Unhandled error fetchBlockchainInfo(): ", error);
    return {
      nodeID: "unknown",
      currentWave: 0,
      totalBlocks: 0,
      validatorBlocks: {},
      waveStatus: "unknown",
      status: "unknown"
    };
  }
}

async function fetchTransactionCount() {
  try {
    console.log("Fetching transaction count");
    // Use the improved DAG stats fetch method
    const data = await fetchDagStats();
    console.log("Successfully fetched transaction count (using total blocks):", data.totalBlocks);
    // For BlazeDAG, we don't have transaction count directly
    // So we're returning total blocks for now
    return data.totalBlocks || 0;
  } catch (error) {
    console.error("Error fetching transaction count:", error);
    return 0;
  }
}

async function fetchBlockCount() {
  try {
    console.log("Fetching block count");
    // Use the improved DAG stats fetch method
    const data = await fetchDagStats();
    console.log("Successfully fetched block count:", data.totalBlocks);
    return data.totalBlocks || 0;
  } catch (error) {
    console.error("Error fetching block count:", error);
    return 0;
  }
}

export {
  baseUrl,
  apiRoutes,
  fetchBlocks,
  fetchTransactions,
  fetchBlockByHash,
  fetchTransactionByHash,
  fetchPaginatedBlocks,
  fetchPaginatedTransactions,
  fetchBlockchainInfo,
  fetchTransactionCount,
  fetchBlockCount,
  fetchNodeStatus,
  fetchDagStats,
  fetchConsensusWave,
  fetchValidators
};
