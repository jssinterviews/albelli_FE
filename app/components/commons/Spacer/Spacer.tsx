interface SpacerProps {
  spacing: number;
  position?: "vertical" | "horizontal";
}

function Spacer({ spacing, position = "vertical" }: SpacerProps) {
  return (
    <div
      style={{
        padding: `${position === "vertical" ? spacing : 0}rem ${
          position === "horizontal" ? spacing : 0
        }rem`,
      }}
    />
  );
}

export default Spacer;
