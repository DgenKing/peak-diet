export function generateFitnessUsername(): string {
  const prefixes = [
    'Iron', 'Steel', 'Flex', 'Gains', 'Beast', 'Alpha', 'Titan', 'Power', 'Muscle', 'Protein',
    'Lean', 'Shred', 'Bulk', 'Pump', 'Lift', 'Strong', 'Fit', 'Peak', 'Prime', 'Max',
    'Ripped', 'Swole', 'Grind', 'Hustle', 'Core', 'Apex', 'Elite', 'Epic', 'Fury', 'Storm',
    'Thunder', 'Blaze', 'Savage', 'Fierce', 'Bold', 'Brave', 'Swift', 'Rapid', 'Turbo', 'Nitro',
    'Hyper', 'Ultra', 'Mega', 'Super', 'Atomic', 'Cosmic', 'Solar', 'Lunar', 'Nova', 'Venom',
    'Rage', 'Chaos', 'Force', 'Strike', 'Blast', 'Shock', 'Volt', 'Spark', 'Flash', 'Blitz',
    'Primal', 'Raw', 'Pure', 'True', 'Real', 'Hard', 'Heavy', 'Solid', 'Dense', 'Thick',
    'Deep', 'Dark', 'Night', 'Shadow', 'Ghost', 'Phantom', 'Stealth', 'Silent', 'Ninja', 'Samurai',
    'Viking', 'Spartan', 'Gladiator', 'Knight', 'King', 'Chief', 'Boss', 'Lord', 'Duke', 'Baron',
    'Omega', 'Sigma', 'Delta', 'Gamma', 'Zeta', 'Neon', 'Cyber', 'Tech', 'Mech', 'Robo'
  ];

  const suffixes = [
    'Muscle', 'King', 'Mode', 'Master', 'Machine', 'Warrior', 'Champion', 'Legend', 'Beast', 'Force',
    'Power', 'Crusher', 'Slayer', 'Hunter', 'Chief', 'Wolf', 'Bear', 'Lion', 'Tiger', 'Hawk',
    'Eagle', 'Falcon', 'Cobra', 'Viper', 'Dragon', 'Phoenix', 'Titan', 'Giant', 'Colossus', 'Goliath',
    'Atlas', 'Zeus', 'Thor', 'Odin', 'Mars', 'Ares', 'Apollo', 'Hercules', 'Achilles', 'Spartan',
    'Gladiator', 'Knight', 'Samurai', 'Ninja', 'Ronin', 'Shogun', 'Warlord', 'Commander', 'Captain', 'General',
    'Soldier', 'Trooper', 'Ranger', 'Scout', 'Sniper', 'Striker', 'Bomber', 'Brawler', 'Fighter', 'Boxer',
    'Lifter', 'Presser', 'Squatter', 'Bencher', 'Deadlifter', 'Curler', 'Pumper', 'Repper', 'Setter', 'Getter',
    'Grinder', 'Hustler', 'Chaser', 'Seeker', 'Finder', 'Builder', 'Maker', 'Shaper', 'Forger', 'Smith',
    'Runner', 'Sprinter', 'Jumper', 'Climber', 'Swimmer', 'Rower', 'Cyclist', 'Athlete', 'Player', 'Gamer',
    'Winner', 'Victor', 'Champ', 'Pro', 'Star', 'Ace', 'Hero', 'Icon', 'Boss', 'Lord'
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const number = Math.floor(Math.random() * 100);

  return `${prefix}${suffix}_${number}`;
}
