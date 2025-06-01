// @ts-nocheck
import { Box, Paper, Skeleton, Chip, Alert, Tooltip, LinearProgress, Typography } from "@mui/material";
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
import { useAllBlocksConfirmationStatus } from "../hooks/queries/useBlockchainInfo";
import { CheckCircle, Schedule, HowToVote, Pending, Error as ErrorIcon } from "@mui/icons-material";

interface IBlockTableProps<T> {
  data?: Array<T>;
  useQueryProps?: UseQueryResult;
  loadMoreRows?: ({ startIndex, stopIndex }) => Promise<void>;
  isRowLoaded?: ({ index }) => void;
  rowCount?: number;
}

// Helper function to get confirmation status display
const getConfirmationStatusDisplay = (blockHash: string, allConfirmationData: any) => {
  const blockStatus = allConfirmationData?.blocks?.[blockHash];
  
  if (!blockStatus) {
    return {
      status: "unknown",
      icon: <Pending sx={{ fontSize: 16 }} />,
      color: "default" as const,
      label: "Unknown",
      progress: 0,
      votes: "N/A"
    };
  }
  
  const { status, is_finalized, commit_votes, total_validators } = blockStatus;
  const progress = total_validators > 0 ? (commit_votes / total_validators) * 100 : 0;
  const votes = `${commit_votes}/${total_validators}`;
  
  switch (status) {
    case "finalized":
      return {
        status: "finalized",
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
        color: "success" as const,
        label: "Finalized",
        progress: 100,
        votes
      };
    case "confirming":
      return {
        status: "confirming",
        icon: <HowToVote sx={{ fontSize: 16 }} />,
        color: "info" as const,
        label: "Confirming",
        progress,
        votes
      };
    case "voting":
      return {
        status: "voting",
        icon: <HowToVote sx={{ fontSize: 16 }} />,
        color: "warning" as const,
        label: "Voting",
        progress,
        votes
      };
    case "proposed":
      return {
        status: "proposed",
        icon: <Schedule sx={{ fontSize: 16 }} />,
        color: "default" as const,
        label: "Proposed",
        progress: 0,
        votes: "0/0"
      };
    case "pending":
      return {
        status: "pending",
        icon: <Pending sx={{ fontSize: 16 }} />,
        color: "default" as const,
        label: "Pending",
        progress: 0,
        votes: "0/0"
      };
    default:
      return {
        status: "unknown",
        icon: <ErrorIcon sx={{ fontSize: 16 }} />,
        color: "error" as const,
        label: "Unknown",
        progress: 0,
        votes: "N/A"
      };
  }
};

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

  // Fetch all blocks confirmation status
  const { data: allConfirmationData, isLoading: isLoadingConfirmation, error: confirmationError } = useAllBlocksConfirmationStatus();

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
      allConfirmationData: allConfirmationData ? `${Object.keys(allConfirmationData.blocks || {}).length} confirmations` : "none",
      isLoading,
      isRefetching,
      isFetching,
      isLoadingConfirmation,
      error: error ? error.message : "none",
      confirmationError: confirmationError ? confirmationError.message : "none",
      fetchError
    });
  }, [propsData, fetchedBlocks, allConfirmationData, isLoading, isRefetching, isFetching, isLoadingConfirmation, error, confirmationError, fetchError]);
  
  const data = propsData || fetchedBlocks || [];
  const rowData = Array.isArray(data) ? data : [];
  const isTableLoading = isLoading || (useQueryProps ? useQueryProps.isLoading : false);
    
  const columns: Array<ITableColumn<BlockData>> = useMemo(
    () => [
      {
        dataKey: "wave",
        label: "Wave",
        style: {},
        width: 10,
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
        width: 25,
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
        dataKey: "confirmationStatus",
        label: "Status",
        style: {},
        width: 20,
        render: (item) => {
          if (isTableLoading || isLoadingConfirmation) {
            return <Skeleton variant="text" />;
          }
          
          const blockHash = item?.hash || "";
          const confirmationDisplay = getConfirmationStatusDisplay(blockHash, allConfirmationData);
          
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Tooltip title={`${confirmationDisplay.label} - Votes: ${confirmationDisplay.votes}`}>
                <Chip 
                  icon={confirmationDisplay.icon}
                  label={confirmationDisplay.label}
                  color={confirmationDisplay.color}
                  size="small"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                />
              </Tooltip>
              {confirmationDisplay.status !== "finalized" && confirmationDisplay.progress > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={confirmationDisplay.progress} 
                    sx={{ flexGrow: 1, height: 4, borderRadius: 2 }}
                    color={confirmationDisplay.color}
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', minWidth: 30 }}>
                    {confirmationDisplay.votes}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        },
      },
      {
        dataKey: "validator",
        label: "Validator",
        style: {},
        width: 15,
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
        width: 20,
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
    ],
    [isTableLoading, isLoadingConfirmation, allConfirmationData, router]
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
