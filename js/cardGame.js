/* exported showCard */
/* global notMatchedCards:true */

'use strict';

const contando = document.querySelector('.counter');
let cont = 0;
let compareA;
let compareB;

const Yes = new Audio('http://freesound.org/data/previews/19/19260_84709-lq.mp3');
const No = new Audio('http://freesound.org/data/previews/273/273919_3173139-lq.mp3')
const Victory = new Audio('http://freesound.org/data/previews/426/426233_321967-lq.mp3');

contando.innerHTML = cont;


//oculta la tarjeta clicada y muestra la otra

function showCard(event) {

	event.currentTarget.classList.toggle('card__turn');
	event.currentTarget.removeEventListener('click', showCard);

	if (compareA === undefined) {
		compareA = event.currentTarget.getAttribute('data-pair');
		console.log(compareA);
	} else {
		compareB = event.currentTarget.getAttribute('data-pair');
		console.log(compareB);

		compareCards();
	}
}

function compareCards() {
	cont = cont+1;
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
				},3200);
			}
		}
	}
	nextTrial();
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
	}

}

function theEnd() {
	setTimeout(() => {
		Victory.play();
},1000)
}
