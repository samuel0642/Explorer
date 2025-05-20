// @ts-nocheck
import { Box, Skeleton, Chip, Alert } from "@mui/material";
import Table from "../components/Table";
import React, { useMemo, useState } from "react";
import { ITableColumn } from "../types";
import { TransactionData } from "../types";
import {
  DefinedQueryObserverResult,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { StyledBodyTableTypography } from "../styled/typography.styled";
import { useRouter } from "next/router";
import { format, formatDistanceToNow } from "date-fns";
import { fetchTransactions } from "../constants/api-routes";

interface ITransactionsTableProps<T> {
  data?: Array<T>;
  useQueryProps?: UseQueryResult;
  loadMoreRows?: ({ startIndex, stopIndex }) => Promise<void>;
  isRowLoaded?: ({ index }) => void;
  rowCount?: number;
  minHeight?: string;
}

export default function TransactionsTable(
  props: ITransactionsTableProps<TransactionData>
) {
  const {
    data: propsData,
    useQueryProps,
    minHeight,
  } = props;
  const [fetchError, setFetchError] = useState(null);

  // Fetch transactions if not provided through props
  const { data: fetchedTransactions, isLoading, isRefetching, isFetching, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        console.log("TransactionsTable: Fetching transactions...");
        const transactions = await fetchTransactions();
        console.log("TransactionsTable: Fetched transactions:", transactions);
        return transactions;
      } catch (err) {
        console.error("TransactionsTable: Error fetching transactions:", err);
        setFetchError(err.message || "Failed to fetch transactions");
        return [];
      }
    },
    enabled: !propsData,
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const data = propsData || fetchedTransactions || [];
  
  const router = useRouter();
  const isTableLoading = isLoading || isRefetching || isFetching || (useQueryProps
    ? useQueryProps.isRefetching ||
      useQueryProps.isFetching ||
      useQueryProps.isLoading
    : false);
  const rowData = Array.isArray(data) && data.length > 0 ? data : [];

  const columns: Array<ITableColumn<TransactionData>> = useMemo(
    () => [
      {
        dataKey: "hash",
        label: "Transaction Hash",
        style: {},
        width: 45,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <StyledBodyTableTypography 
              fontWeight="400"
              sx={{ 
                cursor: "pointer",
                '&:hover': { 
                  textDecoration: 'underline',
                  color: 'primary.main'
                }
              }}
              onClick={() => router.push(`/transactions/${item.hash}`)}
            >
              {item.hash ? item.hash.substring(0, 20) + '...' : 'No hash available'}
            </StyledBodyTableTypography>
          ),
      },
      {
        dataKey: "blockWave",
        label: "Wave",
        style: {},
        width: 10,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip 
              label={item.blockWave || "N/A"} 
              size="small"
              color="primary"
              sx={{ fontWeight: "bold" }}
            />
          ),
      },
      {
        dataKey: "timestamp",
        label: "Time",
        style: {},
        width: 20,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <StyledBodyTableTypography fontWeight="400">
              {item.timestamp ? format(new Date(item.timestamp), "MM/dd/yyyy HH:mm") : "N/A"}
            </StyledBodyTableTypography>
          ),
      },
      {
        dataKey: "from",
        label: "From",
        style: {},
        width: 15,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip
              label={item.from ? item.from.substring(0, 12) + '...' : "N/A"}
              size="small"
              variant="outlined"
              color="secondary"
            />
          ),
      },
      {
        dataKey: "to",
        label: "To",
        style: {},
        width: 15,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip
              label={item.to ? item.to.substring(0, 12) + '...' : "N/A"} 
              size="small"
              variant="outlined"
              color="info"
            />
          ),
      },
      {
        dataKey: "value",
        label: "Value",
        style: {},
        width: 10,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <StyledBodyTableTypography fontWeight="bold">
              {typeof item.value === 'number' ? item.value.toLocaleString() : 'N/A'}
            </StyledBodyTableTypography>
          ),
      },
    ],
    [data, isTableLoading, router]
  );

  const handleRowClick = (index) => {
    const tx = data[index];
    if (tx?.hash) {
      router.push(`/transactions/${tx.hash}`);
    }
  };

  if (fetchError && rowData.length === 0) {
    return (
      <Box width="100%" sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading transactions: {fetchError}
        </Alert>
        <Box flexGrow={1}>
          <Table
            router={router}
            minHeight={minHeight}
            isLoadingTableData={true}
            data={[]}
            rowCount={0}
            rowGetter={({ index }) => ({})}
            columns={columns}
            onRowClick={() => {}}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box width="100%" sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      {fetchError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Warning: {fetchError}
        </Alert>
      )}
      {rowData.length === 0 && !isTableLoading && !fetchError && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No transactions available.
        </Alert>
      )}
      <Box flexGrow={1}>
        <Table
          router={router}
          minHeight={minHeight}
          isLoadingTableData={isTableLoading}
          data={rowData}
          rowCount={data?.length ?? 0}
          rowGetter={({ index }) => data[index]}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
}
