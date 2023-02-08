function getRandomValue(min, max) {
  // MIN + rand() * (MAX - MIN)
  return Math.floor(Math.random() * (max - min)) + min;
}

Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      roundCount: 0,
      healCooldown: 0,
      specialAttackCooldown: 0,
      log: [],
      winner: null,
    };
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },

    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },

  methods: {
    playerAttack() {
      const damageValue = getRandomValue(5, 12);
      this.monsterHealth =
        this.monsterHealth - damageValue < 0
          ? 0
          : this.monsterHealth - damageValue;

      this.addLog("player", "attack", damageValue);
      this.monsterAttack();
      this.roundCount++;

      this.healCooldown = this.healCooldown > 0 ? this.healCooldown - 1 : 0;
      this.specialAttackCooldown =
        this.specialAttackCooldown > 0 ? this.specialAttackCooldown - 1 : 0;
    },

    playerSpecialAttack() {
      const damageValue = getRandomValue(10, 18);
      this.monsterHealth =
        this.monsterHealth - damageValue < 0
          ? 0
          : this.monsterHealth - damageValue;

      this.addLog("player", "attack", damageValue);
      this.monsterAttack();

      this.specialAttackCooldown = 3;
      this.roundCount++;

      this.healCooldown = this.healCooldown > 0 ? this.healCooldown - 1 : 0;
    },

    healPlayer() {
      const healValue = getRandomValue(15, 25);
      this.playerHealth =
        this.playerHealth + healValue > 100
          ? 100
          : this.playerHealth + healValue;

      this.addLog("player", "heal", healValue);
      this.monsterAttack();

      this.healCooldown = 5;
      this.roundCount++;

      this.specialAttackCooldown =
        this.specialAttackCooldown > 0 ? this.specialAttackCooldown - 1 : 0;
    },

    monsterAttack() {
      const damageValue = getRandomValue(8, 15);
      this.playerHealth =
        this.playerHealth - damageValue < 0
          ? 0
          : this.playerHealth - damageValue;

      this.addLog("monster", "attack", damageValue);
    },

    startNewGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.roundCount = 0;
      this.healCooldown = 0;
      this.specialAttackCooldown = 0;
      this.log = [];
      this.winner = null;
    },

    surrender() {
      this.winner = "monster";
    },

    addLog(actor, action, value) {
      this.log.unshift({
        who: actor,
        what: action,
        val: value,
      });
    },
  },

  computed: {
    getMonsterHealthValue() {
      return { width: this.monsterHealth + "%" };
    },

    getPlayerHealthValue() {
      return { width: this.playerHealth + "%" };
    },

    specialAttackCooldownCheck() {
      return this.specialAttackCooldown !== 0;
    },

    healCooldownCheck() {
      return this.healCooldown !== 0;
    },
  },
}).mount("#game");
