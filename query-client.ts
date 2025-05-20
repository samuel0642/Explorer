import { QueryClient } from "@tanstack/react-query";

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Query Keys
const query_transactions_query_key = "query_transactions";
const query_blocks_query_key = "query_blocks";
const query_paginate_blocks_key = 'use_paginated_blocks'
const query_paginate_transaction_key = 'use_paginated_transactions'
const peer_info_query_key = "query_peer_info";

export {
  query_transactions_query_key,
  query_blocks_query_key,
  peer_info_query_key,
  query_paginate_blocks_key,
  query_paginate_transaction_key
};
export default queryClient;
