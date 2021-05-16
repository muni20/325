import Deck from "./deck.js"
import Table from "./deck.js"
import PlayerDeck from "./deck.js"
import Round from "./deck.js"

FBInstant.initializeAsync()
    .then(function () {
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
    //All global Variables Goes Here
    const removeCardsinDeck = []
    let player2Deck, selectATrump, selectedTrump,
        p1 = [{ 'cards': [] }], p2 = [{ 'cards': [] }], p3 = [{ 'cards': [] }],
        gameMode = "singlePlayer", playerNum = 0, ready = false, enemyReady = false, currentTurnSuit,
        player1DeckCardIndex, player2DeckCardIndex, player3DeckCardIndex, tablePitLength
    const deck = new Deck()
    const CARD_VALUE_MAP = {"6": 6,"7": 7,"8": 8,"9": 9,"10": 10,"J": 11,"Q": 12,"K": 13,"A": 14}

    //All Game Logic variable, like table created cards dispensed to players
    let isGameOver = false, currentPlayer = 'PlayerOne', goTurn = 'PlayerOne', FirstGo = '', circleTurn,
        roundCount = 1, _dragStart, playerDetails = [
            { player: '', Go: 0, Deck: [], Turn: true },
            { player: '', Go: 1, Deck: [], Turn: false },
            { player: '', Go: 2, Deck: [], Turn: false }
        ],
        thisTurnPit = [
            // { player: '', card: { suit: null, value: null, cardValue: null } },
            // { player: '', card: { suit: null, value: null, cardValue: null } },
            // { player: '', card: { suit: null, value: null, cardValue: null } }
        ],playerObj = {}, cardObj={card:{}}
    window.addEventListener('DOMContentLoaded', () => {
        startGame()
    })
    function startGame() {
        const table = new Table()
        table.gameMode = 'Singlelayer'
        // table.maxRounds = 9
        table.test = 'muni'
        console.log(table.gameMode,table.maxRounds)
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
        let div1,div2,div3
        player1SlotDeck.innerText = playerDetails[0].Deck.numberOfCards
        p1.cards.forEach((e) => {
            div1 = document.createElement('div')
            div1.classList.add('card', e.suit === "&hearts;" || e.suit === "&diams;" ? "red" : "black")
            div1.dataset.suit = `${e.suit}`
            div1.dataset.value = `${e.value}`
            div1.innerHTML = `${e.suit}`
            div1.dataset.id = `${playerDetails[0].player}`
            if (playerDetails[0].player === 'playerOne') div1.setAttribute("draggable", "true")

            player1Hand.appendChild(div1)
            // console.log(playerDetails[0].Deck,p1)
            
        })
        computer2SlotDeck.innerHTML = playerDetails[1].Deck.numberOfCards
        p2.cards.forEach((e) => {
            div2 = document.createElement('div')
            div2.classList.add('card', e.suit === "&hearts;" || e.suit === "&diams;" ? "red" : "black")
            div2.dataset.suit = `${e.suit}`
            div2.dataset.value = `${e.value}`
            div2.innerHTML = `${e.suit}`
            div2.dataset.id = `${playerDetails[1].player}`
            // if (playerDetails[1].player === 'playerOne') div2.setAttribute("draggable", "true")
            computer1Hand.appendChild(div2)
        })
        computer1SlotDeck.innerText = playerDetails[2].Deck.numberOfCards
        p3.cards.forEach((e) => {
            div3 = document.createElement('div')
            div3.classList.add('card', e.suit === "&hearts;" || e.suit === "&diams;" ? "red" : "black")
            div3.dataset.suit = `${e.suit}`
            div3.dataset.value = `${e.value}`
            div3.innerHTML = `${e.suit}`
            div3.dataset.id = `${playerDetails[2].player}`
            // if (playerDetails[2].player === 'playerOne') div3.setAttribute("draggable", "true")
            computer2Hand.appendChild(div3)
        })
        if (playerDetails[0].Deck.numberOfCards === 10 &&
            playerDetails[1].Deck.numberOfCards === 10 && 
            playerDetails[2].Deck.numberOfCards === 10) createTable()
    }

    //move and throw the cards in table pit load all animations in this function
    function createTable() {
        round()
    }
    //move and throw the cards in table pit --------------ENDS------------->
    function round() {
        // if(roundCount<=10) await gameLogic(), roundCount++
        // else isGameOver = true

        // let roundPromise = new Promise((resolve, reject) => {
        //     if (roundCount === 10) resolve()
        //     else reject()
        // })
        // roundPromise.then(() => {
        //     isGameOver = true
        //     console.log('Game Over')

        // }).catch(() => {
        //     gameLogic()
        // })
        console.log(Table)

        gameLogic()
    }

    //Game Logic
    function gameLogic() {
        //create a wheel cycle by which game will be played and make a logic for suit checker and play that suit only
        if (isGameOver) return
        let player1HandDiv = player1Hand.querySelectorAll(`[data-id='playerOne']`)
        let player2HandDiv = player1Hand.querySelectorAll(`[data-id='AI1']`)
        let player3HandDiv = player1Hand.querySelectorAll(`[data-id='AI2']`)


        player1HandDiv.forEach(c => c.addEventListener('dragstart', dragStart))
        player2HandDiv.forEach(c => c.addEventListener('dragstart', dragStart))
        player3HandDiv.forEach(c => c.addEventListener('dragstart', dragStart))

        _dragStart = tablePit.addEventListener('dragstart', dragStart)
        tablePit.addEventListener('dragover', dragOver)
        tablePit.addEventListener('dragenter', dragEnter)
        tablePit.addEventListener('drop', dragDrop)
        tablePit.addEventListener('dragend', dragEnd)

        function dragStart() {
            if (playerDetails[0].Turn) player1DeckCardIndex = this
            if (playerDetails[1].Turn) player2DeckCardIndex = this,console.log('dragged AI1')
            if (playerDetails[2].Turn) player3DeckCardIndex = this
        }
        function dragOver(e) {
            e.preventDefault()
        }
        function dragEnter(e) {
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
                console.log(tablePit)
            }

        })

        // if (true) {
        //     roundWinner(cardOne, cardTwo, cardThree)
        // }
    }
    // Next turn loops two times stop fix that
    function nextTurn() {
        // make a turn wheel system to calculate who will go next

        if (tablePitLength >= 2) {
            roundCount++
            console.log('hit', tablePit.querySelectorAll('div').length)
            roundWinner(thisTurnPit[0].card.value, thisTurnPit[1].card.value, thisTurnPit[2].card.value)
            return
        }
        if (playerDetails[0].Turn) {
            // console.log("player hit")
            turnDisplay.innerText = 'Your Turn' + ` ${roundCount}`
            playerTurn(playerDetails[0].player, playerDetails[0].Go)
        }
        if (playerDetails[1].Turn) {
            // console.log(`${playerDetails[1].player} hit`)
            turnDisplay.innerText = 'AI 1 Turn' + ` ${roundCount}`
            computerTurn(playerDetails[1].player, playerDetails[1].Go)
        }
        if (playerDetails[2].Turn) {
            // console.log(`${playerDetails[2].player} hit`)
            turnDisplay.innerText = 'AI 2 Turn' + ` ${roundCount}`
            computerTurn(playerDetails[2].player, playerDetails[2].Go)
        }
    }
    function playerTurn(player, index) {
        // Logic for throwing cards in pit and splicing card from hand
        throwCardsInPit(player, index, player1DeckCardIndex)
        // console.log("from playerOne", player1DeckCardIndex)
        playerDetails[0].Turn = false
        playerDetails[1].Turn = true
    }

    function computerTurn(player, index) {
        if (player === 'AI1') {
            //write a function for AI1 to play card
            playerDetails[1].Turn = false
            playerDetails[2].Turn = true
            AIPlayer(player, playerDetails[1].Deck, index, document.querySelectorAll('[data-id="AI1"]'), player2DeckCardIndex)
        }
        if (player === 'AI2') {
            //write a function for AI2 to play card
            playerDetails[0].Turn = true
            playerDetails[2].Turn = false
            AIPlayer(player, playerDetails[2].Deck, index, document.querySelectorAll('[data-id="AI2"]'), player3DeckCardIndex)
        }

    }
    function AIPlayer(player, deck, index, div, playerDeckIndex) {

        let aiCard = div[0],
            cardsInPit = thisTurnPit.filter(i => i.player !== '').length
        // console.log(playerDeckIndex)
        let maxVal = []
        // thisTurnPit.forEach((c) => {
        //     maxVal.push(c.card.cardValue)
        //     c.card.suit
        // })
        // tablePit.dispatchEvent(_dragStart)
        playerDeckIndex = aiCard
        tablePit.append(aiCard)
        
        // console.log(playerDetails[1])
        throwCardsInPit(player, index, playerDeckIndex)
    }
    // function DragDropAI(eventName, element, data) {
    //     'use strict';
    //     var event;
    //     data = data || {}
    //     if (document.createEvent) {
    //         event = document.createEvent("HTMLEvents")
    //         event.initEvent(eventName, true, true)
    //     } else {
    //         event = document.createEventObject()
    //         event.eventType = eventName
    //     }

    //     event.eventName = eventName
    //     // event = $.extend(event, data)

    //     if (document.createEvent) {
    //         element.dispatchEvent(event)
    //     } else {
    //         element.fireEvent("on" + event.eventType, event)
    //     }
    // }
//Looping two times thats y its give a null reference error
    function throwCardsInPit(player, index, playerDeckIndex) {
        let lks = playerDetails[index].Deck.cards.filter(e => e.suit === playerDeckIndex.dataset.suit && e.value === playerDeckIndex.dataset.value)
        console.log(lks)

        playerObj['player'] = player
        cardObj.card['suit'] = lks[0].suit
        cardObj.card['value'] = lks[0].value
        cardObj.card['cardValue'] = CARD_VALUE_MAP[lks[0].value]
        thisTurnPit.push(playerObj,cardObj)
        console.log(thisTurnPit)
        // thisTurnPit[index].push.card.value = lks[0].value
        // thisTurnPit[index].push.card.cardValue = CARD_VALUE_MAP[lks[0].value]
        playerDetails[index].Deck.cards.splice(lks, 1)
        tablePitLength = thisTurnPit.length
        console.log(tablePitLength ,thisTurnPit)
    }
    function roundWinner(cardOne, cardTwo, cardThree) {
        return Math.max(CARD_VALUE_MAP[cardOne], CARD_VALUE_MAP[cardTwo], CARD_VALUE_MAP[cardThree])
    }
})