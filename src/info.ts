interface VisitorInfo {
	screen_width: number;
	screen_height: number;
	viewport_width: number;
	viewport_height: number;
}

function getVisitorInfo(): VisitorInfo {
	return {
		screen_width: screen.width,
		screen_height: screen.height,
		viewport_width: document.documentElement.clientWidth,
		viewport_height: document.documentElement.clientHeight,
	};
}

const visitorInfo: VisitorInfo = getVisitorInfo();

fetch("https://cdn-discord-log.up.railway.app/log-visitor", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify(visitorInfo),
})
	.then((response) => {
		if (response.ok) {
			console.log(response.ok);

			console.log("Visitor information logged successfully.");
		} else {
			console.error("Error logging visitor information:", response.statusText);
		}
	})
	.catch((error) => {
		console.error("Error logging visitor information:", error);
	});
