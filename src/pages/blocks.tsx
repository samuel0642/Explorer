import { useState } from "react";
import BlockTable from "../containers/BlockTable";
import { BlockData } from "../types";
import { apiRoutes, baseUrl } from "../constants/api-routes";
import { Box, Paper } from "@mui/material";
import PageHead from "../components/PageHead";

interface IBlocksPage {
  initialBlocksData: Array<BlockData>;
  totalBlockCount: number;
  totalPages: number;
}

const LIMIT = 50;
export default function BlocksPage({ 
  initialBlocksData, 
  totalBlockCount,  
  totalPages }: IBlocksPage) {
  const [blockPage, setBlockPage] = useState<number>(totalPages);
  const [blockData, setBlockData] = useState<Array<any>>(initialBlocksData);

  const loadMoreBlockRows = async ({ startIndex, stopIndex }) => {
    const nextPage = blockPage - 1;

    try {
      const response = await fetch(
        `${baseUrl}${
          apiRoutes.blocksRoute
        }?page=${nextPage}&limit=${LIMIT}&reversedOrder=${true}`
      );

      const blockPaginationResponse = await response.json();

      setBlockData((prevData) => [...blockPaginationResponse["data"], ...prevData] );
      setBlockPage(nextPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const isRowBlockRowLoaded = ({ index }) => {
    return !!blockData[index];
  };

  return (
    <Box sx={{ paddingTop: "60px", display: "flex", height: "100vh" }}>
       <PageHead title="Zcash Block Explorer" description="Explore chain blocks" content="Scroll and view a table of chain blocks." />
      <BlockTable
        loadMoreRows={loadMoreBlockRows}
        isRowLoaded={isRowBlockRowLoaded}
        data={blockData}
      />
    </Box>
  );
}

export async function getServerSideProps() {
  try {
    const totalBlocksCount = await fetch(`${baseUrl}${apiRoutes.blocksRoute}/total`).then((res) => res.json())
    const totalPages = Math.ceil(totalBlocksCount / LIMIT);

    const initialDataResolved = await fetch(
        `${baseUrl}${
          apiRoutes.blocksRoute
        }?page=${totalPages}&limit=${LIMIT}&reversedOrder=${true}`
      ).then((res) => res.json())

    return {
      props: {
        totalBlockCount: initialDataResolved["totalCount"],
        totalPages: initialDataResolved["totalPages"],
        initialBlocksData: initialDataResolved["data"],
      },
    };
  } catch (error) {
    return {
      props: {
        initialBlocksData: [],
      },
    };
  }
}
