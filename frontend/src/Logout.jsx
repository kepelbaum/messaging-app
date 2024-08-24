import { useNavigate } from "react-router-dom";

export const navigate = useNavigate();

export function movePage(url) {
  navigate(url);
}

export default { navigate, movePage };
