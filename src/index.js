import Deck from "./deck.js"
import openSocket from 'socket.io'
FBInstant.initializeAsync()
.then(function(){
    console.log("loaded")
})
document.addEventListener("DOMContentLoaded", () => {
    //All global querySelector Goes here

    const player1SlotDeck = document.querySelector('.player-one-deck')
    const computer1SlotDeck = document.querySelector('.computer-one-deck')
    const computer2SlotDeck = document.querySelector('.computer-two-deck')
    const player1Hand = document.querySelector('.player-one-hand')
    const computer1Hand = document.querySelector('.computer-one-hand')
    const computer2Hand = document.querySelector('.computer-two-hand')
    const trumpDiv = document.querySelector('.trump')
    const turnDisplay = document.querySelector('.turn-display')
    const tablePit = document.querySelector('.table-pit')
    let sad = true
    //All global Variables Goes Here
    const removeCardsinDeck = []
    let player2Deck, selectATrump, selectedTrump,
        p1 = [{ 'cards': [] }], p2 = [{ 'cards': [] }], p3 = [{ 'cards': [] }],
        gameMode = "singlePlayer", playerNum = 0, ready = false, enemyReady = false, currentTurnSuit,
        player1DeckCardIndex,player2DeckCardIndex, player3DeckCardIndex
    const deck = new Deck()
    const CARD_VALUE_MAP = {
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "10": 10,
        "J": 11,
        "Q": 12,
        "K": 13,
        "A": 14,
    }

    //All Game Logic variable, like table created cards dispensed to players
    let isGameOver = false, currentPlayer = 'PlayerOne', goTurn = 'PlayerOne', FirstGo = '', circleTurn,
        roundCount = 1, playerDetails = [
            { player: '', Go: 1, Deck: [], Turn: true },
            { player: '', Go: 2, Deck: [], Turn: false },
            { player: '', Go: 3, Deck: [], Turn: false }
        ],
        thisTurnPit = [{ player: '', card: { suit: null, value: null } }]

    startGame()
    function startGame() {
        loopDeleteCards(removeCardsinDeck)
        deck.removeCards(removeCardsinDeck)
        deck.shuffle()
        cleanBeforeRound()
    }

    // this function selects cards for 3-2-5 to remove from deck
    function loopDeleteCards() {
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

    function cleanBeforeRound() {
        if (gameMode = "singlePlayer") {
            playerDetails[0].player = "playerOne"
            playerDetails[1].player = "AI1"
            playerDetails[2].player = "AI2"
            firstDispense()
        }
        if (gameMode = 'MultiPlayer') {
            const socket = io();
            //Get your Player Number
            socket.on('player-number', num => {
                if (num === -1) infoDisplay.innerHTML = 'Sorry, all tables are full'
                else {
                    playerNum = parseInt(num)
                    if (playerNum === 1) currentPlayer = "enemy"
                    console.log(playerNum)
                }
            })
            // Another player has connected or disconnected
            socket.on('player-connection', num => {
                console.log(`player number ${num} has connected or disconnected`)
            })
        }
    }

    // create a 3 decks of 5 and wait for selecting trump card
    function firstDispense() {

        // playerDetails[0].player = playerType1
        playerDetails[0].Deck = new Deck(deck.dispense(0, 5))

        // playerDetails[1].player = playerType2
        playerDetails[1].Deck = new Deck(deck.dispense(0, 5))

        // playerDetails[2].player = playerType3
        playerDetails[2].Deck = new Deck(deck.dispense(0, 5))

        updateNumberOfCards(playerDetails[0].Deck, playerDetails[1].Deck, playerDetails[2].Deck)

        player1Hand.addEventListener("click", function _listner(e) {
            Trump(e.target.dataset.suit)

            let waitTrump = new Promise((resolve, reject) => {
                if (selectedTrump !== undefined) {
                    resolve()
                } else {
                    reject("Error while dispensing more cards")
                }
            })

            waitTrump.then(() => {
                // player1Hand.removeEventListener("click", _listner, false)
                dispenseThree()
            }).catch((message) => {
                console.log(message)
            })
        }, { once: true })
    }

    function Trump(e) {
        let allCardsInHand = [];
        playerDetails[0].Deck.cards.forEach((e) => {
            allCardsInHand.push(e.suit)
        })
        selectATrump = [...new Set(allCardsInHand)]
        selectedTrump = selectATrump.find(el => el === e)
        trumpDiv.classList.add(selectedTrump === "&hearts;" || selectedTrump === "&diams;" ? "red" : "black")
        trumpDiv.innerHTML = selectedTrump
    }

    // create a 3 decks of 5 and wait for selecting trump card
    function dispenseThree() {
        deck.dispense(0, 3).forEach((e) => {
            playerDetails[0].Deck.cards.push(e)
            p1[0].cards.push(e)
        })
        deck.dispense(0, 3).forEach((e) => {
            playerDetails[1].Deck.cards.push(e)
            p2[0].cards.push(e)
        })
        deck.dispense(0, 3).forEach((e) => {
            playerDetails[2].Deck.cards.push(e)
            p3[0].cards.push(e)
        })
        updateNumberOfCards(p1[0], p2[0], p3[0])
        p1 = [{ 'cards': [] }], p2 = [{ 'cards': [] }], p3 = [{ 'cards': [] }]
        dispenseTwo()
    }

    function dispenseTwo() {
        deck.dispense(0, 2).forEach((e) => {
            playerDetails[0].Deck.cards.push(e)
            p1[0].cards.push(e)
        })
        deck.dispense(0, 2).forEach((e) => {
            playerDetails[1].Deck.cards.push(e)
            p2[0].cards.push(e)
        })
        deck.dispense(0, 2).forEach((e) => {
            playerDetails[2].Deck.cards.push(e)
            p3[0].cards.push(e)
        })
        updateNumberOfCards(p1[0], p2[0], p3[0])
        p1 = [{ 'cards': [] }], p2 = [{ 'cards': [] }], p3 = [{ 'cards': [] }]
    }

    function updateNumberOfCards(p1, p2, p3) {
        let div;
        player1SlotDeck.innerText = playerDetails[0].Deck.numberOfCards
        p1.cards.forEach((e) => {
            div = document.createElement('div')
            div.classList.add('card', e.suit === "&hearts;" || e.suit === "&diams;" ? "red" : "black")
            div.dataset.suit = `${e.suit}`
            div.dataset.value = `${e.value}`
            div.innerHTML = `${e.suit}`
            div.dataset.id = `${playerDetails[0].player}`
            if (playerDetails[0].player === 'playerOne') div.setAttribute("draggable", "true")

            player1Hand.appendChild(div)
        })
        computer2SlotDeck.innerHTML = playerDetails[1].Deck.numberOfCards
        p2.cards.forEach((e) => {
            div = document.createElement('div')
            div.classList.add('card', e.suit === "&hearts;" || e.suit === "&diams;" ? "red" : "black")
            div.dataset.suit = `${e.suit}`
            div.dataset.value = `${e.value}`
            div.innerHTML = `${e.suit}`
            div.dataset.id = `${playerDetails[1].player}`
            if (playerDetails[1].player === 'playerOne') div.setAttribute("draggable", "true")
            computer1Hand.appendChild(div)
        })
        computer1SlotDeck.innerText = playerDetails[2].Deck.numberOfCards
        p3.cards.forEach((e) => {
            div = document.createElement('div')
            div.classList.add('card', e.suit === "&hearts;" || e.suit === "&diams;" ? "red" : "black")
            div.dataset.suit = `${e.suit}`
            div.dataset.value = `${e.value}`
            div.innerHTML = `${e.suit}`
            div.dataset.id = `${playerDetails[2].player}`
            if (playerDetails[2].player === 'playerOne') div.setAttribute("draggable", "true")
            computer2Hand.appendChild(div)
        })
        if (playerDetails[0].Deck.numberOfCards === 10 &&
            playerDetails[1].Deck.numberOfCards === 10 && playerDetails[2].Deck.numberOfCards === 10) createTable()
    }

    //move and throw the cards in table pit load all animations in this function
    function createTable() {
        round()
    }
    //move and throw the cards in table pit --------------ENDS------------->
    function round() {
        // if(roundCount<=10) await gameLogic(), roundCount++
        // else isGameOver = true

        let roundPromise = new Promise((resolve, reject) => {
            if (roundCount === 10) resolve()
            else reject()
        })
        roundPromise.then(() => {
            isGameOver = true
            console.log('Game Over')

        }).catch(() => {
            gameLogic()
        })
        // gameLogic()
    }

    //Game Logic
    function gameLogic() {
        //create a wheel cycle by which game will be played and make a logic for suit checker and play that suit only
        if (isGameOver) return
        let player1HandDiv = player1Hand.querySelectorAll(`[data-id='playerOne']`)

        player1HandDiv.forEach(c => c.addEventListener('dragstart', dragStart))
        tablePit.addEventListener('dragstart', dragStart)
        tablePit.addEventListener('dragover', dragOver)
        tablePit.addEventListener('dragenter', dragEnter)
        tablePit.addEventListener('drop', dragDrop)
        tablePit.addEventListener('dragend', dragEnd)

        function dragStart() {
            if (playerDetails[0].Turn) player1DeckCardIndex = this
        }
        function dragOver(e) {
            e.preventDefault()
        }
        function dragEnter(e) {
            e.preventDefault()
        }
        function dragDrop(e) {
            if (playerDetails.filter(e => e.Go === 1)[0].Go === 1) {
                currentTurnSuit = player1DeckCardIndex.dataset.suit
                this.appendChild(player1DeckCardIndex)
            }
        }
        function dragEnd() {
        }
        // Listen for card addition in pit
        tablePit.addEventListener('DOMNodeInserted', (e) => {
            // console.log(tablePit.querySelectorAll('div').length >= 1, !roundCount <= 10)
            // if (tablePit.querySelectorAll('div').length <= 3 && !roundCount <= 10) round()
            // Remove the above if satement and replace it, add logic when card added get player id,
            // get turn play the game in array for better security
            if (playerDetails.filter(e => e.Turn === true)[0].player === e.target.dataset.id) {
                nextTurn()
            }

        })

        // if (true) {
        //     roundWinner(cardOne, cardTwo, cardThree)
        // }
    }
    function nextTurn() {
        let currentPlayerTurnFilter = playerDetails.filter(e => e.Go === 1),
            currentPlayerTurn

        if (currentPlayerTurn === 1) {
        }
        if (tablePit.querySelectorAll('div').length === 3) {
            roundCount++
            return
        }
        if (playerDetails[0].Turn) {
            // console.log("player hit")
            turnDisplay.innerText = 'Your Turn' + ` ${roundCount}`
            playerTurn()
        }
        if (playerDetails[1].Turn) {
            // console.log(`${playerDetails[1].player} hit`)
            turnDisplay.innerText = 'AI 1 Turn' + ` ${roundCount}`
            computerTurn(playerDetails[1].player)
        }
        if (playerDetails[2].Turn) {
            // console.log(`${playerDetails[2].player} hit`)
            turnDisplay.innerText = 'AI 2 Turn' + ` ${roundCount}`
            computerTurn(playerDetails[2].player)
        }
    }
    function playerTurn() {
        let lks=playerDetails[0].Deck.cards.filter(e => e.suit === player1DeckCardIndex.dataset.suit && e.value === player1DeckCardIndex.dataset.value)
        thisTurnPit[0].player = 'playerOne'
        thisTurnPit[0].card.suit = lks[0].suit
        thisTurnPit[0].card.value = lks[0].value
        playerDetails[0].Deck.cards.splice(lks,1)
        console.log(thisTurnPit)
        playerDetails[0].Turn = false
        playerDetails[1].Turn = true
        // if (sad) {
        //     sad = false
        //     nextTurn()
        // }
    }

    function computerTurn(e) {
        if (e === 'AI1') {
            //write a function for AI1 to play card
            AIPlayer(playerDetails[1].Deck)
            playerDetails[1].Turn = false
            playerDetails[2].Turn = true
        }
        if (e === 'AI2') {
            //write a function for AI2 to play card
            AIPlayer(playerDetails[2].Deck)
            playerDetails[0].Turn = true
            playerDetails[2].Turn = false
            turnDisplay.innerText = 'Your Turn' + ` ${roundCount}`
        }

    }
    function AIPlayer(e) {

        let tableSuit = [], tableValue = [], cardToPlay
        let cardsInPit
        let maxVal
        thisTurnPit.forEach((c) => {
            maxVal = Math.max(CARD_VALUE_MAP[c.card.value])
            c.card.suit
        })
        // let cardValueChecker = e.filter(m => m.suit === tableSuit[0]).forEach((z) => {
        //     let test = Math.max(CARD_VALUE_MAP[z.value], CARD_VALUE_MAP[tableValue])
        // })
        console.log("hit AIPlayer")
    }

    function roundWinner(cardOne, cardTwo, cardThree) {
        return Math.max(CARD_VALUE_MAP[cardOne], CARD_VALUE_MAP[cardTwo], CARD_VALUE_MAP[cardThree])
    }
})