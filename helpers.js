var ordinal = function(num) {
	var s = String(num);
	if (s.length > 1 && s.substr(-2, 1) === '1') return 'th';
	var n = s.substr(-1);
	if (n === '1') return 'st';
	if (n === '2') return 'nd';
	if (n === '3') return 'rd';
	return 'th';
};

var recalculate = function() {
	var total = 0;
	$('.transaction:not(.hide)').each(function() {
		var self = $(this);
		var dollar = self.find('.amount');
		var amount = parseFloat(dollar.text());
		dollar.toggleClass('red', amount < 0);
		
		total += amount;
		
		self.find('.total')
			.text(total.toFixed(2))
			.toggleClass('red', total < 0);
	});
};

var updateTransactionRow = function(trans, data) {
	var a = data.amount || 0;
	
	trans.attr('id', 'transaction-' + data.id);
	trans.data('trans', data);
	trans.find('.day').text(data.day);
	trans.find('.date').text(data.date);
	trans.find('.ordinal sup').text(ordinal(data.date));
	trans.find('.name .link').text(data.name).attr('href', data.link);
	trans.find('.amount').text(Number(a).toFixed(2));
	if (data.payments) {
		trans.find('.paid input')
			.prop('checked', !!data.payments[data.due])
			.attr('title', 'Paid on ' + data.payments[data.due]);
	}
	
	recalculate();
};

var modalKeys = ['id','day','date','name','link','skip','period','amount'];
var getModalData = function() {
	var data = {};
	for (var i=0; i<modalKeys.length; i++) {
		data[modalKeys[i]] = $('#transaction-' + modalKeys[i]).val();
	}
	return data;
};
var setModalData = function(data) {
	for (var i=0; i<modalKeys.length; i++) {
		$('#transaction-' + modalKeys[i]).val(data[modalKeys[i]]);
	}
	if (!data.day || data.day== '') { $('#transaction-period').val('day'); }
};
var clearModalData = function() {
	setModalData({});
};

var clone = function(obj) {
	if (obj == null || typeof(obj) != 'object') {
		return obj;
	}
	var copy = obj.constructor();
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			copy[key] = obj[key];
		}
	}
	return copy;
};
