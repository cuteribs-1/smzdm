var followers = [];

var getPage = url => {
	$.get(url)
		.done(html => {
			var $html = $(html.replace(/<img[^>]*>/g, ''));
			$.each($html.find('li.manage-darenn-item img[alt="生活家"]')
					.closest('li.manage-darenn-item')
					.find('a.focus-name')
					.text(), 
				(a, f) => followers.push(f.text().trim())
			);

			var nextPage = $html.find('a.page-turn').last().attr('href');

			if(nextPage){
				getPage(nextPage);
			}

			console.log(followers.length + '|' + nextPage);
		});
};


getPage('https://zhiyou.smzdm.com/guanzhu/fensi');