import styled from 'styled-components'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { useEffect, useRef, useState } from 'react'

const Home = () => {
  const game = useRef(new Chess())

  const [fen, setFen] = useState(game.current.fen())

  useEffect(() => {
    if (!window.Vocal0) return
    window.Vocal0.on('connect', () => {
      setTimeout(() => {
        const availableMoves = game.current.moves()
        window.Vocal0.informAgent({ availableMoves })
      }, 500)
    })
    window.Vocal0.on('move', payload => {
      const { move } = payload
      makeMove(move)
      setTimeout(() => {
        const availableMoves = game.current.moves()
        makeMove(availableMoves[Math.floor(Math.random() * availableMoves.length)])
        setTimeout(() => {
          const availableMoves = game.current.moves()
          window.Vocal0.informAgent({ availableMoves })
        }, 500)
      }, 1000)
    })
    return () => window.Vocal0.off()
  }, [window.Vocal0])

  const makeMove = move => {
    game.current.move(move)
    setFen(game.current.fen())
  }

  return (
    <Container>
      <Board>
        <Chessboard arePiecesDraggable={false} position={fen} />
      </Board>
    </Container>
  )
}

const Board = styled('div')`
  height: 500px;
  width: 500px;

  @media (max-width: 768px) {
    height: 300px;
    width: 300px;
  }
`

const Container = styled('div')`
  align-items: center;
  background-color: #333;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100vw;
`

export default Home
