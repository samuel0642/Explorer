import {
  Stack,
  Typography,
  Button,
  Divider,
  Container,
  CardContent,
  Card,
  Paper,
  Slide,
  Chip,
  Fade,
  useTheme,
  Theme,
  IconButton,
  alpha,
  Grid,
  Box,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BlockTable from "../containers/BlockTable";
import TransactionsTable from "../containers/TransactionsTable";
import { apiRoutes, baseUrl } from "../constants/api-routes";
import { BlockData, TransactionData } from "../types";
import { useRouter } from "next/router";

import { Noto_Sans } from "next/font/google";
import useBlockchainInfo, {
  useTotalBlockCount,
  useTotalTransactionCount,
  useNodeStatus,
  useDagStats,
  useConsensusWave,
  useValidators
} from "../hooks/queries/useBlockchainInfo";
import queryString from "query-string";
import TransactionHistoryGraph from "../containers/TransactionHistoryGraph";
import PageHead from "../components/PageHead";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
import { format, subDays } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import moment from "moment";
import { Refresh, TrendingDown, TrendingUp } from "@mui/icons-material";
import { SiBitcoin, SiZcash } from "react-icons/si";
import { isNegative } from "../constants/numbers";
import { scheduler } from "timers/promises";
import { COLOR_BITCOIN_GOLD } from "../constants/color";
import Image from "next/image";
import { StyledOutlinedIconButton } from "../styled/button.styled";
import {
  usePaginatedBlocks,
  usePaginatedTransactions,
} from "../hooks/queries/usePagination";

const CHIP_BACKGROUND_GREEN = "#DCEDC8";
const CHIP_TEXT_COLOR_GREEN = "rgb(119, 160, 131)";
const CHIP_TEXT_COLOR_RED = "red";

const CHIP_BACKGROUND_RED = "rgb(242, 225, 232)";

const get24HrVolumeChipTextColor = (value: number | string) => {
  if (isNegative(value)) {
    return CHIP_TEXT_COLOR_RED;
  }

  return CHIP_TEXT_COLOR_GREEN;
};

const get24HrVolumeChipBackgroundColor = (value: number | string) => {
  if (isNegative(value)) {
    return CHIP_BACKGROUND_RED;
  }

  return CHIP_BACKGROUND_GREEN;
};

const getCoinIconByName = (name: string, theme: Theme) => {
  switch (name.toLowerCase()) {
    case "bitcoin":
      return (
        <SiBitcoin
          style={{ width: 20, height: 20, color: COLOR_BITCOIN_GOLD }}
        />
      );
    case "usdc":
      return <img src="/usdc-logo.svg" style={{ width: 20, height: 20 }} />;
    case "zcash":
      return (
        <SiZcash
          style={{ width: 20, height: 20, color: theme.palette.secondary.main }}
        />
      );
    default:
  }
};

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const LIMIT = 10;

interface IHomeProps {
  initialBlocksData: {
    data: Array<BlockData>;
    totalCount: number;
    totalPages: number;
  };

  initialTransactionData: {
    data: Array<TransactionData>;
    totalCount: number;
    totalPages: number;
  };

  transactionMetrics: {
    startTimestamp: string;
    endTimestamp: string;
    data: any[];
  };
  dateQuery: { startTimestamp: string; endTimestamp: string };
  coins: { [key: string]: any };
}

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const { data: blockchainInfo, error: blockchainInfoError, isLoading: blockchainInfoLoading } = useBlockchainInfo();
  const { data: totalTransactionCount, error: txCountError } = useTotalTransactionCount();
  const { data: totalBlockCount, error: blockCountError } = useTotalBlockCount();
  const { data: nodeStatus, error: nodeStatusError, isLoading: nodeStatusLoading } = useNodeStatus();
  const { data: dagStats, error: dagStatsError, isLoading: dagStatsLoading } = useDagStats();
  const { data: consensusWave, error: waveError, isLoading: waveLoading } = useConsensusWave();
  const { data: validators, error: validatorsError, isLoading: validatorsLoading } = useValidators();
  
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    Cookies.set("timezone", timezone, { expires: 7 });
    
    // Collect any API errors
    const errors: string[] = [];
    if (blockchainInfoError) errors.push("Blockchain Info: " + (blockchainInfoError as Error)?.message || "Unknown error");
    if (txCountError) errors.push("Transaction Count: " + (txCountError as Error)?.message || "Unknown error");
    if (blockCountError) errors.push("Block Count: " + (blockCountError as Error)?.message || "Unknown error");
    if (nodeStatusError) errors.push("Node Status: " + (nodeStatusError as Error)?.message || "Unknown error");
    if (dagStatsError) errors.push("DAG Stats: " + (dagStatsError as Error)?.message || "Unknown error");
    if (waveError) errors.push("Wave Info: " + (waveError as Error)?.message || "Unknown error");
    if (validatorsError) errors.push("Validators: " + (validatorsError as Error)?.message || "Unknown error");
    
    setApiErrors(errors);
  }, [
    blockchainInfoError, 
    txCountError, 
    blockCountError, 
    nodeStatusError, 
    dagStatsError, 
    waveError, 
    validatorsError
  ]);

  return (
    <div
      className={noto.className}
      style={{
        paddingTop: "60px",
        display: "flex",
        backgroundColor: "#FAFAF8",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <PageHead
        title="BlazeDAG Block Explorer"
        description="Explore and search for blocks, transactions and validators."
        content="A block explorer for the BlazeDAG blockchain."
      />

      <Container maxWidth="xl">
        <Stack spacing={4} sx={{ width: "100%", py: 4 }}>
          {apiErrors.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Some API endpoints are not responding:</Typography>
              <ul>
                {apiErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          {/* BlazeDAG Stats Section */}
          <Grid container spacing={3}>
            {/* Node Status Card */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Node Status</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {nodeStatusLoading ? (
                    <Typography>Loading node status...</Typography>
                  ) : nodeStatusError ? (
                    <Typography color="error">Error loading node status</Typography>
                  ) : (
                    <>
                      <Typography>Node ID: <strong>{nodeStatus?.nodeID || "Unknown"}</strong></Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography sx={{ mr: 1 }}>Status:</Typography>
                        <Chip 
                          label={nodeStatus?.status || "Unknown"} 
                          color={nodeStatus?.status === "running" ? "success" : "error"}
                          size="small"
                        />
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Wave Info Card */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Wave Info</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {waveLoading ? (
                    <Typography>Loading wave info...</Typography>
                  ) : waveError ? (
                    <Typography color="error">Error loading wave info</Typography>
                  ) : (
                    <>
                      <Typography>Current Wave: <strong>{consensusWave?.currentWave || 0}</strong></Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography sx={{ mr: 1 }}>Wave Status:</Typography>
                        <Chip 
                          label={consensusWave?.waveStatus || "Unknown"} 
                          color={consensusWave?.waveStatus === "proposing" ? "primary" : 
                                consensusWave?.waveStatus === "finalized" ? "success" : "warning"}
                          size="small"
                        />
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* DAG Stats Card */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>DAG Stats</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {dagStatsLoading ? (
                    <Typography>Loading DAG stats...</Typography>
                  ) : dagStatsError ? (
                    <Typography color="error">Error loading DAG stats</Typography>
                  ) : (
                    <>
                      <Typography>Total Blocks: <strong>{dagStats?.totalBlocks || 0}</strong></Typography>
                      <Box sx={{ mt: 1 }}>
                        {dagStats?.validatorBlocks && Object.entries(dagStats.validatorBlocks).length > 0 ? (
                          Object.entries(dagStats.validatorBlocks).map(([validator, count]) => (
                            <Typography key={validator}>
                              {validator}: <strong>{count}</strong> blocks
                            </Typography>
                          ))
                        ) : (
                          <Typography>No validator block data available</Typography>
                        )}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Validators Card */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Validators</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {validatorsLoading ? (
                    <Typography>Loading validators...</Typography>
                  ) : validatorsError ? (
                    <Typography color="error">Error loading validators</Typography>
                  ) : (
                    <>
                      <Typography>Count: <strong>{validators?.count || 0}</strong></Typography>
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {validators?.validators?.length > 0 ? (
                          validators.validators.map((validator, index) => (
                            <Chip 
                              key={index}
                              label={validator} 
                              color={validator === nodeStatus?.nodeID ? "primary" : "default"}
                              size="small"
                              sx={{ my: 0.5, mr: 0.5 }}
                            />
                          ))
                        ) : (
                          <Typography>No validators available</Typography>
                        )}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Blocks Section */}
          <Paper
            sx={{
              borderRadius: "16px",
              boxShadow: "none",
              bgcolor: "transparent",
            }}
          >
            <Card variant="outlined" sx={{ borderRadius: "16px" }}>
              <CardContent sx={{ px: 2, py: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "700" }}
                  >
                    Recent Blocks
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="text"
                      onClick={() => router.push("/blocks")}
                      size="small"
                    >
                      View All
                    </Button>
                  </Stack>
                </Stack>

                <Box sx={{ py: 1 }}>
                  <BlockTable />
                </Box>
              </CardContent>
            </Card>
          </Paper>

          {/* Recent Transactions Section */}
          <Paper
            sx={{
              borderRadius: "16px",
              boxShadow: "none",
              bgcolor: "transparent",
            }}
          >
            <Card variant="outlined" sx={{ borderRadius: "16px" }}>
              <CardContent sx={{ px: 2, py: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "700" }}
                  >
                    Recent Transactions
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="text"
                      onClick={() => router.push("/transactions")}
                      size="small"
                    >
                      View All
                    </Button>
                  </Stack>
                </Stack>

                <Box sx={{ py: 1 }}>
                  <TransactionsTable />
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Stack>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Return empty props since we're fetching data client-side
  return {
    props: {}
  };
}
