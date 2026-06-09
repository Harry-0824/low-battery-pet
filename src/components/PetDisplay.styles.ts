import styled from "styled-components";

export const Display = styled.div`
  display: grid;
  justify-items: center;
  gap: 10px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 18px;
  background: #f2f5f8;
  text-align: center;
`;

export const PetFace = styled.pre`
  margin: 0;
  color: #243142;
  font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
  font-size: 2rem;
  line-height: 1.1;
  white-space: pre-wrap;
`;

export const StatusText = styled.p`
  margin: 0;
  color: #243142;
  font-weight: 800;
  line-height: 1.45;
`;