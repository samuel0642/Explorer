import { useQuery } from "@tanstack/react-query";
import { fetchPaginatedBlocks, fetchPaginatedTransactions } from "../../constants/api-routes";
import { openSnackbar, useSnackbarManager } from "../../utility/snackbar_manager";
import { BlockData, HookError, PaginationParameters, TransactionData } from "../../types";
import { AxiosError } from "axios";
import { query_paginate_blocks_key, query_paginate_transaction_key } from "../../../query-client";

function usePaginatedBlocks(paginationParameters: PaginationParameters) {
    const { snackbarConfig, closeSnackbar } = useSnackbarManager()
    
    return useQuery<Array<BlockData>, HookError, Array<BlockData>>({
        queryKey: [query_paginate_blocks_key],
        queryFn: () => fetchPaginatedBlocks(paginationParameters),
        onError(err) {
            openSnackbar(snackbarConfig)
        },
    })
}

function usePaginatedTransactions(paginationParameters: PaginationParameters) {
    const { snackbarConfig, closeSnackbar } = useSnackbarManager()
    
    return useQuery<Array<TransactionData>, HookError, Array<TransactionData>>({
        queryKey: [query_paginate_transaction_key],
        queryFn: () => fetchPaginatedTransactions(paginationParameters),
        onError(err) {
            openSnackbar(snackbarConfig)
        },
    })
}

export { usePaginatedBlocks, usePaginatedTransactions }


