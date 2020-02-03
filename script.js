const body = document.querySelector('body');
const main = document.querySelector('main');
const header = document.querySelector('header');

//adding load spinner

function loadSpinner() {
	main.innerHTML = '';
	let image = `<img class="loader-icon" src="loader2.gif" alt="loader icon">`
	main.innerHTML = image;
}

/* =======================
	getting/displaying 
	slideshow text/images
======================== */

//fetch request
const apikey = `b4787c4d0b464d41bb6b2d176e9ecb70`;
const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=100&apiKey=${apikey}`;

function getNews() {
	const request = new Request(url);
	return fetch(request)
			.then(res => res.json())
			.catch(err => console.log(err));
}

const slideNews = async function() {
	const data = await getNews();
	styleSlides(data);
} 

slideNews();

//styling data results
const slideContainer = document.querySelector('.slideshow-container');
for (let i = 0; i < 10; i++) {
	slideContainer.insertAdjacentHTML(`beforeend`, `
			<div class="mySlides fade">
				<a class="slide-link">
					<img class="slide">
					<div class="content"></div>
				</a>
			</div>
		`)
}

const images = document.querySelectorAll('.slide');
const content = document.querySelectorAll('.content');
const links = document.querySelectorAll('.slide-link');

function styleSlides(news) {
	let articles = news.articles;
	for (let i = 0; i < images.length; i++) {
		for (let j = 0; j < articles.length; j++) {
			if (articles[j].urlToImage !== null) {
				images[i].src = `${articles[i].urlToImage}`;
				links[i].href = `${articles[i].url}`;
				links[i].target = `_blank`;
				content[i].textContent = `${articles[i].title}`;
				document.querySelector('.slideshow-container').style.display = 'block';
			} else {
				articles = articles.filter(article => {
					return article !== articles[j]
				})
			}
		}
	}
}

//slideshow in action
let slideIndex = 0;
showSlides();

function showSlides() {
	const slides = document.querySelectorAll('.mySlides');

	for (let i = 0; i < slides.length; i++) {
		slides[i].style.display = 'none';
	}
	slideIndex++;

	if (slideIndex > slides.length) slideIndex = 1;
	slides[slideIndex-1].style.display = 'block';
	setTimeout(showSlides, 4000);
}

/* ===================
   getting/displaying
   search results
==================== */

const topNavBar = document.querySelector('.top-nav');
const searchBox = document.querySelector('.search');
const searchButton = document.querySelector('.submit-button');
const root = `https://newsapi.org/v2/everything?qInTitle=`;

function getSearchResults(req) {
	let searchUrl = `${root}${req}&pageSize=100&apiKey=${apikey}`;
	const searchRequest = new Request(searchUrl);
	return fetch(searchRequest)
			.then(res => res.json())
			.catch(err => console.log(err));
}

const renderSearchResults = async function(req) {
	req = document.querySelector('.input-query').value;
	if (req !== '') {
		if (document.querySelector('.search-title')) {
			body.removeChild(document.querySelector('.search-title'))
		}

		let searchTitle = `
			<p class="search-title">
				Search results for <b>${req}</b>:
			</p>
		`;

		header.insertAdjacentHTML(`afterend`, searchTitle);

		if (document.querySelector('.load-more')) {
			body.removeChild(document.querySelector('.load-more'));
		}
		loadSpinner();
		const searchData = await getSearchResults(req);
		displaySearchResults(searchData);
	}
}
	

function displaySearchResults(data) {
	let articles = data.articles;

	if (document.querySelector('.load-more')) {
		body.removeChild(document.querySelector('.load-more'));
	}

	let actionButton = `
			<button class="load-more">Show more results</button>
		`;
	let markup = `<ul class="search-result-list">`;

	function loadMoreResults() {
		if (articles.length < 20) {
			body.removeChild(document.querySelector('.load-more'));
		}
		for (let i = 0; i < 11; i++) {
			if (articles[i].urlToImage !== null) {
				markup += `
					<li class="search-result">
						<p>${articles[i].publishedAt.substring(0, 10)}</p>
						<a href="${articles[i].url}" target="_blank" class="search-result-link">
							<img src="${articles[i].urlToImage}">
							<div>
								<h1>${articles[i].title}</h1>
								<p>${articles[i].description}</p>
							</div>
						</a>
					</li>
					<hr>
				`
				articles = articles.filter(article => {
					return article !== articles[i];
				})
			}
		}
		console.log(articles.length);
	}

	loadMoreResults();
	markupend = `
		</ul>
		<a class="back-top" href="#top">
				<i class="fa fa-angle-up"></i>
		</a>
	`
	main.innerHTML = markup + markupend;

	main.insertAdjacentHTML(`afterend`, actionButton);
	
	const loadButton = document.querySelector('.load-more');
	loadButton.addEventListener('click', function() {
		loadMoreResults(data);
		main.innerHTML = markup + markupend;
	})
}


searchButton.addEventListener('click', renderSearchResults);


/* ==============
   Top headlines
 ============== */

const headlineDiv = document.querySelector('.top-headlines');
const headUrlRoot = `https://newsapi.org/v2/top-headlines?`;

function getHeadlines() {
	let url = `${headUrlRoot}country=us&apiKey=${apikey}`;
	let request = new Request(url);
	return fetch(request)
			.then(res => res.json())
			.catch(err => console.log(err));
}

