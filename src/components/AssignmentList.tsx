import type { Assignment } from "../types";
import AssignmentItem from "./AssignmentCard";

interface Props {
  assignments: Assignment[];
  onToggle: (id: number) => void;
}

function AssignmentList({ assignments, onToggle }: Props) {
  const sorted = [...assignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <ul>
      {sorted.map(a => (
        <AssignmentItem key={a.id} assignment={a} onToggle={onToggle} />
      ))}
    </ul>
  );
}

export default AssignmentList;
