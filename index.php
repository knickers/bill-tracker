<?php
$bills = mysql_query('
	SELECT b.*, p.date AS paid
	FROM bills AS b
	LEFT JOIN payments AS p
		ON b.id = p.bill_id
		AND MONTH(p.date) = MONTH(NOW())
');
?>
<html>
	<head>
		<title>Bill Tracker</title>
		<meta name="viewport" content="width=device-width, user-scalable=no">
		<link href="main.css" rel="stylesheet" type="text/css"/>
		<script type="text/javascript" src="jquery-2.0.3.min.js"></script>
		<script type="text/javascript" src="main.js"></script>
	</head>
	<body>
		<table cellspacing="0">
			<tr class="">
				<th class="date">Date</th>
				<th class="name">Name</th>
				<th class="amount">Amount</th>
				<th class="total">Total</th>
				<th class="month" data-val="<?php echo date('m') ?>">
					<?php echo date('M') ?>
				</th>
			</tr>
			<?php while($bill = mysql_fetch_assoc($bills)) : ?>
				<tr class="transaction">
					<td class="date"><?php echo $bill['date'] ?></td>
					<td class="name"><?php echo $bill['name'] ?></td>
					<td class="amount">
						<span class="dollar">
							<?php echo $bill['amount'] ?>
						</span>
						$
					</td>
					<td class="total"><span class="dollar"></span>$</td>
					<td class="month">
						<input type="checkbox" <?php echo $bill['paid'] ? 'checked' : '' ?>/>
					</td>
				</tr>
			<?php endwhile; ?>
		</table>
	</body>
</html>
