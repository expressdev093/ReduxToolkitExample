import { createAction, createReducer } from "@reduxjs/toolkit";
import {
  APIData,
  publicRequest,
  APIStatus,
  createApiAsyncThunk
} from "./..//api";

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
export const getPosts = createApiAsyncThunk<IPost[]>(
  "blog/getPosts",
  async () => {
    const response = await publicRequest.get<IPost[]>("/posts");
    return response.data;
  }
);

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
