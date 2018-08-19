/*global LSData currentPlayer:true removePlayer removeButtons:true setCurrentPlayer createNewPlayer Click */
/* exported playerAvatar playerName NewPlayer newPlayerObject */
'use strict';

let playerAvatar;
let playerName;
const NewPlayer = new Audio('http://freesound.org/data/previews/262/262941_2113957-lq.mp3');
const newPlayerObject = {
	id: 0,
	name: '',
	avatar: '',
	games: {
		'2char': undefined,
		'4char': undefined,
		'6char': undefined,
		'8char': undefined,
		'10char': undefined,
		total: 0,
	}
};

document.querySelector('.player_inner-new').addEventListener('click',createNewPlayer);
document.querySelector('.player_details').addEventListener('click',seePlayerDetails);
document.querySelector('.player_change').addEventListener('click',changePlayer);

document.querySelector('.close_details').addEventListener('click',unmountPlayerDetailsMobile);
document.querySelector('.close_change').addEventListener('click',unmountEditPlayersMobile);


function seePlayerDetails() { // Opens up player details screen
	Click.volume = 0.3;
	Click.play();
	document.querySelector('.player_outer-details').classList.remove('hidden');
	document.querySelector('.player_outer-details').addEventListener('mouseleave',unmountPlayerDetails);
	document.querySelector('.trial2').innerHTML = currentPlayer.games['2char'] || '';
	document.querySelector('.trial4').innerHTML = currentPlayer.games['4char'] || '';
	document.querySelector('.trial6').innerHTML = currentPlayer.games['6char'] || '';
	document.querySelector('.trial8').innerHTML = currentPlayer.games['8char'] || '';
	document.querySelector('.trial10').innerHTML = currentPlayer.games['10char'] || '';
	document.querySelector('.record-trials-total').innerHTML = currentPlayer.games.total;
}

function unmountPlayerDetails(e){
	e.currentTarget.classList.add('hidden');
	e.currentTarget.removeEventListener('mouseleave',unmountPlayerDetails);
}

function unmountPlayerDetailsMobile(e){
	e.currentTarget.parentElement.parentElement.classList.add('hidden');
	e.currentTarget.parentElement.parentElement.removeEventListener('mouseleave',unmountPlayerDetails);
}

function changePlayer() {
	Click.volume = 0.3;
	Click.play();
	document.querySelector('.player_outer-edit').classList.remove('hidden');
	document.querySelector('.player_current').classList.remove('hidden');
	document.querySelector('.player_inner-new').classList.remove('hidden');

	printOtherPlayers();

	document.querySelector('.player_outer-edit').addEventListener('mouseleave',unmountEditPlayers);

}

function printOtherPlayers() {
	let LSDataPlayers = [ ... LSData];
	LSDataPlayers.splice(0,1);

	LSDataPlayers = LSDataPlayers.filter(player => player.id !== currentPlayer.id);

	for (const player of LSDataPlayers) {

		const playerOuter = document.createElement('div');
			playerOuter.classList.add('player_inner', 'other_players');
			playerOuter.id = `player${player.id}`;

		const playerContainer = document.createElement('div');
			playerContainer.classList.add('players','other-player-div');

		const avatar = document.createElement('img');
			avatar.src = `images/avatar/${player.avatar}.png`;
			avatar.alt = `Avatar de ${player.name}`;
			avatar.classList.add('otherPlayer_avatar');

		const playerName = document.createElement('h3');
			playerName.classList.add('otherPlayer_name');
			playerName.innerHTML = player.name;

		const icon = document.createElement('i');
			icon.classList.add('fas', 'fa-user-minus', 'player_remove-icon');

		playerContainer.append(avatar, playerName);
		playerOuter.append(playerContainer, icon);
		document.querySelector('.other-players').appendChild(playerOuter);
	}
	const allOtherPlayers = document.querySelectorAll('.other-player-div');
	for (const player of allOtherPlayers) {
		player.addEventListener('click',changeCurrentPlayer);

		removeButtons = document.querySelectorAll('.player_remove-icon');
		for (const button of removeButtons) {
			button.removeEventListener('click', removePlayer);
			button.addEventListener('click', removePlayer);
		}
	}
}

function unmountEditPlayers(e) {
	if ( currentPlayer !== undefined) {
		document.querySelector('.player_inner-new').classList.add('hidden');
	}

	document.querySelector('.player_current').classList.add('hidden');
	e.currentTarget.classList.add('hidden');
	e.currentTarget.removeEventListener('mouseleave',unmountEditPlayers);
	clearOtherPlayers();
}

function unmountEditPlayersMobile(e) {
	if ( currentPlayer !== undefined) {
		document.querySelector('.player_inner-new').classList.add('hidden');
	}

	document.querySelector('.player_current').classList.add('hidden');
	e.currentTarget.parentElement.parentElement.classList.add('hidden');
	e.currentTarget.parentElement.parentElement.removeEventListener('mouseleave',unmountEditPlayers);
	clearOtherPlayers();
}

function clearOtherPlayers() {
	const allOtherPlayers = document.querySelectorAll('.other_players');
	for (const player of allOtherPlayers) {
		player.remove();
	}
}

function changeCurrentPlayer(e) {
	Click.volume = 0.3;
	Click.play();
	let newCurrentCharacterId = e.currentTarget.parentElement.id.substr(6);
	newCurrentCharacterId = Number(newCurrentCharacterId);
	for (const player of LSData) {
		if (player.id === newCurrentCharacterId) {
			currentPlayer = player;
		}
	}
	LSData[0].currentPlayer = currentPlayer.name;
	LSData[0].currentId = currentPlayer.id;

	localStorage.setItem('AB Toy Story Games',JSON.stringify(LSData));

	setCurrentPlayer();
	clearOtherPlayers();
	printOtherPlayers();
}
