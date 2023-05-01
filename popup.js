function updatePopup() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		console.log("these are the active tabs: ", tabs);
		const repoUrlRegex = /github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)/;
		const url = tabs[0].url;
		const repoName = url.match(repoUrlRegex)[1];
		console.log(repoName);
		const repoUrl = `https://api.github.com/repos/${repoName}`;
		getLastCommit(repoUrl).then((lastCommitData) => {
			console.log(lastCommitData);
			const commitMessageEl = document.getElementById("commit-message");

			const pNodeForCommitMessage = document.createElement("p");
			const textNodeMessage = document.createTextNode(
				"message: " + lastCommitData.message
			);
			pNodeForCommitMessage.appendChild(textNodeMessage);
			commitMessageEl.appendChild(pNodeForCommitMessage);

			const pNodeForCommitDate = document.createElement("p");
			const textNodeDate = document.createTextNode(
				"date: " + lastCommitData.date
			);
			pNodeForCommitDate.appendChild(textNodeDate);
			commitMessageEl.appendChild(pNodeForCommitDate);
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	updatePopup();
});

function getLastCommit(repoUrl) {
	const apiUrl = `${repoUrl}/commits`;
	return fetch(apiUrl)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			const lastCommitData = {
				sha: data[0].sha,
				message: data[0].commit.message,
				author: data[0].commit.author.name,
				url: data[0].html_url,
				date: formatDate(data[0].commit.author.date),
			};
			return lastCommitData;
		});
}

function formatDate(dateString) {
	const dateObj = new Date(dateString);
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	};
	const formattedDate = dateObj.toLocaleDateString("en-US", options);
	return formattedDate;
}
