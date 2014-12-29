jQuery(function($) {
	var DB = new IndexedDB('bill-tracker', 'transactions');
	var TRANS = $('#transactions .transaction.hide');
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
		DB.open(2, function() {
			DB.getAll(rebuild);
		});
	};
	
	var rebuild = function(transactions) {
		var exploded = [];
		for (var i=0; i<transactions.length; i++) {
			var T = transactions[i];
			/*for (var j=0; j<T.occurences.length; j++) {
				var t = T.occurences[j];
				exploded.push({
					id: T.id,
					date: t.date,
					name: T.name,
					amount: T.amount,
					complete: t.complete
				});
			}*/
		}
		for (var i=0; i<transactions.length; i++) {
			var T = TRANS.clone(true, true).removeClass('hide');
			var t = transactions[i];
			console.log(t);
			T.find('.date').text(t.date);
			T.find('.name').text(t.name);
			T.find('.link').attr('href', t.link);
			T.find('.amount').text(t.amount);
			T.find('.month input').prop('checked', !!t.paid);
			$('#transactions').append(T);
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
		DB.insert(trans, function(item) {
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
