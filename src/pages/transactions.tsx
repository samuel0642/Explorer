import { useEffect, useState } from "react";
import TransactionsTable from "../containers/TransactionsTable";
import { apiRoutes, baseUrl } from "../constants/api-routes";
import { TransactionData } from "../types";
import { Box } from "@mui/material";
import PageHead from "../components/PageHead";

interface IHomeProps {
  initialTransactionData: Array<TransactionData>;
  totalTransactionCount: number;
  totalPages: number;
}

const LIMIT = 50;
export default function TransactionPage({
  initialTransactionData = [],
  totalTransactionCount,
  totalPages
}: IHomeProps) {
  const [transactionPage, setTransactionPage] = useState<number>(totalPages);
  const [transactionData, setTransactionData] = useState<Array<any>>(
    initialTransactionData
  );

  const loadMoreTransactionRows = async ({ startIndex, stopIndex }) => {
    const nextPage = transactionPage - 1;

    try {
      const response = await fetch(
        `${baseUrl}${
          apiRoutes.transactionsRoute
        }?page=${nextPage}&limit=${LIMIT}&reversedOrder=${true}`
      );
      const data = await response.json();

      setTransactionData((prevData) => [...data["data"], ...prevData]);
      setTransactionPage(nextPage);
    } catch (error) {
      // Do not throw an error here. The side of onError returned from usePaginatedTransactions
      // will pick up the error and warn the user.
    }
  };

  const isTransactionRowLoaded = ({ index }) => {
    return !!transactionData[index];
  };

  return (
    <Box sx={{ paddingTop: "60px", display: "flex", height: "100vh" }}>
      <PageHead title="Zcash Block Explorer- Transactions" description="Explore chain transactions" content="Scroll and view a table of chain transactions." />
      <TransactionsTable
        loadMoreRows={loadMoreTransactionRows}
        isRowLoaded={isTransactionRowLoaded}
        data={transactionData}
      />
    </Box>
  );
}

export async function getServerSideProps() {
  try {
    const totalTransactionCount = await fetch(`${baseUrl}${apiRoutes.transactionsRoute}/total`).then((res) => res.json())
    const totalPages = Math.ceil(totalTransactionCount / LIMIT);

    const initialDataResolved = await fetch(
        `${baseUrl}${
          apiRoutes.transactionsRoute
        }?page=${totalPages}&limit=${LIMIT}&reversedOrder=${true}`
      ).then((res) => res.json())

    return {
      props: {
        totalTransactionCount: initialDataResolved["totalCount"],
        totalPages: initialDataResolved["totalPages"],
        initialTransactionData: initialDataResolved["data"],
      },
    };
  } catch (error) {
    return {
      props: {
        initialTransactionData: [],
      },
    };
  }
}
