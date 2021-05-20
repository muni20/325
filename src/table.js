// const maxRounds = 10, maxPlayers = 3, GameMode = ["SinglePlayer", "Multiplayer"]

export default class Table {
    get maxRounds(){
        return 10
    }
    get maxPlayers(){
        return 3
    }
    get gameMode(){
        return ["SinglePlayer", "Multiplayer"]
    }
    constructor(trumpSuit, allPlayersSlots) {
        this.trumpSuit = trumpSuit
        this.allPlayersSlots = allPlayersSlots
    }
}
export class PlayerDeck {
    constructor(player, cards, handsToMake, playerSlot, handsWon) {

        this.player = player
        this.cards = cards
        this.handsToMake = handsToMake
        this.playerSlot = playerSlot
        this.handsWon = handsWon
    }
}
export class Round {
    constructor(currentPlayerTurn, roundWinner, cardsInPit, currentRoundSuit, currentRound) {
        
        this.currentPlayerTurn = currentPlayerTurn
        this.roundWinner = roundWinner
        this.cardsInPit = cardsInPit
        this.currentRoundSuit = currentRoundSuit
        this.currentRound = currentRound
    }
}