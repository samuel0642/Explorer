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
  Link
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
          const txResponse = await fetch(`/api/transactions?count=100`);
          if (txResponse.ok) {
            const transactions = await txResponse.json();
            const blockTransactions = transactions.filter(
              (tx: TransactionData) => tx.blockHash === hash
            );
            foundBlock.transactions = blockTransactions;
          }
        } catch (txError) {
          console.warn('Could not fetch transactions for block:', txError);
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
              <Typography variant="h6" gutterBottom>
                Transactions ({block.transactions.length})
              </Typography>
              <Divider sx={{ mb: 3 }} />

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
                    {block.transactions.map((tx) => (
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