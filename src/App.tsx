import "./styles.css";
import {
  login,
  logOut,
  authSelector,
  CurrentUser
} from "./features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";

interface UserProfileProps {
  user?: CurrentUser;
}
function UserProfile({ user }: UserProfileProps) {
  return <div>{user?.display_name}</div>;
}

export default function App() {
  const dispatch = useDispatch();
  const { currentUser, isLoading, isAuth, error } = useSelector(authSelector);
  if (isLoading) return <div>....loading </div>;
  if (error) return <div>{error.message}</div>;
  return (
    <div className="App">
      {isAuth ? (
        <button onClick={() => dispatch(logOut)}> Logout</button>
      ) : (
        <button onClick={() => dispatch(login)}>Login</button>
      )}
      <UserProfile user={currentUser} />
    </div>
  );
}
