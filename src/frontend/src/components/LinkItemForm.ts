import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #ebc22c;
  &:hover {
    text-decoration: underline;
  }
`;
