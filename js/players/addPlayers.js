'use strict';

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
			LSData[0].lastId++;
			currentId = LSData[0].lastId; // TODO : change it

		} else {
			currentId = 1;
			LSData.push({ currentPlayer: playerName, currentId: currentId, lastId: currentId });
		}

		const newPlayer = { ...newPlayerObject, id: currentId, name: playerName, avatar: playerAvatar };

		LSData[0].currentPlayer = playerName;
		LSData[0].currentId = currentId;


		LSData.push( newPlayer );

		currentPlayer = newPlayer;

		localStorage.setItem('AB Toy Story Games', JSON.stringify(LSData));


		document.querySelector('.player_createNew').classList.add('hidden');
		document.querySelector('.player_outer-edit').classList.add('hidden'); //test
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
