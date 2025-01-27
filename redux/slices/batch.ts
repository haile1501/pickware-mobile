import { Batch, BatchState } from "@/types/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import axios from "axios";

const initialState: BatchState = {
  batches: [],
  currentBatch: null,
  loading: false,
  errorMessage: null,
  newBatchAssigned: false,
  unreadBatchAssigned: false,
};

export const batchSlice = createSlice({
  name: "batch",
  initialState,
  reducers: {
    // HANDLE REQUEST
    handleRequest: (state) => {
      state.loading = true;
    },
    // HANDLE FAILURE
    handleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    handleGetBatchesSuccess: (state, action: PayloadAction<Batch[]>) => {
      state.loading = false;
      state.batches = action.payload;
    },
    handleGetCurrentBatchSuccess: (state, action: PayloadAction<Batch>) => {
      state.loading = false;
      state.currentBatch = action.payload;
    },
    handleRequestSuccess: (state) => {
      state.loading = false;
    },
    handlePickedCurrentItemSuccess: (state, action: PayloadAction<Batch>) => {
      state.loading = false;
      state.currentBatch = action.payload;
    },
    handleSetNewBatchAssigned: (state, action: PayloadAction<boolean>) => {
      state.newBatchAssigned = action.payload;
    },
    handleSetUnreadBatchAssigned: (state, action: PayloadAction<boolean>) => {
      state.unreadBatchAssigned = action.payload;
    },
  },
});

const handleFailure = (error: any, dispatch: AppDispatch) => {
  const errorMessage = error.response
    ? error.response.data.message
    : "Something went wrong";
  dispatch(batchSlice.actions.handleFailure(errorMessage));
};

export const getTodayBatches = (employeeId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(batchSlice.actions.handleRequest());
      const result = await axios.get(
        `/orders/batch/picker-today-batches/${employeeId}`
      );
      dispatch(batchSlice.actions.handleGetBatchesSuccess(result.data));
    } catch (error) {
      handleFailure(error, dispatch);
    }
  };
};

export const startPicking = (employeeId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(batchSlice.actions.handleRequest());
      await axios.post(
        `/orders/batch/picker-current-batch/${employeeId}/start`
      );
      dispatch(batchSlice.actions.handleRequestSuccess());
    } catch (error) {
      handleFailure(error, dispatch);
    }
  };
};

export const getPickingBatch = (employeeId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(batchSlice.actions.handleRequest());
      const result = await axios.get(
        `/orders/batch/picker-current-batch/${employeeId}`
      );
      dispatch(batchSlice.actions.handleGetCurrentBatchSuccess(result.data));
    } catch (error) {
      handleFailure(error, dispatch);
    }
  };
};

export const pickedCurrentItem = (employeeId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(batchSlice.actions.handleRequest());
      const result = await axios.post(
        `orders/batch/picker-current-batch/${employeeId}/current-item-picked/`
      );
      dispatch(batchSlice.actions.handlePickedCurrentItemSuccess(result.data));
    } catch (error) {
      handleFailure(error, dispatch);
    }
  };
};

export const completeCurrentBatch = (employeeId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(batchSlice.actions.handleRequest());
      await axios.post(`orders/batch/complete-batch/${employeeId}`);
      dispatch(batchSlice.actions.handleRequestSuccess());
    } catch (error) {
      handleFailure(error, dispatch);
    }
  };
};

export const handleSetNewBatchAssigned = (value: boolean) => {
  return (dispatch: AppDispatch) => {
    dispatch(batchSlice.actions.handleSetNewBatchAssigned(value));
  };
};

export const handleSetUnreadBatchAssigned = (value: boolean) => {
  return (dispatch: AppDispatch) => {
    dispatch(batchSlice.actions.handleSetUnreadBatchAssigned(value));
  };
};

export default batchSlice.reducer;
