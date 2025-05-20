import { AxiosError } from "axios";

type HookError = Error | AxiosError

interface PaginationParameters {
  page: number;
  limit: number;
  isReverseOrder: boolean;
}

interface ITableColumn<T> {
  dataKey: keyof T; // The key in the row object
  label: string; // The column label/header
  width: string;
  style: any;
  render: (item: T) => React.ReactNode; // A function to render the cell content
}

interface ITableProps<T> {
  data: T[]; // The array of row objects
  columns: Array<ITableColumn<T>>; // The configuration for each column
}

type BlockData = {
  hash: string;
  height: number;
  wave: number;
  round: number;
  validator: string;
  timestamp: string;
  txCount: number;
  parentHash?: string;
  stateRoot?: string;
  transactions?: Array<TransactionData>;
};

type TransactionData = {
  hash: string;
  from: string;
  to: string;
  value: number;
  nonce: number;
  gasLimit: number;
  gasPrice: number;
  timestamp: string;
  blockHash?: string;
  blockWave?: number;
  blockRound?: number;
};

type NodeStatus = {
  nodeID: string;
  currentWave: number;
  validators: string[];
  status: string;
};

type DAGStats = {
  totalBlocks: number;
  validatorBlocks: Record<string, number>;
};

type ConsensusWave = {
  currentWave: number;
  waveStatus: string;
};

type Validators = {
  count: number;
  validators: string[];
};

export { 
  type PaginationParameters, 
  type HookError, 
  type TransactionData, 
  type BlockData, 
  type ITableColumn, 
  type ITableProps,
  type NodeStatus,
  type DAGStats,
  type ConsensusWave,
  type Validators
};
