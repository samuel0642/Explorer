import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchPeerInfo } from "../../constants/api-routes";
import { peer_info_query_key } from "../../../query-client";
import { AxiosError } from "axios";

export default () => useQuery<any, AxiosError, Array<any> >({
  queryKey: [peer_info_query_key],
  queryFn: fetchPeerInfo,
  staleTime: 5000,
  refetchInterval: 5000,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
  initialData: []
})
