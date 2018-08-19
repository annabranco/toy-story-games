/*global LSData:true currentPlayer:true preGame setCurrentPlayer Click clearOtherPlayers printOtherPlayers*/
'use strict';

let removeButtons = document.querySelectorAll('.player_remove-icon');

for (const button of removeButtons) {
	button.addEventListener('click', removePlayer);
}


function removePlayer(e) {
	Click.volume = 0.3;
	Click.play();

	let clickedPlayerId = e.currentTarget.parentElement.id.substr(6);
	clickedPlayerId = Number(clickedPlayerId);

	for (const player of LSData) {
		if ( player.id  === clickedPlayerId ) {
			if( player.games.total === 0) {
				delPlayer(player.id);
			} else {
				confirmRemovePlayer(player);
			}
		}
	}
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
		for ( let i = 0; i < LSData.length; i++ ) {
			if (LSData[i].id === id) {
				if (LSData[i].id === currentPlayer.id) {

					forcedChangeCurrentPlayer(LSData[i].id, i);
				}
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
		if ( currentPlayer === undefined ) {
			preGame();
		}
		setCurrentPlayer();
		clearOtherPlayers();
		printOtherPlayers();
	}
}


function forcedChangeCurrentPlayer(id, orderOfDeletedPlayer) {
	let playersLSData = [ ...LSData]; // creates a copy of LSData to handle players without messign the original array
	playersLSData.splice(orderOfDeletedPlayer,1); // removes deleted player from array
	playersLSData.splice(0,1); // removes currentPlayer object, so we have only players objects on array
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
