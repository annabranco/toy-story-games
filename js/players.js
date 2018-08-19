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
			currentId = LSData.length; // TODO : change it
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


		document.querySelector('.player_createNew').classList.add('hidden');
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

function clearOtherPlayers() {
	const allOtherPlayers = document.querySelectorAll('.other_players');
	for (const player of allOtherPlayers) {
		player.remove();
	}
}

function changeCurrentPlayer(e) {
	let newCurrentCharacterId = e.currentTarget.parentElement.id.substr(6);
	newCurrentCharacterId = Number(newCurrentCharacterId);
console.log(newCurrentCharacterId);
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

function removePlayer(e) {
let clickedPlayerId = e.currentTarget.parentElement.id.substr(6);
clickedPlayerId = Number(clickedPlayerId);

	for (const player of LSData) {{
		if ( player.id  === clickedPlayerId ) {
			if( player.games.total === 0) {
				console.log(player.id);
				delPlayer(player.id);
			} else {
				confirmRemovePlayer(player);
			}
		}
	}}
}

function confirmRemovePlayer(player) {

	const removeContainer = document.createElement('div');
		removeContainer.classList.add('remove-div');

	const removeInner = document.createElement('div');
		removeInner.classList.add('remove-inner');

	const avatar = document.createElement('img');
		avatar.src = `images/avatar/${player.avatar}.png`;
		avatar.alt = `Avatar de ${player.name}`;
		avatar.classList.add('otherPlayer_avatar');

	const playerName = document.createElement('h3');
		playerName.classList.add('otherPlayer_name');
		playerName.innerHTML = player.name;

	const removeWarningTitle = document.createElement('h4');
		removeWarningTitle.classList.add('remove_warning-title');
		removeWarningTitle.innerHTML = '¡Importante!';

	const removeWarning = document.createElement('p');
		removeWarning.classList.add('remove_warning-txt');
		removeWarning.innerHTML = `El registro de ${player.name} y todo su historial será PERMANENTEMENTE borrado.`;

	const removeWarning2 = document.createElement('p');
		removeWarning2.classList.add('remove_warning-txt');
		removeWarning2.innerHTML = `Esta acción no podrá ser deshecha. ¿Deseas realmente continuar?`;

	const removeButton1 = document.createElement('button');
		removeButton1.classList.add('remove_button','remove_button-cancel');
		removeButton1.innerHTML = 'Cancelar';
		removeButton1.addEventListener('click', () => delPlayer('cancel'));

	const removeButton2 = document.createElement('button');
		removeButton2.classList.add('remove_button','remove_button-delete');
		removeButton2.innerHTML = `Borrar ${player.name}`;
		removeButton2.addEventListener('click', () => delPlayer(player.id));


	removeInner.append(avatar, playerName);
	removeContainer.append(removeWarningTitle, removeInner, removeWarning, removeWarning2, removeButton1, removeButton2);

	document.querySelector('.player').appendChild(removeContainer);
}

function delPlayer(id) {
	if (id === 'cancel') {
		document.querySelector('.remove-div').remove();

	} else {
		console.log('delete player');
		for ( let i = 0; i < LSData.length; i++ ) {
			if (LSData[i].id === id) {
				if (LSData[i].id === currentPlayer.id) {

					forcedChangeCurrentPlayer(LSData[i].id, i)
					console.log(currentPlayer);

				}
				console.log(`Player deleted: ${LSData[i].name}`);
				LSData.splice(i,1);
				if (LSData.length === 1) {
					localStorage.removeItem('AB Toy Story Games');
					LSData = [];
				} else {
					localStorage.setItem('AB Toy Story Games',JSON.stringify(LSData));
				}

				document.querySelector('.remove-div') ? document.querySelector('.remove-div').remove() : null;
			}
		}
		preGame();
		setCurrentPlayer();
		clearOtherPlayers();
		printOtherPlayers();
	}
}


function forcedChangeCurrentPlayer(id, orderOfDeletedPlayer) {
	let playersLSData = [ ...LSData]; // creates a copy of LSData to handle players without messign the original array
	playersLSData.splice(orderOfDeletedPlayer,1); // removes deleted player from array
	playersLSData.splice(0,1); // removes currentPlayer object, so we have only players objects on array
	console.log(playersLSData);
	if (playersLSData.length === 0) { // If there are no players left after removing the deleted one
		currentPlayer = undefined;
		document.querySelector('.player_current').classList.add('hidden');
		document.querySelector('.player_inner-new').classList.add('first-game');
	} else {
		currentPlayer = playersLSData[0];
		LSData[0].currentPlayer = currentPlayer.name;
		LSData[0].currentId = currentPlayer.id;
	}
}
