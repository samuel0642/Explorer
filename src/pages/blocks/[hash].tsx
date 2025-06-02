import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Breadcrumbs,
  Link,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ArrowBack, ContentCopy } from '@mui/icons-material';
import { format } from 'date-fns';
import { BlockData, TransactionData } from '../../types';
import PageHead from '../../components/PageHead';

const BlockDetail = () => {
  const router = useRouter();
  const { hash } = router.query;
  const [block, setBlock] = useState<BlockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state for transactions
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(50);
  const [displayedTransactions, setDisplayedTransactions] = useState<TransactionData[]>([]);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (!hash) return;

      try {
        setLoading(true);
        setError(null);

        // First try to get the specific block from the blocks endpoint
        const response = await fetch(`/api/blocks?count=100`);
        if (!response.ok) {
          throw new Error(`Failed to fetch blocks: ${response.statusText}`);
        }

        const blocks = await response.json();
        const foundBlock = blocks.find((b: BlockData) => b.hash === hash);

        if (!foundBlock) {
          throw new Error('Block not found');
        }

        // Try to fetch transactions for this block
        try {
          // Fetch more transactions to increase chance of finding transactions for this block
          // Since each block can have up to 40K transactions, we need to fetch enough
          // to cover multiple recent blocks
          const txResponse = await fetch(`/api/transactions?count=5000`);
          if (txResponse.ok) {
            const transactions = await txResponse.json();
            const blockTransactions = transactions.filter(
              (tx: TransactionData) => tx.blockHash === hash
            );
            foundBlock.transactions = blockTransactions;
            console.log(`Found ${blockTransactions.length} transactions for block ${hash}`);
          } else {
            console.warn('Failed to fetch transactions:', txResponse.statusText);
          }
        } catch (txError) {
          console.warn('Could not fetch transactions for block:', txError);
          // Set empty array to show "No transactions found" message instead of hiding the section
          foundBlock.transactions = [];
        }

        setBlock(foundBlock);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockDetails();
  }, [hash]);

  // Update displayed transactions when block or pagination changes
  useEffect(() => {
    if (block?.transactions) {
      const startIndex = (currentPage - 1) * transactionsPerPage;
      const endIndex = startIndex + transactionsPerPage;
      setDisplayedTransactions(block.transactions.slice(startIndex, endIndex));
    }
  }, [block, currentPage, transactionsPerPage]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'PPpp');
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!block) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Block not found</Alert>
      </Container>
    );
  }

  return (
    <div style={{ paddingTop: '60px', backgroundColor: '#FAFAF8', minHeight: '100vh' }}>
      <PageHead
        title={`Block ${block.hash.substring(0, 16)}... - BlazeDAG Explorer`}
        description={`Details for block ${block.hash}`}
        content="Block details on BlazeDAG blockchain"
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs>
            <Link 
              color="inherit" 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
              sx={{ cursor: 'pointer' }}
            >
              Home
            </Link>
            <Typography color="text.primary">Block Details</Typography>
          </Breadcrumbs>
        </Box>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Block Details
          </Typography>
        </Box>

        {/* Block Information Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Block Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Hash
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                      {block.hash}
                    </Typography>
                    <IconButton size="small" onClick={() => copyToClipboard(block.hash)}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Height
                  </Typography>
                  <Typography variant="body1">{block.height}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Wave
                  </Typography>
                  <Chip label={`Wave ${block.wave}`} color="primary" size="small" />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Round
                  </Typography>
                  <Chip label={`Round ${block.round}`} color="secondary" size="small" />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Validator
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {block.validator}
                    </Typography>
                    <IconButton size="small" onClick={() => copyToClipboard(block.validator)}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Timestamp
                  </Typography>
                  <Typography variant="body2">{formatTimestamp(block.timestamp)}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Transaction Count
                  </Typography>
                  <Typography variant="body1">{block.txCount}</Typography>
                </Box>

                {block.parentHash && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Parent Hash
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                        {block.parentHash}
                      </Typography>
                      <IconButton size="small" onClick={() => copyToClipboard(block.parentHash!)}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        {block.transactions && block.transactions.length > 0 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Transactions ({block.transactions.length.toLocaleString()})
                </Typography>
                
                {/* Pagination Controls */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Per Page</InputLabel>
                    <Select
                      value={transactionsPerPage}
                      label="Per Page"
                      onChange={(e) => {
                        setTransactionsPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset to first page
                      }}
                    >
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={500}>500</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 3 }} />

              {/* Performance warning for large transaction sets */}
              {block.transactions.length > 10000 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  This block contains {block.transactions.length.toLocaleString()} transactions. 
                  Use pagination below to browse through them efficiently.
                </Alert>
              )}

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Hash</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="right">Gas Used</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedTransactions.map((tx) => (
                      <TableRow key={tx.hash}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {tx.hash.substring(0, 16)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {tx.from.substring(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {tx.to.substring(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{tx.value}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {(tx.gasLimit * tx.gasPrice).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatTimestamp(tx.timestamp)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {block.transactions.length > transactionsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={Math.ceil(block.transactions.length / transactionsPerPage)}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
              
              {/* Transaction Stats */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {displayedTransactions.length} of {block.transactions.length.toLocaleString()} transactions 
                  (Page {currentPage} of {Math.ceil(block.transactions.length / transactionsPerPage)})
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* No Transactions Message */}
        {(!block.transactions || block.transactions.length === 0) && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transactions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Alert severity="info">No transactions found for this block.</Alert>
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default BlockDetail; 