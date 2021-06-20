import React from 'react'
import {
  Podium
} from '@bingo/models';

interface BingoPodiumProps {
  podium: Podium[];
}

const BingoPodium: React.VFC<BingoPodiumProps> = ({ podium }) => {

  return (
    <div className="podium">
      <h2 className="podium-headline">Gewinner</h2>
      {podium?.sort((a: Podium, b: Podium) => {
        return a.placement - b.placement;
      }).map((winner) => {
        switch (winner.placement) {
          case 1:
            return <div key={`winner-${winner.placement}`} className="podium">🥇 {winner.name}</div>
          case 2:
            return <div key={`winner-${winner.placement}`} className="podium">🥈 {winner.name}</div>
          case 3:
            return <div key={`winner-${winner.placement}`} className="podium">🥉 {winner.name}</div>
          default:
            return <div key={`winner-${winner.placement}`} className="winner">{winner.placement}. {winner.name}</div>;
        }
      })}
    </div>
  )
}

export default BingoPodium
