import styled from "styled-components";

export const PreviewPanel = styled.section`
  display: grid;
  gap: 14px;
  border: 1px solid #d7dde6;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;
`;

export const ReplyGroup = styled.div`
  display: grid;
  gap: 8px;

  h2,
  p {
    margin: 0;
  }
`;

export const PreviewLine = styled.p`
  border-radius: 6px;
  padding: 8px 10px;
  background: #f2f5f8;
  color: #243142;
  line-height: 1.45;
`;