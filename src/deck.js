const SUITS = ["&hearts;", "&diams;", "&spades;", "&clubs;"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

export default class Deck {
    constructor(cards = freshDeck()) {
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }

    removeCards(deleteCards){
        deleteCards.forEach((card) => {
                this.cards.forEach((deck) => {
                if(deck.suit === card.suit && deck.value === card.value){
                    let index = this.cards.indexOf(deck)
                    this.cards.splice(index,1)
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

    dispense(firstParam,secondParam){
        return this.cards.splice(firstParam,secondParam)
    }
}

class cards {
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }

    get color(){
        return this.suit === "&spades;" || this.suit === "&clubs;" ? "black" : "red"
    }
    
    getHTML(){
        const cardDiv = document.createElement('div')
        cardDiv.innerHTML = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value=`${this.value} ${this.suit}`
        return cardDiv
    }
}

function freshDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new cards(suit, value)
        })
    })
}