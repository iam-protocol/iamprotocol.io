type ProofStage = "extracting" | "generating" | "submitting" | "verified";

type ProofProgressProps = {
  stage: ProofStage;
};

const stages: ProofStage[] = ["extracting", "generating", "submitting", "verified"];

const stageItems: Array<{ id: ProofStage; label: string }> = [
  { id: "extracting", label: "Extracting features..." },
  { id: "generating", label: "Generating proof..." },
  { id: "submitting", label: "Submitting to Solana..." },
  { id: "verified", label: "Verified" },
];

export default function ProofProgress({ stage }: ProofProgressProps) {
  const currentIndex = stages.indexOf(stage);

  return (
    <ol className="flex list-none flex-col gap-2">
      {stageItems.map((item, index) => {
        const completed = index < currentIndex;
        const active = index === currentIndex;
        const pending = index > currentIndex;

        const color = active
          ? "text-cyan-400"
          : completed
            ? "text-white"
            : pending
              ? "text-gray-500"
              : "text-gray-500";

        return (
          <li
            key={item.id}
            className={`text-sm ${color} ${
              stage === "extracting" && active ? "animate-pulse" : ""
            }`}
          >
            {item.label}
          </li>
        );
      })}
    </ol>
  );
}
