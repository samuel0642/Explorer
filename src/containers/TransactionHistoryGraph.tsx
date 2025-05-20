import { Paper, Typography } from "@mui/material";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Area,
  CartesianGrid,
} from "recharts";

interface ITransactionMetrics {
  startTimestamp: string | Date;
  endTimestamp: string | Date;
  data: Array<{ [timestamp: string]: number }>;
}

interface CustomAxisLabelProps {
  axisType: string;
  x?: string;
  y?: string;
  width?: number;
  height?: number;
  stroke?: string;
  payload?: any;
}

const CustomAxisLabel = ({
  axisType,
  x,
  y,
  width,
  height,
  stroke,
  payload,
}: CustomAxisLabelProps) => {
  if (!payload || !payload.value) {
    return;
  }

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      dy={axisType === "x" ? 15 : -10}
      fill="#FFF"
      fontSize={14}
      textAnchor="middle"
      dominantBaseline={axisType === "x" ? "middle" : "ideographic"}
    ></text>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper variant="outlined" sx={{ bgcolor: "#FFF", p: 2 }}>
        <Typography variant="caption" sx={{ color: "rgb(33, 33, 33)" }}>
          On {payload[0].payload.timestamp} the Zcash blockchain experienced{" "}
          {payload[0].payload.transaction_count} transactions.
        </Typography>
      </Paper>
    );
  }

  return null;
};

const TransactionHistoryGraph = (props: ITransactionMetrics) => {
  const { startTimestamp, endTimestamp, data } = props;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart
        height={280}
        data={data}
        margin={{
          bottom: 10,
          left: -18,
          right: 0,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgb(55, 131, 190)" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          style={{ fontSize: 12, fontWeight: "500" }}
          tickMargin={15}
          tickFormatter={(val, idx) => format(new Date(val), "MM-dd-yyyy")}
        />
        <YAxis
          dataKey="transaction_count"
          style={{ fontSize: 13 }}
          fontSize={12}
          tickCount={2}
          label={<CustomAxisLabel axisType="y" />}
        />
        {/* @ts-ignore */}
        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          unit="M"
          strokeLinecap="round"
          strokeWidth={1}
          dataKey="transaction_count"
          stroke="rgb(55, 131, 190)"
          dot={false}
          legendType="none"
        />
        <Area
          type="monotone"
          dataKey="transaction_count"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TransactionHistoryGraph;
