import React from 'react'
import {
  Podium
} from '@bingo/models';

interface BingoPodiumProps {
  podium: Podium[];
}

const BingoPodium: React.VFC<BingoPodiumProps> = ({ podium }) => {

  return (
    <div>
      {podium?.sort((a: Podium, b: Podium) => {
        return a.placement - b.placement;
      }).map((winner) => {
        return <div key={`winner-${winner.placement}`}>{winner.placement}. {winner.name}</div>
      })}
    </div>
  )
}

export default BingoPodium
