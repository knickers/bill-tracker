var ordinal = function(num) {
	var n = String(num).substr(-1);
	if (n === '1') return 'st';
	if (n === '2') return 'nd';
	if (n === '3') return 'rd';
	return 'th';
};

var recalculate = function() {
	var total = 0;
	$('.transaction:not(.hide)').each(function() {
		var self = $(this);
		var dollar = self.find('.amount .dollar');
		var amount = parseFloat(dollar.text());
		if (amount < 0) {
			dollar.addClass('red');
		} else {
			dollar.removeClass('red');
		}
		
		total += amount;
		
		self.find('.total .dollar').text(total.toFixed(2));
	});
};

var updateTransactionRow = function(trans, newVals) {
	var a = newVals.amount || 0;
	var d = new Date(newVals.date);
	/* dates are saved in UTC, so add in the local timezone */
	d.setTime(d.getTime() + d.getTimezoneOffset() * 60000);
	
	trans.attr('id', 'transaction-' + newVals.id);
	trans.data('trans', newVals);
	trans.find('.date').text(d.getDate());
	trans.find('.ordinal').text(ordinal(d.getDate()));
	trans.find('.name .link').text(newVals.name).attr('href', newVals.link);
	trans.find('.amount .dollar').text(Number(a).toFixed(2));
	trans.find('.month input').prop('checked', !!newVals.paid);
	
	recalculate();
};

var modalKeys = ['id', 'name', 'link', 'date', 'skip', 'period', 'amount'];
var getModalData = function() {
	var data = {};
	for (var i=0; i<modalKeys.length; i++) {
		var key = modalKeys[i];
		data[key] = $('#transaction-' + key).val();
	}
	return data;
};
var setModalData = function(data) {
	for (var i=0; i<modalKeys.length; i++) {
		var key = modalKeys[i];
		$('#transaction-' + key).val(data[key]);
	}
};
var clearModalData = function() {
	for (var i=0; i<modalKeys.length; i++) {
		$('#transaction-' + modalKeys[i]).val('');
	}
};

