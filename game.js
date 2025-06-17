class MagicalFight {
    constructor(maxHealth, maxBlackhole = 2, maxCrown = 1) {
        this.maxHealth = maxHealth;
        this.maxBlackhole = maxBlackhole;
        this.maxCrown = maxCrown;
        this.playerHealth = this.maxHealth;
        this.computerHealth = this.maxHealth;
        this.playerBlackhole = this.maxBlackhole;
        this.computerBlackhole = this.maxBlackhole;
        this.playerCrown = this.maxCrown;
        this.computerCrown = this.maxCrown;
        this.lastPlayerWeapon = null;
        this.lastComputerWeapon = null;
        this.brokenItems = {
            player: { mirror: 0, shield: 0 },
            computer: { mirror: 0, shield: 0 }
        };
        this.gameOver = false;
        this.messageElement = document.getElementById('game-message');
        this.setupEventListeners();
        this.updateUI();
        this.updateDifficultyDisplay();
        this.updateLastMoveDisplay();
    }

    setupEventListeners() {
        document.querySelectorAll('.weapon-btn').forEach(button => {
            button.addEventListener('click', () => {
                const weapon = parseInt(button.dataset.weapon);
                if (this.isWeaponUsable('player', weapon) && weapon !== this.lastPlayerWeapon) {
                    this.handlePlayerChoice(weapon);
                }
            });
        });

        this.messageElement.addEventListener('click', () => {
            if (this.messageElement.classList.contains('animating')) {
                this.messageElement.classList.remove('animating');
                this.messageElement.classList.add('instant');
            }
        });

        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
    }

    handlePlayerChoice(playerWeapon) {
        if (this.isGameOver()) return;

        if (!this.isWeaponUsable('player', playerWeapon)) {
            this.showMessage("This weapon is not available right now!");
            return;
        }

        const computerWeapon = this.getComputerChoice();
        this.playRound(playerWeapon, computerWeapon);
    }

    getComputerChoice() {
        const availableWeapons = [];
        for (let i = 1; i <= 6; i++) {
            if (this.isWeaponUsable('computer', i) && i !== this.lastComputerWeapon) {
                availableWeapons.push(i);
            }
        }
        return availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
    }

    isWeaponUsable(player, weapon) {
        const broken = this.brokenItems[player];
        
        if (player === 'player' && weapon === this.lastPlayerWeapon) {
            return false;
        }
        if (player === 'computer' && weapon === this.lastComputerWeapon) {
            return false;
        }
        
        switch (weapon) {
            case 4: // Mirror
                return broken.mirror === 0;
            case 3: // Shield
                return broken.shield === 0;
            case 5: // Black Hole
                return player === 'player' ? this.playerBlackhole > 0 : this.computerBlackhole > 0;
            case 6: // Crown
                return player === 'player' ? this.playerCrown > 0 : this.computerCrown > 0;
            default:
                return true;
        }
    }

    playRound(playerWeapon, computerWeapon) {
        let message = '';
        
        this.lastPlayerWeapon = playerWeapon;
        this.lastComputerWeapon = computerWeapon;

        if (playerWeapon === 5 && computerWeapon === 5) {
            this.playerBlackhole--;
            this.computerBlackhole--;
            if (Math.random() < 0.5) {
                this.playerHealth -= 3;
                message = "Black Hole collision! You take 3 damage!";
            } else {
                this.computerHealth -= 3;
                message = "Black Hole collision! Computer takes 3 damage!";
            }
        } else {
            const playerDamage = this.calculateDamage(playerWeapon, computerWeapon, 'player');
            const computerDamage = this.calculateDamage(computerWeapon, playerWeapon, 'computer');

            this.playerHealth -= computerDamage;
            this.computerHealth -= playerDamage;

            if (playerWeapon === 5) this.playerBlackhole--;
            if (playerWeapon === 6) this.playerCrown--;
            if (computerWeapon === 5) this.computerBlackhole--;
            if (computerWeapon === 6) this.computerCrown--;

            message = this.generateRoundMessage(playerWeapon, computerWeapon, playerDamage, computerDamage);
        }

        this.updateBrokenItems();
        
        if (this.playerHealth <= 0 && this.computerHealth <= 0) {
            if (this.playerHealth === this.computerHealth) {
                this.playerHealth = 1;
                this.computerHealth = 1;
                message += " Both players reached the same negative HP! Each player receives 1 HP to continue the fight!";
            } else {
                if (this.playerHealth < this.computerHealth) {
                    this.playerHealth = 0;
                    this.computerHealth = 1;
                    message += ` You lose with ${this.playerHealth} HP vs Computer's ${this.computerHealth} HP!`;
                } else {
                    this.playerHealth = 1;
                    this.computerHealth = 0;
                    message += ` You win with ${this.playerHealth} HP vs Computer's ${this.computerHealth} HP!`;
                }
            }
        }
        
        this.updateLastMoveDisplay();
        this.showMessage(message);
        this.updateUI();

        if (this.isGameOver()) {
            this.gameOver = true;
            this.showGameOver();
        }
    }

    calculateDamage(attackerWeapon, defenderWeapon, attacker) {
        if (defenderWeapon === 6) return 0;

        switch (attackerWeapon) {
            case 1: // Magic Staff
                if (defenderWeapon === 4) {
                    this.brokenItems[attacker === 'player' ? 'computer' : 'player'].mirror = 2;
                    if (attacker === 'player') {
                        this.playerHealth -= 1;
                    } else {
                        this.computerHealth -= 1;
                    }
                    return 0;
                }
                return 2;
            case 2: // Sword
                if (defenderWeapon === 3) {
                    this.brokenItems[attacker === 'player' ? 'computer' : 'player'].shield = 2;
                    return 0;
                }
                return 1;
            case 5: // Black Hole
                return 2;
            default:
                return 0;
        }
    }

    updateBrokenItems() {
        ['player', 'computer'].forEach(player => {
            if (this.brokenItems[player].mirror > 0) this.brokenItems[player].mirror--;
            if (this.brokenItems[player].shield > 0) this.brokenItems[player].shield--;
        });
    }

    generateRoundMessage(playerWeapon, computerWeapon, playerDamage, computerDamage) {
        const weapons = {
            1: "Magic Staff",
            2: "Sword",
            3: "Shield",
            4: "Mirror",
            5: "Black Hole",
            6: "Crown"
        };

        let message = `You use ${weapons[playerWeapon]} vs Computer's ${weapons[computerWeapon]}. `;
        
        if (playerWeapon === 1 && computerWeapon === 4) {
            message += "The Mirror reflects 1 damage back to you! ";
        } else if (computerWeapon === 1 && playerWeapon === 4) {
            message += "Your Mirror reflects 1 damage back to the Computer! ";
        }

        if (playerDamage > 0) {
            message += `You deal ${playerDamage} damage. `;
        }
        if (computerDamage > 0) {
            message += `You take ${computerDamage} damage. `;
        }
        if (playerDamage === 0 && computerDamage === 0 && 
            !(playerWeapon === 1 && computerWeapon === 4) && 
            !(computerWeapon === 1 && playerWeapon === 4)) {
            message += "No damage is dealt. ";
        }

        return message;
    }

    updateUI() {
        document.getElementById('player-health').style.width = `${(this.playerHealth / this.maxHealth) * 100}%`;
        document.getElementById('player-health-text').textContent = `${this.playerHealth}/${this.maxHealth} HP`;
        document.getElementById('computer-health').style.width = `${(this.computerHealth / this.maxHealth) * 100}%`;
        document.getElementById('computer-health-text').textContent = `${this.computerHealth}/${this.maxHealth} HP`;

        document.getElementById('player-blackhole').textContent = `${this.playerBlackhole}/${this.maxBlackhole}`;
        document.getElementById('computer-blackhole').textContent = `${this.computerBlackhole}/${this.maxBlackhole}`;
        document.getElementById('player-crown').textContent = `${this.playerCrown}/${this.maxCrown}`;
        document.getElementById('computer-crown').textContent = `${this.computerCrown}/${this.maxCrown}`;

        document.querySelectorAll('.weapon-btn').forEach(button => {
            const weapon = parseInt(button.dataset.weapon);
            const isUsable = this.isWeaponUsable('player', weapon);
            button.disabled = !isUsable;
            button.classList.toggle('disabled', !isUsable);
        });
    }

    showMessage(message) {
        this.messageElement.classList.remove('animating', 'instant');
        void this.messageElement.offsetWidth;
        this.messageElement.textContent = message;
        this.messageElement.classList.add('animating');
        setTimeout(() => {
            if (this.messageElement.classList.contains('animating')) {
                this.messageElement.classList.remove('animating');
                this.messageElement.classList.add('instant');
            }
        }, 1500);
    }

    isGameOver() {
        return this.playerHealth <= 0 || this.computerHealth <= 0;
    }

    showGameOver() {
        let message;
        if (this.playerHealth <= 0 && this.computerHealth <= 0) {
            if (this.playerHealth < this.computerHealth) {
                message = "Computer wins with higher HP in negative values!";
            } else if (this.playerHealth > this.computerHealth) {
                message = "You win with higher HP in negative values!";
            } else {
                message = "It's a perfect tie! Both players continue with 1 HP!";
            }
        } else {
            const winner = this.playerHealth <= 0 ? "Computer" : "You";
            message = `${winner} won the game!`;
        }
        this.showMessage(message);
        document.getElementById('restart-btn').style.display = 'inline-block';
    }

    updateDifficultyDisplay() {
        const difficultyValue = document.querySelector('.difficulty-value');
        let difficultyText;
        let difficultyLevel;

        if (this.maxHealth === 3 && this.maxBlackhole === 2 && this.maxCrown === 1) {
            difficultyText = "Very Easy";
            difficultyLevel = "very-easy";
        } else if (this.maxHealth === 5 && this.maxBlackhole === 2 && this.maxCrown === 1) {
            difficultyText = "Easy";
            difficultyLevel = "easy";
        } else if (this.maxHealth === 7 && this.maxBlackhole === 2 && this.maxCrown === 1) {
            difficultyText = "Normal";
            difficultyLevel = "normal";
        } else if (this.maxHealth === 10 && this.maxBlackhole === 2 && this.maxCrown === 1) {
            difficultyText = "Hard";
            difficultyLevel = "hard";
        } else {
            difficultyText = `Custom (HP: ${this.maxHealth}, BH: ${this.maxBlackhole}, C: ${this.maxCrown})`;
            difficultyLevel = "custom";
        }

        difficultyValue.textContent = difficultyText;
        difficultyValue.dataset.difficulty = difficultyLevel;
    }

    updateLastMoveDisplay() {
        const playerLastMove = document.getElementById('player-last-move');
        const computerLastMove = document.getElementById('computer-last-move');

        if (this.lastPlayerWeapon) {
            playerLastMove.dataset.weapon = this.lastPlayerWeapon;
            playerLastMove.classList.remove('empty');
        } else {
            playerLastMove.removeAttribute('data-weapon');
            playerLastMove.classList.add('empty');
        }

        if (this.lastComputerWeapon) {
            computerLastMove.dataset.weapon = this.lastComputerWeapon;
            computerLastMove.classList.remove('empty');
        } else {
            computerLastMove.removeAttribute('data-weapon');
            computerLastMove.classList.add('empty');
        }
    }

    restartGame() {
        this.playerHealth = this.maxHealth;
        this.computerHealth = this.maxHealth;
        this.playerBlackhole = this.maxBlackhole;
        this.computerBlackhole = this.maxBlackhole;
        this.playerCrown = this.maxCrown;
        this.computerCrown = this.maxCrown;
        this.gameOver = false;
        this.lastPlayerWeapon = null;
        this.lastComputerWeapon = null;
        this.brokenItems = {
            player: { mirror: 0, shield: 0 },
            computer: { mirror: 0, shield: 0 }
        };
        document.getElementById('restart-btn').style.display = 'none';
        this.messageElement.classList.remove('animating', 'instant');
        this.showMessage('New game! Choose your weapon.');
        this.updateUI();
        this.updateLastMoveDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let currentGame = null;
    let selectedDifficulty = { hp: 7, blackhole: 2, crown: 1 }; // Default to Normal

    const difficultyOptions = document.querySelectorAll('.difficulty-option');
    const customDialog = document.getElementById('custom-dialog');
    const customConfirmBtn = document.getElementById('custom-confirm');
    const customCancelBtn = document.getElementById('custom-cancel');

    difficultyOptions.forEach(option => {
        option.addEventListener('click', () => {
            difficultyOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            if (option.dataset.difficulty === 'custom') {
                customDialog.style.display = 'flex';
            } else {
                selectedDifficulty = {
                    hp: parseInt(option.dataset.hp),
                    blackhole: 2,
                    crown: 1
                };
            }
        });
    });

    customConfirmBtn.addEventListener('click', () => {
        const hp = parseInt(document.getElementById('custom-hp').value);
        const blackhole = parseInt(document.getElementById('custom-blackhole').value);
        const crown = parseInt(document.getElementById('custom-crown').value);

        if (hp < 1 || hp > 50 || blackhole < 0 || blackhole > 5 || crown < 0 || crown > 3 || isNaN(hp) || isNaN(blackhole) || isNaN(crown)) {
            alert('Please enter valid values: HP (1-50), Black Hole (0-5), Crown (0-3)');
            return;
        }

        selectedDifficulty = { hp, blackhole, crown };
        customDialog.style.display = 'none';
    });

    customCancelBtn.addEventListener('click', () => {
        customDialog.style.display = 'none';
        difficultyOptions.forEach(opt => opt.classList.remove('selected'));
        const normalOption = Array.from(difficultyOptions).find(opt => opt.dataset.hp === '7');
        if (normalOption) {
            normalOption.classList.add('selected');
            selectedDifficulty = { hp: 7, blackhole: 2, crown: 1 };
        }
    });

    customDialog.addEventListener('click', (e) => {
        if (e.target === customDialog) {
            customDialog.style.display = 'none';
            difficultyOptions.forEach(opt => opt.classList.remove('selected'));
            const normalOption = Array.from(difficultyOptions).find(opt => opt.dataset.hp === '7');
            if (normalOption) {
                normalOption.classList.add('selected');
                selectedDifficulty = { hp: 7, blackhole: 2, crown: 1 };
            }
        }
    });

    document.getElementById('start-game').addEventListener('click', () => {
        document.getElementById('menu-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        currentGame = new MagicalFight(selectedDifficulty.hp, selectedDifficulty.blackhole, selectedDifficulty.crown);
    });

    const menuBtn = document.getElementById('menu-btn');
    const confirmationDialog = document.getElementById('confirmation-dialog');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');

    menuBtn.addEventListener('click', () => {
        if (!currentGame || currentGame.gameOver) {
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('menu-container').style.display = 'block';
            currentGame = null;
        } else {
            confirmationDialog.style.display = 'flex';
        }
    });

    confirmYesBtn.addEventListener('click', () => {
        confirmationDialog.style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('menu-container').style.display = 'block';
        currentGame = null;
    });

    confirmNoBtn.addEventListener('click', () => {
        confirmationDialog.style.display = 'none';
    });

    confirmationDialog.addEventListener('click', (e) => {
        if (e.target === confirmationDialog) {
            confirmationDialog.style.display = 'none';
        }
    });

    const rulesBtn = document.getElementById('rules-btn');
    const rulesDialog = document.getElementById('rules-dialog');
    const rulesCloseBtn = document.getElementById('rules-close');
    const rulesContent = document.getElementById('rules-content');

    const rulesMarkdown = `# Magical Fight

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
  - The Mirror breaks and cannot be used for 2 turns
  - The Staff user takes 1 HP reflection damage
  - No direct damage is dealt to the Mirror user
- When an item is destroyed, no direct damage is dealt that turn
- Broken items are automatically repaired after their 2-turn penalty
- A broken item cannot be used before being repaired

#### Negative HP and Ties
- When both players reach 0 or negative HP in the same turn:
  - If both have exactly the same negative HP (e.g., -2 vs -2), they each receive 1 HP and the fight continues
  - If they have different negative HP values (e.g., -1 vs -2), the player with the higher value (closer to 0) wins
  - Example 1: Player1 (-2 HP) vs Player2 (-1 HP) â�� Player2 wins
  - Example 2: Player1 (-3 HP) vs Player2 (-3 HP) â�� Both get 1 HP and continue
  - Example 3: Player1 (-1 HP) vs Player2 (-2 HP) â�� Player1 wins

The game continues until one of the players runs out of health points or has lower negative HP than their opponent. You can play as many times as you want!`;

    const convertMarkdownToHTML = (markdown) => {
        return markdown
            .replace(/^# (.*)$/gm, '<h1>$1</h1>')
            .replace(/^## (.*)$/gm, '<h2>$1</h2>')
            .replace(/^### (.*)$/gm, '<h3>$1</h3>')
            .replace(/^- (.*)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '<p>')
            .replace(/\n/g, '<br>')
            .replace(/<p><li>/g, '<ul><li>')
            .replace(/<\/li><p>/g, '</li></ul>')
            .replace(/<p><br>/g, '<p>');
    };

    rulesContent.innerHTML = convertMarkdownToHTML(rulesMarkdown);

    rulesBtn.addEventListener('click', () => {
        rulesDialog.style.display = 'flex';
    });

    rulesCloseBtn.addEventListener('click', () => {
        rulesDialog.style.display = 'none';
    });

    rulesDialog.addEventListener('click', (e) => {
        if (e.target === rulesDialog) {
            rulesDialog.style.display = 'none';
        }
    });

    document.getElementById('menu-container').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
});