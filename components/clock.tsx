import { Grid } from "@chakra-ui/react";
import { useContext, useMemo } from "react";
import { GameStateContext } from "../context/gameState";

export function Clock() {
  const { clock } = useContext(GameStateContext);

  const clockDisplay = useMemo(() => clock.toString().padStart(3, "0"), [
    clock,
  ]);

  return (
    <Grid templateColumns="repeat(3, 1fr)">
      {clockDisplay.split("").map((digit, index) => (
        <img key={index} src={`/assets/time${digit}.gif`} alt={`clock`} />
      ))}
    </Grid>
  );
}
