import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { directSearch } from '../../constants/api-routes'
import { openSnackbar } from '../../utility/snackbar_manager'
import { AxiosError } from 'axios'

function useSearch() {}

function useTableSearch(pattern: string) {
    const useMutationresults = useMutation<any, AxiosError, string>({
        mutationFn: () => directSearch(pattern),
        mutationKey: ['use_table_search', pattern]
    });

    return useMutationresults
}

export { useTableSearch }
export default useSearch