const SUITS = ["&hearts;", "&diams;", "&spades;", "&clubs;"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const maxRounds = 10, maxPlayers = 3, GameMode = ["SinglePlayer", "Multiplayer"]
        // let _GameMode = GameMode.find(gameMode)

export default class Deck {
    constructor(cards = freshDeck()) {
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }

    removeCards(deleteCards) {
        deleteCards.forEach((card) => {
            this.cards.forEach((deck) => {
                if (deck.suit === card.suit && deck.value === card.value) {
                    let index = this.cards.indexOf(deck)
                    this.cards.splice(index, 1)
                }
            })
        })
    }

    shuffle() {
        for (let i = this.numberOfCards - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }

    dispense(firstParam, secondParam) {
        return this.cards.splice(firstParam, secondParam)
    }
}

class Cards {
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }

    get color() {
        return this.suit === "&spades;" || this.suit === "&clubs;" ? "black" : "red"
    }

    getHTML() {
        const cardDiv = document.createElement('div')
        cardDiv.innerHTML = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value = `${this.value} ${this.suit}`
        return cardDiv
    }
}

function freshDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Cards(suit, value)
        })
    })
}
export class Table {
    constructor(trumpSuit, gameMode, allPlayersSlots) {
        // declaring as constant as this should never change while playing game
        
        this.maxRounds = maxRounds
        this.maxPlayers = maxPlayers
        this.trumpSuit = trumpSuit
        this.gameMode = _GameMode
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