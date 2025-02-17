import styled from 'styled-components'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { useEffect, useRef, useState } from 'react'

const Home = () => {
  const eventsRef = useRef(null)
  const game = useRef(new Chess())
  const listRef = useRef(null)

  const [events, setEvents] = useState(['Loading Vocal0 agent...'])
  const [fen, setFen] = useState(game.current.fen())
  const [vocal0Loaded, setVocal0Loaded] = useState(false)

  useEffect(() => {
    const loadVocal0 = () => {
      window.Vocal0.on('connect', () => {
        setEvents(events => [...events, 'Agent connected'])
        setTimeout(() => {
          const availableMoves = game.current.moves()
          window.Vocal0.informAgent({ availableMoves })
          setEvents(events => [...events, `Informed agent of available moves: ${availableMoves.join(', ')}`])
        }, 500)
      })
      window.Vocal0.on('disconnect', () => {
        setEvents(events => [...events, 'Agent disconnected'])
      })
      window.Vocal0.on('move', payload => {
        const { move } = payload
        makeMove(move)
        setEvents(events => [...events, `User moved: ${move}`])
        setTimeout(() => {
          const availableMoves = game.current.moves()
          makeMove(availableMoves[Math.floor(Math.random() * availableMoves.length)])
          setTimeout(() => {
            const availableMoves = game.current.moves()
            window.Vocal0.informAgent({ availableMoves })
            setEvents(events => [...events, `Informed agent of available moves: ${availableMoves.join(', ')}`])
          }, 500)
        }, 1000)
      })
      window.Vocal0.on('takeBack', () => {
        takeBack()
        setEvents(events => [...events, 'User took back'])
        const availableMoves = game.current.moves()
        window.Vocal0.informAgent({ availableMoves })
        setEvents(events => [...events, `Informed agent of available moves: ${availableMoves.join(', ')}`])
      })
      setEvents(events => [...events, 'Vocal0 agent loaded'])
      setVocal0Loaded(true)
    }
    window.addEventListener('vocal0Loaded', loadVocal0)
    return () => {
      window.removeEventListener('vocal0Loaded', loadVocal0)
      window.Vocal0.off()
    }
  }, [])

  useEffect(() => {
    if (eventsRef.current) {
      eventsRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [events])

  const makeMove = move => {
    game.current.move(move)
    setFen(game.current.fen())
  }

  const takeBack = () => {
    game.current.undo()
    game.current.undo()
    setFen(game.current.fen())
  }

  return (
    <Background>
      <Container $vocal0Loaded={vocal0Loaded}>
        <div id='vocal0' />
        <Demo>
          <Events ref={eventsRef}>
            <ul ref={listRef}>
              {events.map((event, index) => (
                <li className={event.startsWith('Informed') ? 'inform' : ''} key={index}>
                  {event}
                </li>
              ))}
            </ul>
          </Events>
          <Board>
            <Chessboard arePiecesDraggable={false} position={fen} />
          </Board>
        </Demo>
      </Container>
      <Brain>
        <span>Agent brain</span>
        <br />
        <br />
        {`You are a chess assistant specializing in helping users make moves during a chess game. Your main role is to accurately convert spoken or written moves into precise algebraic notation (always in English) while maintaining smooth and minimal communication with the user.

INSTRUCTIONS
1. Welcome the User
  - Start by greeting the user and letting them know you’re available to assist with their chess moves.
  - Do not mention that you use algebraic notation.
2. Language Adaptation
  - If the user speaks in a different language, seamlessly switch your responses to match their language.
  - However, always use English for algebraic notation.
3. Processing Moves
  - Listen carefully to the user's spoken or written move.
  - Convert the move into standard algebraic notation (always in English).
4. Executing Moves
  - Send the move to the system by executing the tool function "message_client" with parameters: { eventName: "move", payload: { move: "<move in algebraic notation>" } }
  - Confirm the move by repeating it back to the user in their language.
5. Handling Takebacks
  - If the user requests to undo a move, execute the tool function "message_client" with parameter: { eventName: "takeBack" }

KEY BEHAVIORS:
1. Accuracy & Consistency
  - Always translate moves correctly into English algebraic notation.
  - Ensure clarity and precision in communication.
2. Minimal & Effective Communication
  - Speak only when necessary:
    - To confirm the user's move.
    - If you don’t understand the user's request.
  - Keep responses brief and direct.
3. Adaptability
  - Always respond in the user’s language.
  - Maintain a smooth and natural conversation flow.

EXAMPLE WORKFLOW:
1. User says "Knight f3"
2. Convert "Knight f3" to algebraic notation → "Nf3"
3. Execute "message_client" with parameter: { eventName: "move", payload: { move: "Nf3" } }
3. Say: "Knight f3" (repeating the move in the user’s language)
4. Wait for the next move.`}
      </Brain>
    </Background>
  )
}

const Background = styled('div')`
  align-items: center;
  background: linear-gradient(to bottom, #66c, #99c);
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
`

const Board = styled('div')`
  background-color: #222;
  border-radius: 8px;
  height: 380px;
  opacity: 0.9;
  padding: 12px;
  width: 380px;
`

const Brain = styled('pre')`
  background-color: #222;
  border-radius: 8px;
  color: orange;
  font-size: 0.6rem;
  height: 200px;
  margin-top: 12px;
  opacity: 0.9;
  overflow-y: auto;
  padding: 10px 12px;
  white-space: pre-wrap;
  width: 672px;

  & span {
    color: #d1c3b7;
    text-transform: uppercase;
  }
`

const Container = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 42px;

  & #vocal0 {
    display: ${({ $vocal0Loaded }) => ($vocal0Loaded ? 'block' : 'none')};
    margin-top: -42px;
  }
`

const Demo = styled('div')`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`

const Events = styled('div')`
  background-color: #222;
  border-radius: 8px;
  color: #d1c3b7;
  height: 380px;
  opacity: 0.9;
  overflow-y: auto;
  padding: 8px 12px;
  width: 280px;

  & ul {
    font-size: 0.7rem;
    list-style: disc;
    margin-left: 12px;
    padding: 0;

    & li.inform {
      color: #4caf50;
    }
  }
`

export default Home
