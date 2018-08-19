/* exported showCard */
/* global notMatchedCards:true resultado LSData:true currentPlayer */

'use strict';

const contando = document.querySelector('.counter');
let cont = 0;
let compareA;
let compareB;


const Click = new Audio('http://freesound.org/data/previews/215/215772_4027196-lq.mp3');
const Ding = new Audio('http://freesound.org/data/previews/411/411088_5121236-lq.mp3');
const Yes = new Audio('http://freesound.org/data/previews/19/19260_84709-lq.mp3');
const No = new Audio('http://freesound.org/data/previews/273/273919_3173139-lq.mp3');
const Victory = new Audio('http://freesound.org/data/previews/426/426233_321967-lq.mp3');

contando.innerHTML = cont;


//oculta la tarjeta clicada y muestra la otra

function showCard(event) {

	event.currentTarget.classList.toggle('card__turn');
	event.currentTarget.removeEventListener('click', showCard);

	if (compareA === undefined) {
		Ding.volume = 0.3;
		Ding.currentTime = 0;
		Ding.play();
		compareA = event.currentTarget.getAttribute('data-pair');
	} else {
		compareB = event.currentTarget.getAttribute('data-pair');
		compareCards();
	}
}

function compareCards() {
	cont++;
	contando.innerHTML = cont;

	notMatchedCards = document.querySelectorAll('.card__not-matched');
	for (const card of notMatchedCards) {
		card.removeEventListener('click', showCard);
	}

	if (compareA === compareB) {
		Yes.play();
		for (const card of notMatchedCards) {
			if (card.getAttribute('data-pair') === compareA) {
				card.classList.remove('card__not-matched');
			}
		}
		notMatchedCards = document.querySelectorAll('.card__not-matched');
		checkForVictory();
	} else {
		No.volume = 0.3;
		No.currentTime = 0.3;
		No.play();
		for (const card of notMatchedCards) {
			if (card.getAttribute('data-pair') === compareA || card.getAttribute('data-pair') === compareB) {
				card.lastChild.classList.remove('hidden');
				setTimeout(() => {
					card.classList.remove('card__turn');
					card.addEventListener('click', showCard);
					card.lastChild.classList.add('hidden');
					nextTrial();
				},3200);
			}
		}
	}
}

function nextTrial() {
	compareA = compareB = undefined;
	notMatchedCards = document.querySelectorAll('.card__not-matched');
	for (const card of notMatchedCards) {
		card.addEventListener('click', showCard);
	}
}

function checkForVictory() {
	if (notMatchedCards.length === 0) {
		theEnd();
	} else {
		nextTrial();
	}
}

function theEnd() {
	const typeOfGame = `${resultado}char`;
	const numberOfTrials = cont;
	compareA = compareB = undefined;
	cont = 0;
	document.querySelector('.start_button').innerHTML = 'Nuevo partido';

	setTimeout(() => {
		Victory.play();

		const victoryTexts = [`¡Muy bien, ${currentPlayer.name}!`,'¡Has conseguido!','¡Enhorabuena!'];
		const victoryText = victoryTexts[Math.floor(Math.random()*3)];

		const victoryOuter = document.createElement('div');
			victoryOuter.classList.add('victory__outer');

		const victoryInner = document.createElement('h2');
			victoryInner.classList.add('victory__text');
			victoryInner.innerHTML = victoryText;

		victoryOuter.appendChild(victoryInner);

		document.querySelector('.card__seccion').appendChild(victoryOuter);

	},1000);

	setTimeout(() => {
		document.querySelector('.victory__outer').remove();
		document.querySelector('.selection_outer').classList.remove('hidden');
	}, 5000);

	for (const player of LSData) {
		if(player.id === currentPlayer.id) {
			player.games.total++;
			player.games[typeOfGame] = numberOfTrials;
		}
	}
	localStorage.setItem('AB Toy Story Games',JSON.stringify(LSData));
}
