import { createContext, PropsWithChildren, useContext, useState } from 'react';

export type KommentarCellState = {
  isEditMode: boolean;
  editedComment: string | null;
};

export type RowState = {
  kommentar: KommentarCellState;
};

export type TableState = {
  [rowId: string]: RowState;
};

type TableStateContextType = {
  tableState: TableState;
  getRowState: (rowId: string) => RowState;
  setRowState: (rowId: string, state: RowState) => void;
};

const initialRowState: RowState = {
  kommentar: {
    isEditMode: false,
    editedComment: null,
  },
};

const initialValue: TableStateContextType = {
  tableState: {},
  getRowState: () => initialRowState,
  setRowState: () => {},
};

const TableStateContext = createContext<TableStateContextType>(initialValue);

export const TableStateProvider = ({ children }: PropsWithChildren) => {
  const [tableState, setTableState] = useState<TableState>({});

  const getRowState = (rowId: string) => {
    if (tableState[rowId] != null) {
      return tableState[rowId];
    }
    return initialRowState;
  };

  const setRowState = (rowId: string, rowState: RowState) => {
    setTableState({ ...tableState, [rowId]: rowState });
  };

  const value = {
    tableState,
    getRowState,
    setRowState,
  };

  return (
    <TableStateContext.Provider value={value}>
      {children}
    </TableStateContext.Provider>
  );
};

export const useTableState = () => {
  return useContext<TableStateContextType>(TableStateContext);
};

export const useKommentarCellState = (rowId: string) => {
  const { getRowState, setRowState } = useTableState();
  const rowState = getRowState(rowId);

  const setIsEditing = (isEditMode: boolean) => {
    setRowState(rowId, {
      ...rowState,
      kommentar: { editedComment: null, isEditMode },
    });
  };

  const setEditedComment = (editedComment: string | null) => {
    setRowState(rowId, {
      ...rowState,
      kommentar: { ...rowState.kommentar, editedComment },
    });
  };

  return {
    ...rowState.kommentar,
    setIsEditing,
    setEditedComment,
  };
};
