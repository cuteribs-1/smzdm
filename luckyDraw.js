var url = 'https://zhiyou.smzdm.com/user/crowd/expired/p';
var lastPage = 212;
var results = [];

var getPage = p => {
	if (p >= lastPage) {
		console.save(results, 'results.json');
		// console.log(results);
		return;
	}

	$.get(url + p, html => {
		var $html = $(html.replace(/<img[^>]*>/g, ''));
		items = $.map($html.find('.lucky-border'), t => {
			var $t = $(t);
			var item = {
				title: $t.find('a.title').text(),
				winnerUrl: $t.find('p.winner-user a.a_underline').attr('href'),
				winnerName: $t.find('p.winner-user a.a_underline').text(),
				winnerNumber: $t.find('p.end-time').prev('p').text().replace('中奖号码：', ''),
				endTime: $t.find('p.end-time').text().replace('结束时间：', ''),
				totalNumber: $t.find('p.end-time').next('p').text().replace('总参与次数：', '')
			};
			return item;
		});

		$.merge(results, items);
		getPage(p + 1);
	});
};

console.save = (data, filename) => {

	if (!data) {
		console.error('Console.save: No data')
		return;
	}

	if (!filename) filename = 'console.json'

	if (typeof data === "object") {
		data = JSON.stringify(data, undefined, 4)
	}

	var blob = new Blob([data], { type: 'text/json' }),
		e = document.createEvent('MouseEvents'),
		a = document.createElement('a')

	a.download = filename
	a.href = window.URL.createObjectURL(blob)
	a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
	a.dispatchEvent(e)
};

getPage(1);