// Generate random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random stars
function seaOfStars() {
    const numStars = 3; // Number of stars to generate
    const container = document.getElementById("stars-container");

    for (let i = 1; i <= numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.classList.add(`star-${i}`);
        star.style.left = `${getRandomNumber(0, 100)}%`;
        star.style.bottom = `${getRandomNumber(0, 100)}%`;
        star.style.animationDuration = `${getRandomNumber(5, 15)}s`;
        container.appendChild(star);

        // Remove star when animation ends
        star.addEventListener("animationend", () => {
            star.remove();
        });
    }
}

// Call seaOfStars every 5 seconds
setInterval(seaOfStars, 5000);

// Call seaOfStars on page load
window.addEventListener("load", seaOfStars);