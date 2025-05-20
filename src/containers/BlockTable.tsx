// @ts-nocheck
import { Box, Paper, Skeleton, Chip, Alert } from "@mui/material";
import Table from "../components/Table";
import React, { useMemo, useEffect, useState } from "react";
import { BlockData, ITableColumn } from "../types";
import {
  DefinedQueryObserverResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { StyledBodyTableTypography } from "../styled/typography.styled";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { fetchBlocks } from "../constants/api-routes";
import { useQuery } from "@tanstack/react-query";

interface IBlockTableProps<T> {
  data?: Array<T>;
  useQueryProps?: UseQueryResult;
  loadMoreRows?: ({ startIndex, stopIndex }) => Promise<void>;
  isRowLoaded?: ({ index }) => void;
  rowCount?: number;
}

export default function BlockTable(props: IBlockTableProps<BlockData>) {
  const router = useRouter();
  const { data: propsData, useQueryProps } = props;
  const [fetchError, setFetchError] = useState(null);
  
  // Fetch blocks if not provided through props
  const { data: fetchedBlocks, isLoading, isRefetching, isFetching, error } = useQuery({
    queryKey: ["blocks"],
    queryFn: async () => {
      try {
        console.log("BlockTable: Fetching blocks...");
        const blocks = await fetchBlocks();
        console.log("BlockTable: Fetched blocks:", blocks);
        return blocks;
      } catch (err) {
        console.error("BlockTable: Error fetching blocks:", err);
        setFetchError(err.message || "Failed to fetch blocks");
        return [];
      }
    },
    enabled: !propsData,
    refetchInterval: 2000, // Refresh every 2 seconds
    retry: 3,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (error) {
      console.error("BlockTable: Error in useQuery:", error);
      setFetchError(error.message || "Failed to fetch blocks");
    }
  }, [error]);
  
  // Debug logging
  useEffect(() => {
    console.log("BlockTable: Current data update:", {
      propsData: propsData ? `${propsData.length} blocks` : "none",
      fetchedBlocks: fetchedBlocks ? `${fetchedBlocks.length} blocks` : "none",
      isLoading,
      isRefetching,
      isFetching,
      error: error ? error.message : "none",
      fetchError
    });
  }, [propsData, fetchedBlocks, isLoading, isRefetching, isFetching, error, fetchError]);
  
  const data = propsData || fetchedBlocks || [];
  const rowData = Array.isArray(data) ? data : [];
  const isTableLoading = isLoading || (useQueryProps
    ? useQueryProps.isLoading
    : false);
    
  const columns: Array<ITableColumn<BlockData>> = useMemo(
    () => [
      {
        dataKey: "wave",
        label: "Wave",
        style: {},
        width: 15,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip 
              label={item?.wave || 0}
              color="primary"
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          ),
      },
      {
        dataKey: "hash",
        label: "Hash",
        style: {},
        width: 35,
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
              onClick={() => item?.hash && router.push(`/blocks/${item.hash}`)}
            >
              {item?.hash ? (item.hash.substring(0, 12) + '...') : 'N/A'}
            </StyledBodyTableTypography>
          ),
      },
      {
        dataKey: "validator",
        label: "Validator",
        style: {},
        width: 20,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip 
              label={item?.validator || "Unknown"} 
              size="small" 
              variant="outlined"
              color="secondary"
            />
          ),
      },
      {
        dataKey: "timestamp",
        label: "Time",
        style: {},
        width: 25,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <StyledBodyTableTypography fontWeight="400">
              {item?.timestamp ? format(new Date(item.timestamp), "MM/dd/yyyy HH:mm:ss") : 'N/A'}
            </StyledBodyTableTypography>
          ),
      },
      {
        dataKey: "height",
        label: "Height",
        style: {},
        width: 10,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <StyledBodyTableTypography fontWeight="400" variant="body2">
              {typeof item?.height === 'number' ? item.height : 0}
            </StyledBodyTableTypography>
          ),
      },
      {
        dataKey: "round",
        label: "Round",
        style: {},
        width: 10,
        render: (item) =>
          isTableLoading ? (
            <Skeleton variant="text" />
          ) : (
            <StyledBodyTableTypography fontWeight="400" variant="body2">
              {typeof item?.round === 'number' ? item.round : 0}
            </StyledBodyTableTypography>
          ),
      },
    ],
    [isTableLoading, router]
  );

  const handleRowClick = (index) => {
    const block = rowData[index];
    if (block?.hash) {
      router.push(`/blocks/${block.hash}`);
    }
  };

  if (fetchError && rowData.length === 0) {
    return (
      <Box width="100%" sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading blocks: {fetchError}
        </Alert>
        <Box flexGrow={1}>
          <Table
            router={router}
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
          No blocks available.
        </Alert>
      )}
      <Box flexGrow={1}>
        <Table
          router={router}
          isLoadingTableData={isTableLoading}
          data={rowData}
          rowCount={rowData.length}
          rowGetter={({ index }) => rowData[index] || {}}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
}
