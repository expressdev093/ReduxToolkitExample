import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";

export enum APIStatus {
  IDLE,
  PENDING,
  REJECTED,
  FULFILLED
}
export type APIError = {
  message: string;
  code: number;
};

export type APIData<DataType = any> = {
  status: APIStatus;
  error?: APIError;
  data?: DataType;
};

export const InternalError = {
  message: "Internal error during request.",
  code: -500
};

export const onFulfilledRequest = (response: AxiosResponse) => response;
export const onRejectedResponse = (error: any): any =>
  Promise.reject(InternalError);
export const publicRequest = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});

export const getExceptionPayload = (ex: unknown): APIError => {
  if (typeof ex !== "object" || !ex) {
    return InternalError;
  }
  const typedException = ex as APIError;
  if (
    ex.hasOwnProperty("message") &&
    typeof typedException.message === "string" &&
    ex.hasOwnProperty("code") &&
    typeof typedException.code === "number"
  ) {
    return {
      message: typedException.message,
      code: typedException.code
    };
  }
  return InternalError;
};

export const UnhandledError = {
  message: "Cannot handle error data.",
  code: -400
};

export const useAPIData = <DataType>(
  response: APIData<DataType>,
  handlers: {
    onFulfilled?: (data: DataType) => void;
    onRejected?: (error: APIError) => void;
    onPending?: () => void;
  }
) => {
  const { onFulfilled, onRejected, onPending } = handlers;

  useEffect(() => {
    if (response.status === APIStatus.REJECTED && onRejected) {
      onRejected(response.error || UnhandledError);
    }
  }, [response.status, response.error, onRejected]);

  useEffect(() => {
    if (response.status === APIStatus.FULFILLED && onFulfilled) {
      onFulfilled(response.data!);
    }
  }, [response.status, response.data, onFulfilled]);

  useEffect(() => {
    if (response.status === APIStatus.PENDING && onPending) {
      onPending();
    }
  }, [response.status, onPending]);
};

export const createApiAsyncThunk = <DataType = any>(
  action: string,
  apiRequestCallback: () => Promise<DataType>
) =>
  createAsyncThunk<DataType, void, { rejectValue: APIError }>(
    action,
    async (_, { rejectWithValue }) => {
      try {
        return await apiRequestCallback();
      } catch (ex) {
        return rejectWithValue(getExceptionPayload(ex));
      }
    }
  );

publicRequest.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);
publicRequest.interceptors.response.use(onFulfilledRequest, onRejectedResponse);
