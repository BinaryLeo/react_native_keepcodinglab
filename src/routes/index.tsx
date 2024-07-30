
import { useSelector } from "react-redux";
import { AppRoutes } from "./appRoutes";
import { AuthRoutes } from "./authRoutes";
import { IAuthSate } from "../../types/auth";
export default function Router() {
  const { logged } = useSelector((state: IAuthSate) => state.authState);
  return <>{logged ? <AppRoutes /> : <AuthRoutes />}</>;
}