'use strict';

let playerAvatar;
let playerName;
const NewPlayer = new Audio('http://freesound.org/data/previews/262/262941_2113957-lq.mp3');
let removeButtons = document.querySelectorAll('.player_remove-icon');
for (const button of removeButtons) {
	button.addEventListener('click', removePlayer);
}

document.querySelector('.player_inner-new').addEventListener('click',createNewPlayer);
document.querySelector('.player_details').addEventListener('click',seePlayerDetails);
document.querySelector('.player_change').addEventListener('click',changePlayer);

let newPlayerObject = {
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

function createNewPlayer() {

	document.querySelector('.player_createNew').addEventListener('mouseleave',unmountCreateNewPlayer);
	NewPlayer.currentTime = 0;
	NewPlayer.play();
	document.querySelector('.player_inner-new').classList.remove('first-game');
	document.querySelector('.player_createNew').classList.remove('hidden');
	document.querySelector('.player_createNew-avatarButton').addEventListener('click',addPlayer);
	const avatars = document.querySelectorAll('.avatar');
	for (const avatar of avatars) {
		avatar.addEventListener('click',selectAvatar);
	}
}

function unmountCreateNewPlayer(e) {
	e.currentTarget.classList.add('hidden');
	e.currentTarget.removeEventListener('mouseleave',unmountCreateNewPlayer);

	if (currentPlayer === undefined) {
		document.querySelector('.player_inner-new').classList.add('first-game');
	}
}

function selectAvatar(e) {
	const avatars = document.querySelectorAll('.avatar');
	for (const avatar of avatars) {
		avatar.classList.add('avatar-off');
	}
	e.currentTarget.classList.remove('avatar-off');
	playerAvatar = e.currentTarget.id;
}

function addPlayer() {

	Click.play();
	let currentId = 0;

	playerName = document.querySelector('.player_createNew-name').value;

	if (playerName === '' || playerAvatar === undefined) {
		document.querySelector('.player_createNew-confirmation').classList.remove('hidden');

	} else {
		if (localStorage.getItem('AB Toy Story Games') !== null) {
			LSData = JSON.parse(localStorage.getItem('AB Toy Story Games'));
			currentId = LSData.length;
		} else {
			currentId = 1;
			LSData.push({ currentPlayer: playerName, currentId: currentId  });
		}

		const newPlayer = { ...newPlayerObject, id: currentId, name: playerName, avatar: playerAvatar };

		LSData[0].currentPlayer = playerName;
		LSData[0].currentId = currentId;


		LSData.push( newPlayer );

		currentPlayer = newPlayer;

		localStorage.setItem('AB Toy Story Games', JSON.stringify(LSData));


	//	document.querySelector('.player_createNew').classList.add('hidden');
		document.querySelector('.player_current').classList.remove('hidden');
		document.querySelector('.player_createNew-name').value = '';
		const avatars = document.querySelectorAll('.avatar');
		for (const avatar of avatars) {
			avatar.classList.remove('avatar-off');
		}
		setCurrentPlayer();
		clearOtherPlayers();
		printOtherPlayers();
	}
}

function seePlayerDetails() {
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

function changePlayer() {
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
			playerContainer.classList.add('players');

		const avatar = document.createElement('img');
			avatar.src = `images/avatar/${player.avatar}.png`;
			avatar.alt = `Avatar de ${player.name}`;
			avatar.classList.add('otherPlayer_avatar');

		const playerName = document.createElement('h3');
			playerName.classList.add('otherPlayer_name');
			playerName.innerHTML = player.name;

		const icon = document.createElement('i');
			icon.classList.add('fas', 'fa-user-minus', 'player_remove-icon');

		playerContainer.append(avatar, playerName, icon);
		playerOuter.appendChild(playerContainer);
		document.querySelector('.other-players').appendChild(playerOuter);
	}
	const allOtherPlayers = document.querySelectorAll('.other_players');
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
	document.querySelector('.player_current').classList.add('hidden');
	document.querySelector('.player_inner-new').classList.add('hidden');
	e.currentTarget.classList.add('hidden');
	e.currentTarget.removeEventListener('mouseleave',unmountEditPlayers);
	clearOtherPlayers();
}

function clearOtherPlayers() {
	const allOtherPlayers = document.querySelectorAll('.other_players');
	for (const player of allOtherPlayers) {
		player.remove();
	}
}

function changeCurrentPlayer(e) {
	let newCurrentCharacterId = e.currentTarget.id.substr(6);
	newCurrentCharacterId = Number(newCurrentCharacterId);

	for (const player of LSData) {
		if (player.id === newCurrentCharacterId) {
			currentPlayer = player;
		}
	}
LSData[0].currentPlayer = currentPlayer.name;
LSData[0].currentId = currentPlayer.id;
console.log(LSData);

localStorage.setItem('AB Toy Story Games',JSON.stringify(LSData));

	setCurrentPlayer();
	clearOtherPlayers();
	printOtherPlayers();
}

function removePlayer() {

}
