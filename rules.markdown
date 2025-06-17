# Magical Fight

A magical combat game inspired by Rock-Paper-Scissors with fantastic weapons!

## How to Play

1. Select a difficulty from the following:
   - Very Easy (Perfect for learning the game): 3PV
   - Easy (For casual players): 5PV
   - Normal (A balanced experience): 7PV
   - Hard (For players that want a real challenge): 10PV
   - Custom (For players that want to experiment with the game): Custom HP and uses
2. Each turn, choose a weapon from the following:
   - Magic Staff (deals 2 HP damage)
   - Sword (deals 1 HP damage)
   - Shield (blocks the Sword)
   - Mirror (blocks the Magic Staff and reflects 1 HP damage)
   - Black Hole (deals 2 HP damage, can't be blocked except by Crown, limited to 2 uses)
   - Crown (blocks all attacks, limited to 1 use)

## Detailed Rules

- Magic Staff deals 2 HP damage but can be blocked by Mirror, which reflects 1 HP damage back to the Staff user
- Sword deals 1 HP damage but can be blocked by Shield
- Black Hole deals 2 HP damage and can only be blocked by Crown
- Crown is the ultimate weapon that blocks all attacks
- Each player can only use 2 Black Holes and 1 Crown per game (or as set in Custom mode)

### Special Rules

#### Black Hole Collision
- If both players use a Black Hole at the same time, a collision occurs
- A player is randomly chosen and receives 3 HP damage
- Both Black Holes are consumed

#### Item Destruction
- If a Sword is used against a Mirror, the Mirror breaks and cannot be used for 2 turns
- If a Magic Staff is used against a Shield, the Shield breaks and cannot be used for 2 turns
- If a Magic Staff is used against a Mirror:
  - The Staff user takes 1 HP reflection damage
  - No direct damage is dealt to the Mirror user
- When an item is destroyed, no direct damage is dealt that turn
- Broken items are automatically repaired after their 2-turn penalty
- A broken item cannot be used before being repaired

#### Negative HP and Ties
- When both players reach 0 or negative HP in the same turn:
  - If both have exactly the same negative HP (e.g., -2 vs -2), they each receive 1 HP and the fight continues
  - If they have different negative HP values (e.g., -1 vs -2), the player with the higher value (closer to 0) wins
  - Example 1: Player1 (-2 HP) vs Player2 (-1 HP) → Player2 wins
  - Example 2: Player1 (-3 HP) vs Player2 (-3 HP) → Both get 1 HP and continue
  - Example 3: Player1 (-1 HP) vs Player2 (-2 HP) → Player1 wins

The game continues until one of the players runs out of health points or has lower negative HP than their opponent. You can play as many times as you want!