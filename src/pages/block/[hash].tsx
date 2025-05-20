import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  TypographyProps,
  styled,
} from "@mui/material";
import {
  ContentCopyRounded,
  InfoOutlined,
  LaunchRounded,
} from "@mui/icons-material";
import TransactionsTable from "../../containers/TransactionsTable";
import { BlockData } from "../../types";
import {
  fetchBlockByHash,
  fetchInputsByTransactionHash,
  fetchOutputsByTransactionHash,
  fetchTransactionsDetailsFromIds,
} from "../../constants/api-routes";
import { GetServerSideProps } from "next";
import { parseTransactionIdsInBlockData } from "../../utility/parse";
import moment from "moment";
import { TOOLTIP_DESCRIPTIONS } from "../../constants/text";
import PageHead from "../../components/PageHead";
import { format, formatDistanceToNow } from "date-fns";
import {
  StyledCopyContentIcon,
  StyledInformationOutlinedIcon,
} from "../../styled/icon";
import { cardHeaderProps, listItemTextPrimaryProps, listItemTextSecondaryProps } from "../../constants/props";

interface IBlockPage {
  block: BlockData;
}

export default function BlockPage({ block }: IBlockPage) {
  return (
    <Container maxWidth="xl" sx={{ paddingTop: "78px", paddingBottom: "20px" }}>
      <PageHead
        title="Zcash Block Explorer - Blockchain Block"
        description="View block information."
        content="View block details and data."
      />
      <Box
        sx={{
          pt: 3,

          height: "100%",
        }}
      >
        <Stack spacing={4}>
          <div>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="text.primary"
              sx={{ pb: 2, pt: 0.5 }}
            >
              {/* @ts-ignore */}
              Block #{block["height"]} mined (
              {formatDistanceToNow(Number(block["timestamp"]) * 1000, {
                addSuffix: true,
              })}
              ) on {format(Number(block["timestamp"]) * 1000, "MMMM d, yyyy")}
            </Typography>

            <Stack
              py={2}
              spacing={3}
              direction="row"
              alignItems="flex-start"
              width="100%"
              sx={{ height: "auto" }}
            >
              <Card
              elevation={0}
                sx={{
                  height: "260px",
                  bgcolor: "#FFF",
                  borderRadius: 2,
                  width: "100%",
                }}
                variant="elevation"
              >
                <CardContent>
                  <Typography {...cardHeaderProps}>Block Data</Typography>

                  <Grid direction="column" container spacing={2}>
                    <Grid item>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography {...listItemTextPrimaryProps}>
                          Hash
                        </Typography>

                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          title={TOOLTIP_DESCRIPTIONS.block_hash}
                        >
                          <StyledInformationOutlinedIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </Tooltip>

                        <IconButton size="small">
                          <StyledCopyContentIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </IconButton>
                      </Stack>

                      <Typography {...listItemTextSecondaryProps}>
                        {block["hash"] ?? "-"}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography {...listItemTextPrimaryProps}>
                          Mined on (UTC)
                        </Typography>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          title={TOOLTIP_DESCRIPTIONS.block_timestamp}
                        >
                          <StyledInformationOutlinedIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </Tooltip>
                        <IconButton size="small">
                          <StyledCopyContentIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </IconButton>
                      </Stack>
                      <Typography {...listItemTextSecondaryProps}>
                        {moment
                          .utc(Number(block["timestamp"]) * 1000)
                          .format("YYYY-MM-DD | HH:mm:ss") ?? "-"}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography {...listItemTextPrimaryProps}>
                          Height
                        </Typography>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          title={TOOLTIP_DESCRIPTIONS.block_height}
                        >
                          <StyledInformationOutlinedIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </Tooltip>

                        <IconButton size="small">
                          <StyledCopyContentIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </IconButton>
                      </Stack>
                      <Typography {...listItemTextSecondaryProps}>
                        {block["height"] ?? "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card
                      elevation={0}
                sx={{
                  height: "260px",
                  bgcolor: "#FFF",
                  borderRadius: 2,
                  width: "100%",
                }}
                variant="elevation"
              >
                <CardContent>
                  <Typography {...cardHeaderProps}>Economic Details</Typography>

                  <Grid direction="column" container spacing={2}>
                    <Grid item>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography {...listItemTextPrimaryProps}>
                          Transaction Count
                        </Typography>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          title={TOOLTIP_DESCRIPTIONS.block_num_transactions}
                        >
                          <StyledInformationOutlinedIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </Tooltip>
                        <IconButton size="small">
                          <StyledCopyContentIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </IconButton>
                      </Stack>
                      <Typography {...listItemTextSecondaryProps}>
                        {block["num_transactions"] ?? "-"}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography {...listItemTextPrimaryProps}>
                          Total Block Output ({block["num_outputs"] ?? "-"}{" "}
                          Outputs)
                        </Typography>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          title={TOOLTIP_DESCRIPTIONS.block_total_block_output}
                        >
                          <StyledInformationOutlinedIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </Tooltip>
                        <IconButton size="small">
                          <StyledCopyContentIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </IconButton>
                      </Stack>

                      <Typography {...listItemTextSecondaryProps} sx={{}}>
                        {block["total_block_output"] ?? "-"} ZEC
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography {...listItemTextPrimaryProps}>
                          Total Block Input ({block["num_inputs"] ?? "-"}{" "}
                          Inputs)
                        </Typography>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          title={TOOLTIP_DESCRIPTIONS.block_total_block_input}
                        >
                          <StyledInformationOutlinedIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </Tooltip>
                        <IconButton size="small">
                          <StyledCopyContentIcon
                            fontSize="small"
                            sx={{
                              width: 16,
                              height: 16,
                              color: "text.secondary",
                            }}
                          />
                        </IconButton>
                      </Stack>

                      <Typography color="text.primary">
                        <Typography {...listItemTextSecondaryProps}>
                          {block["total_block_input"] ?? "-"} ZEC
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>

            <Card
              elevation={0}
              sx={{
                bgcolor: "#FFF",
                borderRadius: 2,
              }}
              variant="elevation"
            >
              <CardContent>
                <Typography {...cardHeaderProps}>Technical Details</Typography>

                <Grid direction="row" container spacing={5}>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography {...listItemTextPrimaryProps}>
                        Difficulty
                      </Typography>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={TOOLTIP_DESCRIPTIONS.block_difficulty}
                      >
                        <StyledInformationOutlinedIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </Tooltip>
                      <IconButton size="small">
                        <StyledCopyContentIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </IconButton>
                    </Stack>
                    <Typography
                      color="text.primary"
                      {...listItemTextSecondaryProps}
                    >
                      {block["difficulty"] ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography {...listItemTextPrimaryProps}>
                        Size
                      </Typography>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={TOOLTIP_DESCRIPTIONS.block_size}
                      >
                        <StyledInformationOutlinedIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </Tooltip>
                      <IconButton size="small">
                        <StyledCopyContentIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </IconButton>
                    </Stack>
                    <Typography
                      color="text.primary"
                      {...listItemTextSecondaryProps}
                    >
                      {block["size"] ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography {...listItemTextPrimaryProps}>
                        Version
                      </Typography>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={TOOLTIP_DESCRIPTIONS.block_version}
                      >
                        <StyledInformationOutlinedIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </Tooltip>
                      <IconButton size="small">
                        <StyledCopyContentIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </IconButton>
                    </Stack>
                    <Typography
                      color="text.primary"
                      {...listItemTextSecondaryProps}
                    >
                      {block["version"] ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography {...listItemTextPrimaryProps}>
                        Chainwork
                      </Typography>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={TOOLTIP_DESCRIPTIONS.block_chainwork}
                      >
                        <StyledInformationOutlinedIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </Tooltip>
                      <IconButton size="small">
                        <StyledCopyContentIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </IconButton>
                    </Stack>
                    <Typography
                      color="text.primary"
                      {...listItemTextSecondaryProps}
                    >
                      {block["chainwork"] ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography {...listItemTextPrimaryProps}>
                        Bits
                      </Typography>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={TOOLTIP_DESCRIPTIONS.block_bits}
                      >
                        <StyledInformationOutlinedIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </Tooltip>
                      <IconButton size="small">
                        <StyledCopyContentIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </IconButton>
                    </Stack>
                    <Typography
                      color="text.primary"
                      {...listItemTextSecondaryProps}
                    >
                      {block["bits"] ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography {...listItemTextPrimaryProps}>
                        Merkle Root
                      </Typography>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={TOOLTIP_DESCRIPTIONS.block_merkle_root}
                      >
                        <StyledInformationOutlinedIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </Tooltip>
                      <IconButton size="small">
                        <StyledCopyContentIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </IconButton>
                    </Stack>
                    <Typography
                      color="text.primary"
                      {...listItemTextSecondaryProps}
                    >
                      {block["merkle_root"] ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography {...listItemTextPrimaryProps}>
                        Raw Timestamp
                      </Typography>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={TOOLTIP_DESCRIPTIONS.block_timestamp}
                      >
                        <StyledInformationOutlinedIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </Tooltip>
                      <IconButton size="small">
                        <StyledCopyContentIcon
                          fontSize="small"
                          sx={{
                            width: 16,
                            height: 16,
                            color: "text.secondary",
                          }}
                        />
                      </IconButton>
                    </Stack>
                    <Typography
                      color="text.primary"
                      {...listItemTextSecondaryProps}
                    >
                      {block["timestamp"] ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Button
                      size="small"
                      variant="outlined"
                      endIcon={<LaunchRounded />}
                    >
                      Export raw JSON
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>

          <div>
            <Typography variant="h6" {...cardHeaderProps}>
              Transactions
            </Typography>

            <TransactionsTable
              minHeight="300px"
              data={block["transactions"] ?? []}
              loadMoreRows={async ({ startIndex, stopIndex }) => {}}
              rowCount={block["transactions"]?.length ?? 0}
              isRowLoaded={({ index }) => false}
            />
          </div>
        </Stack>
      </Box>
    </Container>
  );
}

export const getServerSideProps = (async (context) => {
  try {
    const { hash } = context.params;

    if (!hash) {
      throw new Error(`Invalid hash found while navigating`);
    }

    const block = JSON.parse(await fetchBlockByHash(String(hash)));

    const transaction_ids = parseTransactionIdsInBlockData(
      String(block["transaction_ids"])
    );
    const transactions = await fetchTransactionsDetailsFromIds(transaction_ids);

    let outputs = [];
    let inputs = [];

    for (const id of transaction_ids) {
      outputs = outputs.concat(await fetchOutputsByTransactionHash(id));
      inputs = inputs.concat(await fetchInputsByTransactionHash(id));
    }

    return {
      props: {
        block: {
          ...block,
          transactions,
          inputs,
          outputs,
          confirmations: 0,
        },
      },
    };
  } catch (error) {
    console.log(
      `Error emitted in block/[hash].tsx (getServerSideProps): `,
      error
    );
    return {
      props: {
        block: {},
      },
    };
  }
}) satisfies GetServerSideProps<{
  block: BlockData;
}>;
