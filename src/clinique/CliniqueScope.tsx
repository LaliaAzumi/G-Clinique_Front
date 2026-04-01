import type { PropsWithChildren } from "react";
import "./CliniqueScope.css";

export default function CliniqueScope({ children }: PropsWithChildren) {
  return <div className="clinique-scope">{children}</div>;
}
