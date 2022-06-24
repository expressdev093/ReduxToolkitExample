import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { APIStatus, useAPIData } from "./redux/api";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { getPosts } from "./redux/reducers/postReducer";

import "./styles.css";

export default function App() {
  const { posts } = useAppSelector((state) => state.post);
  const [loading, setLoading] = useState<boolean>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      dispatch(getPosts() as any);
    })();
  }, []);
  console.log(posts);
  useAPIData(
    posts,
    useMemo(
      () => ({
        onFulfilled: (data) => {
          setLoading(false);
          //Do logic with data
        },
        onRejected: (error) => {
          setLoading(false);
          //do logic with error like show a warning or error message
        },
        onPending: () => {
          setLoading(true);
          //do logic while data is pending like loading
        }
      }),
      []
    )
  );

  return (
    <div className="App">{loading ? <div>Loading</div> : <div>Data</div>}</div>
  );
}
