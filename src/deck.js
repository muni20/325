const SUITS = ["&hearts;", "&diams;", "&spades;", "&clubs;"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const MAPVALUES = [14, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], removeCardsinDeck = []
// let _GameMode = GameMode.find(gameMode)

export default class Deck {
    constructor(cards = freshDeck()) {
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }

    removeCards() {
        this.loopDeleteCards()
        removeCardsinDeck.forEach((card) => {
            this.cards.forEach((deck) => {
                if (deck.suit === card.suit && deck.value === card.value) {
                    let index = this.cards.indexOf(deck)
                    this.cards.splice(index, 1)
                }
            })
        })
    }
    // this method selects cards for 3-2-5 to remove from deck when the deck is initilized
    loopDeleteCards() {
        for (let i = 2; i <= 6; i++) {
            removeCardsinDeck.push({ suit: "&hearts;", value: `${i}` })
        }
        for (let i = 2; i <= 6; i++) {
            removeCardsinDeck.push({ suit: "&spades;", value: `${i}` })
        }
        for (let i = 2; i <= 7; i++) {
            removeCardsinDeck.push({ suit: "&diams;", value: `${i}` })
        }
        for (let i = 2; i <= 7; i++) {
            removeCardsinDeck.push({ suit: "&clubs;", value: `${i}` })
        }
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
    constructor(suit, value,mapVal) {
        this.suit = suit
        this.value = value
        this.mapVal = mapVal
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
        return VALUES.map((value,index) => {
            return new Cards(suit, value, MAPVALUES['%d', index])
        })
    })
}