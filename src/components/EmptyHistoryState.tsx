import { EmptyBody, EmptyIcon, EmptyState, EmptyTitle } from "./EmptyHistoryState.styles";

export type EmptyHistoryStateKind = "first-use" | "cleared";

const emptyStateCopy = {
  "first-use": {
    icon: "･ﾟ",
    title: "樹洞還空著",
    body: "還沒有被接住的紀錄。先選一個電量、需要的話留一句話，小電量獸就會把今天輕輕收好。"
  },
  cleared: {
    icon: "○",
    title: "紀錄已經放下了",
    body: "這裡先變安靜。下一次想回來時，可以重新留下今天的電量。"
  }
} satisfies Record<EmptyHistoryStateKind, { icon: string; title: string; body: string }>;

interface EmptyHistoryStateProps {
  kind: EmptyHistoryStateKind;
}

function EmptyHistoryState({ kind }: EmptyHistoryStateProps) {
  const copy = emptyStateCopy[kind];

  return (
    <EmptyState>
      <EmptyIcon aria-hidden="true">{copy.icon}</EmptyIcon>
      <EmptyTitle>{copy.title}</EmptyTitle>
      <EmptyBody>{copy.body}</EmptyBody>
    </EmptyState>
  );
}

export default EmptyHistoryState;
