/* global showCard Click */

'use strict';

//declaracion de variables globales

const inputs = document.querySelectorAll('.input_card');
const comenzar = document.querySelector('.boton');
let resultado;
const trasera = 'https://raw.githubusercontent.com/annabranco/juego-de-cartas-adalab/master/images/cardback.png';
const section = document.querySelector('.card__seccion');
let charactersResults = [];
let charactersShuffled = [];
let notMatchedCards;
let currentPlayer;
let LSData = [];
const NewGame = new Audio('http://freesound.org/data/previews/105/105228_420640-lq.mp3');


function onLoad() {

	preGame();

	window.addEventListener('keyup',(e) => {
		if (e.key === '+') {
			for (const player of LSData) {
				if (LSData[0].currentId === player.id) {

					player.games.total++;
					localStorage.setItem('AB Toy Story Games',JSON.stringify(LSData));
				}
			}
		}
	});
}

function preGame() {
	if (localStorage.getItem('AB Toy Story Games') !== null) {
		LSData = JSON.parse(localStorage.getItem('AB Toy Story Games'));

		const currentPlayerId = LSData[0].currentId;
		for (const player of LSData) {
			if (player.id === currentPlayerId) {
				currentPlayer = player;
			}
		}

		document.querySelector('.player_inner-new').classList.remove('first-game');
		document.querySelector('.player_mainBar').classList.remove('hidden');
		document.querySelector('.player_inner-new').classList.add('hidden');

		setCurrentPlayer();
	} else {
		document.querySelector('.player_inner-new').classList.remove('hidden');
		document.querySelector('.player_outer-edit').classList.remove('hidden');
		document.querySelector('.selection_outer').classList.add('hidden');
	}
}

function setCurrentPlayer() {

	if (currentPlayer !== undefined) {
		const playerNameFields = document.querySelectorAll('.player_name');
		for (const playerName of playerNameFields) {
			playerName.innerHTML = currentPlayer.name;
			document.querySelector('.player_current').id = `player${currentPlayer.id}`;
		}
		const playerAvatars = document.querySelectorAll('.player_avatar');
		for (const playerAvatar of playerAvatars) {
			playerAvatar.src = `images/avatar/${currentPlayer.avatar}.png`;
			playerAvatar.alt = `Avatar de ${currentPlayer.name}`;
		}
	}
}

//identifica el valor del input seleccionado

function buscar() {
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].checked) {
			resultado = inputs[i].value;
		}
	}
}
//event listener a los inputs

for (let i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('click', buscar);
}

//desencadena el juego con un event listener en el boton

comenzar.addEventListener('click', empezar);

//inicia el juego

function empezar() {
	Click.volume = 0.3;
	Click.play();
	//reset

	NewGame.volume = 0.5;
	NewGame.currentTime = 0.5;
	NewGame.play();

	section.innerHTML = '';

	//quito la clase grid que añado al valor 6 del input

	section.classList.remove('grid');

	fetch(
		'https://raw.githubusercontent.com/annabranco/juego-de-cartas-adalab/master/db/' +
		resultado +
		'.json'
	)
		.then(function(respuesta) {
		//me devuelve un objeto y lo pasamos a formato json

			return respuesta.json();
		})
		.then(function(respuesta2) {
			charactersResults = respuesta2;
			shuffleCharacters();
		}
		);
}

// crea un orden aleatorio de los personagens antes de pintar las cartas
function shuffleCharacters() {
	let randomPos = 0;

	while ( charactersResults.length > 0) {
		randomPos = Math.floor((Math.random() * charactersResults.length));
		charactersShuffled.push(charactersResults.splice(randomPos, 1)[0]);
	}
	createElements();
}

function createElements() {

	for (let i = 0; i < charactersShuffled.length; i++) {

		// Genera un número con más de 500 caracteres para desalentar al jugador que quiera buscar los pares en el inspector.
		let pairNum = '5976937567692388349855401442345872192031183545522943802753002422353086672190946296039955011000000671327841896466544572414857559519960487915930886115852772649940956211583760333278381790861121407968575091422720401099453539886378065618415262466965976937567692388349855401442345872192031183545522943802753002422353086672190946296039955011000000671327841896466544572414857559519960487915930886115852772649940956211583760333278381790861121407968575091422720401099453539886378065618415262466964108673791998101891225473579929236997662491099927384507075274304818909165836265334010157610217371537996785381203221691246257262841702629727151666670732703383' + charactersShuffled[i].pair + '59769375676923883498554014423458721920311835455229438027530024223530866721909462960399550110000006713278418964665445724148575595199604879159308861158527726499409562115837603332783817908611214079685750';

		//let pairNum = charactersShuffled[i].pair;

		const contenedor = document.createElement('div');
		contenedor.setAttribute('data-pair',pairNum);
		contenedor.classList.add('card__div','card__not-matched');
		const imagen = document.createElement('img');
		imagen.classList.add('card__image','card--back');
		const imagen2 = document.createElement('img');
		imagen2.classList.add('card__image', 'card--front');
		const parrafo = document.createElement('p');
		parrafo.classList.add('card_name', 'card--front');
		parrafo.innerHTML=charactersShuffled[i].name;

		const textNotMatch = document.createElement('p');
		textNotMatch.classList.add('card--front','textNotMatch', 'hidden');
		textNotMatch.innerHTML = 'NO SON PAREJA';


		imagen.src = trasera;
		imagen2.src = charactersShuffled[i].image;

		//mejoro la visualizacion con 6 cartas

		if (resultado === '10') {
			section.classList.add('grid10');
		} else {
			section.classList.remove('grid10');
		}

		//añado los elementos al section

		contenedor.append(imagen, imagen2, parrafo, textNotMatch);
		section.appendChild(contenedor);
	}

	prepareCardsToBeClicked();
	// resetea array de personajes reordenados, para prepararlo para otro partido
	charactersShuffled = [];
}

//event listener a las imagenes

function prepareCardsToBeClicked() {
	notMatchedCards = document.querySelectorAll('.card__not-matched');

	for (let i = 0; i < notMatchedCards.length; i++) {
		notMatchedCards[i].addEventListener('click', showCard);
	}
}

onLoad();