const renderHeadlines = async function() {
	const data = await getHeadlines();
	displayHeadlines(data);
}

renderHeadlines();

function displayHeadlines(data) {
	let articles = data.articles;
	let listItems = ``;
	for (let i = 0; i < 6; i++) {
		listItems += `
			<li class="headline normal-hl">
				<a class="hl-link" target="_blank">
					<img class="hl-image">
					<p class="hl-title"></p>
				</a>
			</li>
		`;
	}
	let markup = `
			<div class="title">
				<h1>Top Headlines</h1>
				<span class="header-line"></span>
			</div>
			<div class="results">
				<div class="main-hl headline">
					<a class="hl-link" target="_blank">
						<img class="hl-image">
						<p class="hl-title"></p>
					</a>
				</div>
				<ul class="hl-list">
					${listItems}
				</ul>
			</div>
		`;

	headlineDiv.innerHTML = markup;
	const headlines = document.querySelectorAll('.headline');
	const hlImages = document.querySelectorAll('.hl-image');
	const hlTitles = document.querySelectorAll('.hl-title');
	const hlLinks = document.querySelectorAll('.hl-link');

	for (let i = 0; i < headlines.length; i++) {
		for (let j = 0; j < articles.length; j++) {
			if (articles[j].urlToImage !== null) {
				hlLinks[i].href = `${articles[i].url}`
				hlImages[i].src = `${articles[i].urlToImage}`;
				hlTitles[i].textContent = `${articles[i].title}`;
			}
		}
	}
}


/* ===========
	Must See
============ */

const mustSeeDiv = document.querySelector('.must-see');

const renderVariousArticles = async function() {
	const data = await getNews();
	displayVariousArticles(data);
}

renderVariousArticles();

function displayVariousArticles(data) {
	let articles = data.articles;
	let mainItem = `
			<div class="main-ms ms-article">
				<a class="ms-link" target="_blank">
					<img class="ms-image">
					<p class="ms-title"></p>
				</a>
			</div>
		`

	let listItems = ``;
	for (let i = 0; i < 6; i++) {
		listItems += `
			<li class="ms-article normal-ms">
				<a class="ms-link" target="_blank">
					<img class="ms-image">
					<p class="ms-title"></p>
				</a>
			</li>
		`;
	}

	let markup = `
			<div class="title">
				<h1>Must See</h1>
				<span class="header-line"></span>
			</div>
			<div class="results">
				<div class="results-panel first">
					${mainItem}
					<ul class="ms-list">
						${listItems}
					</ul>
				</div>

				<div class="results-panel middle">
					${mainItem}
					<ul class="ms-list">
						${listItems}
					</ul>
				</div>

				<div class="results-panel first">
					${mainItem}
					<ul class="ms-list">
						${listItems}
					</ul>
				</div>
			</div>
		`;

	mustSeeDiv.innerHTML = markup;
	const msArticles = document.querySelectorAll('.ms-article');
	const msLinks = document.querySelectorAll('.ms-link');
	const msImages = document.querySelectorAll('.ms-image');
	const msTitles = document.querySelectorAll('.ms-title');

	for (let i = 0; i < msArticles.length; i++) {
		for (let j = 0; j < articles.length; j++) {
			if (articles[j].urlToImage !== null) {
				msLinks[i].href = `${articles[i].url}`
				msImages[i].src = `${articles[i].urlToImage}`;
				msTitles[i].textContent = `${articles[i].title}`;
			}
		}
	}
}


/* =============
	Home sports
============= */

const sportsDiv = document.querySelector('.sport')

function getSportNews() {
	let url = `${headUrlRoot}country=ng&category=sports&pageSize=100&apiKey=${apikey}`
	let request = new Request(url);
	return fetch(request)
			.then(res => res.json())
			.catch(err => console.log(err));
}

const renderSportNews = async function() {
	const data = await getSportNews();
	console.log(data);
	displaySportNews(data);
}

renderSportNews();

function displaySportNews(data) {
	let articles = data.articles;
	let listItems = ``;
	for (let i = 0; i < 6; i++) {
		listItems += `
			<li class="sp-headline normal-sp">
				<a class="sp-link" target="_blank">
					<img class="sp-image">
					<p class="sp-title"></p>
				</a>
			</li>
		`;
	}
	let markup = `
			<div class="title">
				<h1>Sports</h1>
				<span class="header-line"></span>
			</div>
			<div class="results">
				<div class="main-sp sp-headline">
					<a class="sp-link" target="_blank">
						<img class="sp-image">
						<p class="sp-title"></p>
					</a>
				</div>
				<ul class="sp-list">
					${listItems}
				</ul>
			</div>
		`;

	sportsDiv.innerHTML = markup;
	const headlines = document.querySelectorAll('.sp-headline');
	const spImages = document.querySelectorAll('.sp-image');
	const spTitles = document.querySelectorAll('.sp-title');
	const spLinks = document.querySelectorAll('.sp-link');

	for (let i = 0; i < headlines.length; i++) {
		for (let j = 0; j < articles.length; j++) {
			if (articles[j].urlToImage !== null) {
				spLinks[i].href = `${articles[i].url}`
				spImages[i].src = `${articles[i].urlToImage}`;
				spTitles[i].textContent = `${articles[i].title}`;
			}
		}
	}
}