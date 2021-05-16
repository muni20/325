(()=>{"use strict";const e=["&hearts;","&diams;","&spades;","&clubs;"],t=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];class r{constructor(e=s()){this.cards=e}get numberOfCards(){return this.cards.length}removeCards(e){e.forEach((e=>{this.cards.forEach((t=>{if(t.suit===e.suit&&t.value===e.value){let e=this.cards.indexOf(t);this.cards.splice(e,1)}}))}))}shuffle(){for(let e=this.numberOfCards-1;e>0;e--){const t=Math.floor(Math.random()*(e+1)),r=this.cards[t];this.cards[t]=this.cards[e],this.cards[e]=r}}dispense(e,t){return this.cards.splice(e,t)}}class a{constructor(e,t){this.suit=e,this.value=t}get color(){return"&spades;"===this.suit||"&clubs;"===this.suit?"black":"red"}getHTML(){const e=document.createElement("div");return e.innerHTML=this.suit,e.classList.add("card",this.color),e.dataset.value=`${this.value} ${this.suit}`,e}}function s(){return e.flatMap((e=>t.map((t=>new a(e,t)))))}FBInstant.initializeAsync().then((function(){console.log("loaded")})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".player-one-deck"),t=document.querySelector(".computer-one-deck"),a=document.querySelector(".computer-two-deck"),s=document.querySelector(".player-one-hand"),n=document.querySelector(".computer-one-hand"),c=document.querySelector(".computer-two-hand"),d=document.querySelector(".trump"),u=document.querySelector(".turn-display"),i=document.querySelector(".table-pit"),l=[];let o,p,h,f,m=[{cards:[]}],y=[{cards:[]}],v=[{cards:[]}],k="singlePlayer",T=0;const D=new r,g={6:6,7:7,8:8,9:9,10:10,J:11,Q:12,K:13,A:14};let E=!1,b="PlayerOne",L=1,$=[{player:"",Go:1,Deck:[],Turn:!0},{player:"",Go:2,Deck:[],Turn:!1},{player:"",Go:3,Deck:[],Turn:!1}],O=[{player:"",card:{suit:null,value:null}}];function A(r,d,l){let o;e.innerText=$[0].Deck.numberOfCards,r.cards.forEach((e=>{o=document.createElement("div"),o.classList.add("card","&hearts;"===e.suit||"&diams;"===e.suit?"red":"black"),o.dataset.suit=`${e.suit}`,o.dataset.value=`${e.value}`,o.innerHTML=`${e.suit}`,o.dataset.id=`${$[0].player}`,"playerOne"===$[0].player&&o.setAttribute("draggable","true"),s.appendChild(o)})),a.innerHTML=$[1].Deck.numberOfCards,d.cards.forEach((e=>{o=document.createElement("div"),o.classList.add("card","&hearts;"===e.suit||"&diams;"===e.suit?"red":"black"),o.dataset.suit=`${e.suit}`,o.dataset.value=`${e.value}`,o.innerHTML=`${e.suit}`,o.dataset.id=`${$[1].player}`,"playerOne"===$[1].player&&o.setAttribute("draggable","true"),n.appendChild(o)})),t.innerText=$[2].Deck.numberOfCards,l.cards.forEach((e=>{o=document.createElement("div"),o.classList.add("card","&hearts;"===e.suit||"&diams;"===e.suit?"red":"black"),o.dataset.suit=`${e.suit}`,o.dataset.value=`${e.value}`,o.innerHTML=`${e.suit}`,o.dataset.id=`${$[2].player}`,"playerOne"===$[2].player&&o.setAttribute("draggable","true"),c.appendChild(o)})),10===$[0].Deck.numberOfCards&&10===$[1].Deck.numberOfCards&&10===$[2].Deck.numberOfCards&&new Promise(((e,t)=>{10===L?e():t()})).then((()=>{E=!0,console.log("Game Over")})).catch((()=>{!function(){function e(){$[0].Turn&&(f=this)}E||(s.querySelectorAll("[data-id='playerOne']").forEach((t=>t.addEventListener("dragstart",e))),i.addEventListener("dragstart",e),i.addEventListener("dragover",(function(e){e.preventDefault()})),i.addEventListener("dragenter",(function(e){e.preventDefault()})),i.addEventListener("drop",(function(e){1===$.filter((e=>1===e.Go))[0].Go&&(h=f.dataset.suit,this.appendChild(f))})),i.addEventListener("dragend",(function(){})),i.addEventListener("DOMNodeInserted",(e=>{$.filter((e=>!0===e.Turn))[0].player===e.target.dataset.id&&($.filter((e=>1===e.Go)),3!==i.querySelectorAll("div").length?($[0].Turn&&(u.innerText=`Your Turn ${L}`,function(){let e=$[0].Deck.cards.filter((e=>e.suit===f.dataset.suit&&e.value===f.dataset.value));O[0].player="playerOne",O[0].card.suit=e[0].suit,O[0].card.value=e[0].value,$[0].Deck.cards.splice(e,1),console.log(O),$[0].Turn=!1,$[1].Turn=!0}()),$[1].Turn&&(u.innerText=`AI 1 Turn ${L}`,C($[1].player)),$[2].Turn&&(u.innerText=`AI 2 Turn ${L}`,C($[2].player))):L++)})))}()}))}function C(e){"AI1"===e&&(M($[1].Deck),$[1].Turn=!1,$[2].Turn=!0),"AI2"===e&&(M($[2].Deck),$[0].Turn=!0,$[2].Turn=!1,u.innerText=`Your Turn ${L}`)}function M(e){let t;O.forEach((e=>{t=Math.max(g[e.card.value]),e.card.suit})),console.log("hit AIPlayer")}(function(){for(let e=2;e<=6;e++)l.push({suit:"&hearts;",value:`${e}`});for(let e=2;e<=6;e++)l.push({suit:"&spades;",value:`${e}`});for(let e=2;e<=7;e++)l.push({suit:"&diams;",value:`${e}`});for(let e=2;e<=7;e++)l.push({suit:"&clubs;",value:`${e}`})})(),D.removeCards(l),D.shuffle(),function(){if((k="singlePlayer")&&($[0].player="playerOne",$[1].player="AI1",$[2].player="AI2",$[0].Deck=new r(D.dispense(0,5)),$[1].Deck=new r(D.dispense(0,5)),$[2].Deck=new r(D.dispense(0,5)),A($[0].Deck,$[1].Deck,$[2].Deck),s.addEventListener("click",(function(e){!function(e){let t=[];$[0].Deck.cards.forEach((e=>{t.push(e.suit)})),o=[...new Set(t)],p=o.find((t=>t===e)),d.classList.add("&hearts;"===p||"&diams;"===p?"red":"black"),d.innerHTML=p}(e.target.dataset.suit),new Promise(((e,t)=>{void 0!==p?e():t("Error while dispensing more cards")})).then((()=>{D.dispense(0,3).forEach((e=>{$[0].Deck.cards.push(e),m[0].cards.push(e)})),D.dispense(0,3).forEach((e=>{$[1].Deck.cards.push(e),y[0].cards.push(e)})),D.dispense(0,3).forEach((e=>{$[2].Deck.cards.push(e),v[0].cards.push(e)})),A(m[0],y[0],v[0]),m=[{cards:[]}],y=[{cards:[]}],v=[{cards:[]}],D.dispense(0,2).forEach((e=>{$[0].Deck.cards.push(e),m[0].cards.push(e)})),D.dispense(0,2).forEach((e=>{$[1].Deck.cards.push(e),y[0].cards.push(e)})),D.dispense(0,2).forEach((e=>{$[2].Deck.cards.push(e),v[0].cards.push(e)})),A(m[0],y[0],v[0]),m=[{cards:[]}],y=[{cards:[]}],v=[{cards:[]}]})).catch((e=>{console.log(e)}))}),{once:!0})),k="MultiPlayer"){const e=io();e.on("player-number",(e=>{-1===e?infoDisplay.innerHTML="Sorry, all tables are full":(T=parseInt(e),1===T&&(b="enemy"),console.log(T))})),e.on("player-connection",(e=>{console.log(`player number ${e} has connected or disconnected`)}))}}()}))})();