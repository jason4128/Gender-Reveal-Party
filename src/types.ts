export interface Player {
  id: string;
  name: string;
  game1Score: number; // 乾啦！乾啦！終極巨嬰爭霸戰
  game2Score: number; // 舌尖上的米其林：盲測主廚副食品
  game3Score: number; // 龍哥與茶茶的「家務事」：寶寶知識 Q&A
  totalScore: number;
}

export interface PartyState {
  players: Player[];
  votes: {
    boy: number;
    girl: number;
  };
  revealedGender: 'boy' | 'girl' | null;
  isRevealed: boolean;
}
