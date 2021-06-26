import { Podium } from '@bingo/models';
import { Card, CardContent, CardTitle } from '../common';

interface BingoPodiumProps {
  podium: Podium[];
}

export const BingoPodium = ({ podium }: BingoPodiumProps) => {
  return (
    <Card className="podium">
      <CardTitle>Gewinner Podium</CardTitle>
      <CardContent>
        {podium
          ?.sort((a: Podium, b: Podium) => {
            return a.placement - b.placement;
          })
          .map(winner => {
            const key = `winner-${winner.placement}`;
            switch (winner.placement) {
              case 1:
                return (
                  <div key={key} className="podium">
                    <span role="img" aria-label="First Place">
                      🥇
                    </span>
                    {winner.name}
                  </div>
                );
              case 2:
                return (
                  <div key={key} className="podium">
                    <span role="img" aria-label="Second Place">
                      🥈
                    </span>
                    {winner.name}
                  </div>
                );
              case 3:
                return (
                  <div key={key} className="podium">
                    <span role="img" aria-label="Third Place">
                      🥉
                    </span>
                    {winner.name}
                  </div>
                );
              default:
                return (
                  <div key={key} className="winner">
                    {winner.placement}. {winner.name}
                  </div>
                );
            }
          })}
      </CardContent>
    </Card>
  );
};
