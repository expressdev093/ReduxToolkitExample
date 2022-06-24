import {
  createAction,
  createAsyncThunk,
  createReducer
} from "@reduxjs/toolkit";
import {
  APIData,
  APIError,
  publicRequest,
  getExceptionPayload,
  APIStatus
} from "./../api";

export const deletePostAction = createAction("delete/post");

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type PostState = {
  posts: APIData<IPost[]>;
};

// Action
export const getPosts = createAsyncThunk<
  IPost[],
  void,
  { rejectValue: APIError }
>("blog/getPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await publicRequest.get<IPost[]>("/posts");
    return response.data;
  } catch (ex) {
    return rejectWithValue(getExceptionPayload(ex));
  }
});

// Reducer
export const initialState: PostState = {
  posts: {
    status: APIStatus.IDLE
  }
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(getPosts.pending, (state) => {
      state.posts.status = APIStatus.PENDING;
      state.posts.error = undefined;
    })
    .addCase(getPosts.fulfilled, (state, action) => {
      state.posts.status = APIStatus.FULFILLED;
      state.posts.data = action.payload;
      state.posts.error = undefined;
    })
    .addCase(getPosts.rejected, (state, action) => {
      state.posts.status = APIStatus.REJECTED;
      state.posts.error = action.payload;
    })
    .addCase(deletePostAction, (state, action) => {});
});
