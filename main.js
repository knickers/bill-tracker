jQuery(function($) {
	var db = new IndexedDB('bill-tracker', 'transactions');
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
		db.open(2, function() {
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
	
	$('.controls .modal .save label').on('click', function(e) {
		var $id = $('#transaction-id');
		var $name = $('#transaction-name');
		var $link = $('#transaction-link');
		var $date = $('#transaction-date');
		var $skip = $('#transaction-skip');
		var $period = $('#transaction-period');
		var trans = {
			name: $name.val(),
			link: $link.val(),
			date: $date.val(),
			skip: $skip.val(),
			period: $period.val()
		};
		if ($id !== '') {
			trans.id = $id;
		}
		db.insert(trans, function(item) {
			console.log('got back:', item);
			$name.val('');
			$link.val('');
			$date.val('');
			$skip.val('');
			$period.val('');
		});
	});
	
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
