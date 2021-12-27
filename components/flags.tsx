import { Grid } from "@chakra-ui/react";
import { useContext, useMemo } from "react";
import { GameStateContext } from "../context/gameState";

export function Flags() {
  const { flagCount } = useContext(GameStateContext);

  const flagDisplay = useMemo(() => flagCount.toString().padStart(3, "0"), [
    flagCount,
  ]);
  return (
    <Grid templateColumns="repeat(3, 1fr)">
      {flagDisplay.split("").map((digit, index) => (
        <img key={index} src={`/assets/time${digit}.gif`} alt={`clock`} />
      ))}
    </Grid>
  );
}
