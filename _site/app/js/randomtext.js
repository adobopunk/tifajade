const factTag = document.querySelector('p.intro-sub');
const factOptions = [
	'On a weekend you might catch her in a high concept RTS like Crusader Kings 3, Stellaris, or Bloons TD 6.',
	'She’s got an extensive collection of weird makeup products that she hardly ever wears.',
	'She built a business server to safely house assets and keep your data private, with 20+ TB of storage and counting.',
	'She loves shooting film and is constantly growing her texture library with photos developed in her bathtub.',
	'She learned to code just so she could make this portfolio. You can watch her development process <a href="https://github.com/adobopunk">here!</a>',
	'She loves building oddly specific <a href="https://open.spotify.com/playlist/0P9AZpIJY2CnF6oBirZXM4?si=d23762d2cd854e94">Hyperpop playlists</a> to set the mood while she crafts the perfect ease curve.',
];

let currentFactIndex = Math.floor(Math.random() * factOptions.length);

// Function to update the fact with a fade effect
const updateFact = function () {
	// Increment the index before fading out, so the new fact is different
	currentFactIndex = (currentFactIndex + 1) % factOptions.length;

	// Start fading out
	factTag.classList.add('fade-out');

	// Change the content after fade-out completes (1 second delay for smooth transition)
	setTimeout(() => {
		const selectedFact = factOptions[currentFactIndex];
		factTag.innerHTML = selectedFact;
		factTag.classList.remove('fade-out'); // Fade back in after content change
	}, 1000); // Wait for the fade-out to finish (1 second)
};

// Set initial random fact without triggering fade
factTag.innerHTML = factOptions[currentFactIndex];

// Delay the start of cycling by 4 seconds
setTimeout(() => {
	updateFact(); // Immediately change after 4 seconds
	setInterval(updateFact, 5000); // Start cycling every 4 seconds
}, 4000); // 4-second delay before the first change
