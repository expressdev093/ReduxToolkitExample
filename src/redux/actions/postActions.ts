import { createAction } from "@reduxjs/toolkit";

const deletePost = createAction("delete/post");

const postActions = {
  deletePost
};

export default postActions;
