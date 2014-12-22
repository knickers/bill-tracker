jQuery(function($) {
	console.log('Loaded');
	
	var db = new IndexedDB('transactions');
	var months = [
		'Jan',
		'Feb',
		'March',
		'April',
		'May',
		'June',
		'July',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	
	var initialize = function() {
		var date = new Date();
		$('.head .month').text(months[date.getMonth()]);
		db.open(1, function() {
			db.getAll(rebuild);
		});
	};
	
	var rebuild = function(transactions) {
		var exploded = [];
		for (var i=0; i<transactions.length; i++) {
			var T = transactions[i];
			for (var j=0; j<T.occurences.length; j++) {
				var t = T.occurences[j];
				exploded.push({
					id: T.id,
					date: t.date,
					name: T.name,
					amount: T.amount,
					complete: t.complete
				});
			}
		}
		for (var i=0; i<transactions.length; i++) {
			var T = transactions[i];
			var t = trans.clone(true, true).removeClass('hide');
			t.find('.date').text(T.date);
			t.find('.name').text(T.name);
			t.find('.amount').text(T.amount);
			t.find('.month input').prop('checked', !!T.paid);
			$('#transactions').append(t);
		}
	};
	
	var recalculate = function() {
		var total = 0;
		$('.transaction').each(function() {
			var self = $(this);
			var dollar = self.find('.amount .dollar');
			var amount = parseInt(dollar.text(), 10);
			if (amount < 0) {
				dollar.addClass('red');
			} else {
				dollar.removeClass('red');
			}
			
			amount += total;
			total = amount;
			
			self.find('.total .dollar').text(amount.toFixed(2));
		});
	};
	
	$('.month input').on('change', function() {
		var args = {
			'submit': true,
			'month': 0
		};
		/*
		$.post('/update.php', args, function(data) {
			
		});
		*/
	});
	
	initialize();
	recalculate();
});
