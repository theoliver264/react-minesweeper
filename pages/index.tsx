import { Flex } from "@chakra-ui/react";
import { Board } from "../components/board";
import { GameStateProvider } from "../context/gameState";

const cellSize = "16px";
const boardWidth = 20;
const boardHeight = 10;
const maxBombs = 10;

export default function Minesweeper() {
  return (
    <GameStateProvider
      boardHeight={boardHeight}
      boardWidth={boardWidth}
      maxBombs={maxBombs}
    >
      <Flex
        w="100vw"
        h="100vh"
        bg="#eee"
        flexDir="column"
        placeItems="center"
        justifyContent="center"
      >
        <Board cellSize={cellSize} />
      </Flex>
    </GameStateProvider>
  );
}
