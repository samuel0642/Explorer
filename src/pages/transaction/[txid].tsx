import React from "react";
import {
  Box,
  Typography,
  Grid,
  styled,
  Stack,
  Divider,
  Card,
  CardContent,
  Container,
  TypographyProps,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import { TransactionData } from "../../types";
import { GetServerSideProps } from "next";
import {
  fetchInputsByTransactionHash,
  fetchOutputsByTransactionHash,
  fetchTransactionByHash,
} from "../../constants/api-routes";
import { parseTransactionIdsInBlockData } from "../../utility/parse";
import moment from "moment";
import { ContentCopyRounded, InfoOutlined } from "@mui/icons-material";
import { TOOLTIP_DESCRIPTIONS } from "../../constants/text";
import PageHead from "../../components/PageHead";
import { format, formatDistanceToNow } from "date-fns";
import { StyledCopyContentIcon, StyledInformationOutlinedIcon } from "../../styled/icon";
import { cardHeaderProps, listItemTextPrimaryProps, listItemTextSecondaryProps } from "../../constants/props";

const primaryTypographyProps = {
  paddingBottom: 0.5,
};


interface ITransactionPageProps {
  transaction: TransactionData;
  inputs: Array<any>;
  outputs: Array<any>;
}

export default ({ transaction, inputs, outputs }: ITransactionPageProps) => {
  return (
    <Container maxWidth="xl" sx={{ paddingTop: "78px", paddingBottom: "20px" }}>
      <PageHead
        title="Zcash Block Explorer - Blockchain Transaction"
        description="View transaction information."
        content="View transaction details and data."
      />
      <div>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.primary"
          sx={{ pb: 2, pt: 0.5 }}
        >
          {/* @ts-ignore */}
          Transaction mined (
          {formatDistanceToNow(Number(transaction["timestamp"]) * 1000, {
            addSuffix: true,
          })}
          ) on {format(Number(transaction["timestamp"]) * 1000, "MMMM d, yyyy")}
        </Typography>
      </div>
      <Stack spacing={2}>
        <Card
          variant="elevation"
          sx={{
            borderRadius: 2,
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            width: "100%",
            bgcolor: "#fff",
          }}
        >
          <CardContent>
            <Box pb={2.5}>
              <Typography {...cardHeaderProps}>Transaction Details</Typography>
            </Box>

            <Grid direction="row" container spacing={5}>
              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>Height</Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.height}
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
                  {transaction["height"] ?? "-"}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>Hash</Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.hash}
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
                  {...listItemTextSecondaryProps}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    msTextOverflow: "ellipsis",
                    maxWidth: "80%",
                  }}
                >
                  {transaction["hash"] ?? "-"}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>Version</Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.version}
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
                  {transaction["version"] ?? "-"}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>
                    Mined on (UTC)
                  </Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.timestamp}
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
                  {format(
                    Number(transaction["timestamp"]) * 1000,
                    "MMMM d, yyyy"
                  )}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card
          variant="elevation"
          sx={{
            borderRadius: 2,
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            width: "100%",
          }}
        >
          <CardContent>
            <Box pb={2.5}>
              <Typography {...cardHeaderProps}>Economic Details</Typography>
            </Box>

            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item xs={5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>Inputs</Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.num_inputs}
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
                  {transaction["num_inputs"] ?? "-"}
                </Typography>
              </Grid>

              <Grid item xs={5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>Outputs</Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.num_outputs}
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
                  {transaction["num_outputs"] ?? "-"}
                </Typography>
              </Grid>

              <Grid item xs={5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>
                    Total Input Amount
                  </Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.total_public_input}
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
                  {transaction["total_public_input"] ?? "-"}
                </Typography>
              </Grid>

              <Grid item xs={5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>
                    Total Output Amount
                  </Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.total_public_output}
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
                  {transaction["total_public_output"] ?? "-"}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4 }} />
            <Grid container justifyContent="space-between">
              <Grid item xs={5}>
                <Typography pb={2} color="text.primary" fontWeight="medium">
                  Public Inputs
                </Typography>
                {inputs.map((item) => {
                  if (item["coinbase"] != "") {
                    return <Typography>Coinbase</Typography>;
                  }

                  return (
                    <Stack
                      key={item["txid"]}
                      sx={{ width: "100%" }}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack spacing={1} direction="column">
                        {item["senders"] &&
                          new Array(item["senders"]).map((sender) => {
                            return (
                              <Typography key={sender} color="text.primary">
                                {sender}
                              </Typography>
                            );
                          })}
                      </Stack>

                      <Typography fontWeight="medium" color="text.secondary">
                        {item["value"]}
                      </Typography>
                    </Stack>
                  );
                })}
              </Grid>

              <Grid item xs={5}>
                <Typography pb={2} color="text.primary" fontWeight="medium">
                  Public Outputs
                </Typography>
                <Stack spacing={1}>
                  {outputs.map((item) => {
                    return (
                      <Stack
                        sx={{ width: "100%" }}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack spacing={1} direction="column">
                          {item["recipients"] &&
                            new Array(item["recipients"]).map((recipient) => {
                              return (
                                <Typography
                                  key={recipient}
                                  color="text.primary"
                                >
                                  {recipient}
                                </Typography>
                              );
                            })}
                        </Stack>

                        <Typography fontWeight="medium" color="text.secondary">
                          {item["value"]} ZEC
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card
          variant="elevation"
          sx={{
            borderRadius: 2,
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            width: "100%",
            bgcolor: "#fff",
          }}
        >
          <CardContent>
            <Box pb={2.5}>
              <Typography {...cardHeaderProps}>
                Blockchain Features / Technical Data
              </Typography>
            </Box>

            <Grid direction="row" container spacing={5}>
              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>
                    Overwintered?
                  </Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.is_overwintered}
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
                  {transaction["is_overwintered"] ?? "-"}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>Size</Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.size}
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
                  {transaction["size"] ?? "-"}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>
                    Raw Timestamp
                  </Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.timestamp}
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
                  {transaction["timestamp"] ?? "-"}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography {...listItemTextPrimaryProps}>
                    Transaction Hex
                  </Typography>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={TOOLTIP_DESCRIPTIONS.hex}
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
                  {...listItemTextSecondaryProps}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    msTextOverflow: "ellipsis",
                    width: "80%",
                  }}
                >
                  {transaction["hex"] ?? "-"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export const getServerSideProps = (async (context) => {
  try {
    const { txid } = context.params;

    if (!txid) {
      throw new Error(`Invalid transaction id while navigating`);
    }

    const transaction: TransactionData = JSON.parse(
      await fetchTransactionByHash(String(txid))
    );
    const outputs = await fetchOutputsByTransactionHash(String(txid));
    const inputs = await fetchInputsByTransactionHash(String(txid));

    for (const input of inputs) {
      input["senders"] = parseTransactionIdsInBlockData(input["senders"]);
    }

    for (const output of outputs) {
      output["recipients"] = parseTransactionIdsInBlockData(
        output["recipients"]
      );
    }

    return {
      props: {
        transaction,
        inputs: inputs,
        outputs: outputs,
      },
    };
  } catch (error) {
    console.log(
      `Error emitted in block/[hash].tsx (getServerSideProps): `,
      error
    );
    return {
      props: {
        transaction: {} as TransactionData,
        inputs: [],
        outputs: [],
      },
    };
  }
}) satisfies GetServerSideProps<{
  transaction: TransactionData;
  inputs: Array<any>;
  outputs: Array<any>;
}>;
