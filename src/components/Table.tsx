// @ts-nocheck
import React, { FC } from "react";
import {
  Table,
  Column,
  TableCellProps,
  AutoSizer,
  InfiniteLoader,
} from "react-virtualized";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import { Typography, Skeleton } from "@mui/material";
import { StyledBodyTableTypography } from "../styled/typography.styled";
import { NextRouter } from "next/router";
import { test_SECONDARY_ACCENT_COLOR } from "../constants/color";
import { format } from "date-fns";
import { BlockData, TransactionData } from "../types";

interface IVirtualizedTableProps {
  router: NextRouter;
  isLoadingTableData: boolean;
  data: any[];
  columns: any[];
  rowGetter: ({ index: number }) => any;
  rowCount: number;
  minHeight?: string;
  loadMoreRows?: ({ startIndex: number, stopIndex: number }) => Promise<void>;
  isRowLoaded?: ({ index: number }) => boolean;
  onRowClick?: (index: number) => void;
}

function VirtualizedTable(props: IVirtualizedTableProps) {
  const {
    columns = [],
    data = [],
    isLoadingTableData,
    loadMoreRows,
    isRowLoaded,
    classes,
    minHeight,
    router,
    onRowClick,
    ...tableProps
  } = props;

  const handleRowClick = ({ index }) => {
    if (onRowClick) {
      onRowClick(index);
    }
  };

  const renderLoadingCell = (dataKey: string) => (
    <TableCell component="div" variant="body" align="left">
      <Skeleton
        animation="pulse"
        sx={{ width: '80%' }}
        height={24}
        style={{ marginBottom: 6, transform: "scale(1, 0.6)" }}
      />
    </TableCell>
  );

  const cellRenderer: FC<TableCellProps> = ({
    cellData,
    columnData,
    dataKey,
    rowData,
    rowIndex,
  }) => {
    if (isLoadingTableData) {
      return renderLoadingCell(dataKey);
    }

    // Find the corresponding column definition
    const column = columns.find(col => col.dataKey === dataKey);
    
    // If the column has a custom render function, use it
    if (column && column.render) {
      return (
        <TableCell component="div" variant="body" align="left">
          {column.render(rowData)}
        </TableCell>
      );
    }

    // Fallback for simple data rendering
    return (
      <TableCell component="div" variant="body" align="left">
        <StyledBodyTableTypography>
          {cellData ? cellData.toString() : "-"}
        </StyledBodyTableTypography>
      </TableCell>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "7px",
        display: "flex",
        flexDirection: "column",
        minHeight: minHeight ? minHeight : "400px",
        flexGrow: 1,
        width: "100%",
        flex: 1,
      }}
    >
      <AutoSizer style={{ width: "100%", height: "100%" }}>
        {({ width, height }) => {
          const computedColumns = columns.map((column) => ({
            ...column,
            width: (column.width / 100) * width,
          }));

          if (loadMoreRows && isRowLoaded) {
            return (
              <InfiniteLoader
                loadMoreRows={loadMoreRows}
                isRowLoaded={isRowLoaded}
                rowCount={props.rowCount || 0}
              >
                {({ onRowsRendered }) => (
                  <Table
                    {...tableProps}
                    width={width}
                    rowStyle={(index) => ({
                      backgroundColor: index.index % 2 === 0 ? "#f5f5f5" : "#FFF",
                      cursor: onRowClick ? "pointer" : "default"
                    })}
                    height={height - 48}
                    rowHeight={48}
                    headerHeight={48}
                    onRowsRendered={onRowsRendered}
                    onRowClick={handleRowClick}
                  >
                    {computedColumns.map(
                      ({ dataKey, width, ...other }, index) => {
                        return (
                          <Column
                            width={width}
                            key={dataKey}
                            headerRenderer={(headerProps) => (
                              <TableCell
                                component="div"
                                variant="head"
                                align="left"
                              >
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    color: `${test_SECONDARY_ACCENT_COLOR} !important`,
                                    fontWeight: 600,
                                  }}
                                  variant="subtitle2"
                                  fontSize={13}
                                >
                                  {headerProps.label}
                                </Typography>
                              </TableCell>
                            )}
                            cellRenderer={cellRenderer}
                            dataKey={dataKey}
                            {...other}
                          />
                        );
                      }
                    )}
                  </Table>
                )}
              </InfiniteLoader>
            );
          }
          
          return (
            <Table
              {...tableProps}
              width={width}
              rowStyle={(index) => ({
                backgroundColor: index.index % 2 === 0 ? "#f5f5f5" : "#FFF",
                cursor: onRowClick ? "pointer" : "default"
              })}
              height={height - 48}
              rowHeight={48}
              headerHeight={48}
              onRowClick={handleRowClick}
            >
              {computedColumns.map(
                ({ dataKey, width, ...other }, index) => {
                  return (
                    <Column
                      width={width}
                      key={dataKey}
                      headerRenderer={(headerProps) => (
                        <TableCell
                          component="div"
                          variant="head"
                          align="left"
                        >
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: `${test_SECONDARY_ACCENT_COLOR} !important`,
                              fontWeight: 600,
                            }}
                            variant="subtitle2"
                            fontSize={13}
                          >
                            {headerProps.label}
                          </Typography>
                        </TableCell>
                      )}
                      cellRenderer={cellRenderer}
                      dataKey={dataKey}
                      {...other}
                    />
                  );
                }
              )}
            </Table>
          );
        }}
      </AutoSizer>
    </Paper>
  );
}

export default VirtualizedTable;
