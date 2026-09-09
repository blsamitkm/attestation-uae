<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
		<title>Consignment track in Kuwait - BLS International</title>
		<meta name="keywords" content="Consignment track">
		<meta name="description" content="Consignment track">
		<link rel="apple-touch-icon" sizes="512x512" href="assets/images/android-chrome-512x512.png">
		<link rel="apple-touch-icon" sizes="192x192" href="assets/images/android-chrome-192x192.png">
		<link rel="apple-touch-icon" sizes="180x180" href="assets/images/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicon-16x16.png">
		<!-- Stylesheets -->
		<link href="assets/css/bootstrap.min.css" rel="stylesheet" />
		<link href="assets/css/animate.compat.min.css" rel="stylesheet" />
		<link href="assets/css/owl.carousel.min.css" rel="stylesheet" />
		<link href="assets/css/owl.theme.default.min.css" rel="stylesheet" />
		<link href="assets/css/style.css" rel="stylesheet" />
		<style>
		body {
			position: absolute !Important;
		}
		</style>
		<?php include 'ganalytics.php'; ?>
	</head>
	<body>
		<?php include 'header.php' ?>
			<div class="inner_page">
				<div class="container">
					<div class="sec-title">
						<h2>Consignment Track Application</h2>
						<div class="dotted-box"> <span class="dotted"></span> <span class="dotted"></span> <span class="dotted"></span> </div>
					</div> 
					<!--<form id="trackForm">
					<div class="row">
					<div class="mb-12">
  <div class="mb-6">
    <input id="consignmentNo" class="form-control" type="text" placeholder="Enter your consignment track number"
           aria-label="Consignment track" required />
  </div>
   <div class="mb-3">
   <button type="submit" class="btn btn-primary">Track</button>
   </div>
  </div>
 </div>
</form>-->

<form id="trackForm">
  <div class="row align-items-end">
    <div class="col-md-6">
      <div class="mb-3">
        <input
          id="consignmentNo"
          class="form-control"
          type="text"
          placeholder="Enter your consignment track number"
          aria-label="Consignment track"
          required
        />
      </div>
    </div>
    <div class="col-md-2">
      <div class="mb-3">
        <button type="submit" class="btn btn-primary w-100">Track</button>
      </div>
    </div>
  </div>
</form>

<div id="trackResult" class="mt-3"></div>



				</div>
			</div>
		<?php include 'footer.php' ?>
		
		
		<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
  $('#trackForm').on('submit', function (e) {
  e.preventDefault();

  const consignmentNo = $('#consignmentNo').val().trim();
  if (!consignmentNo) {
    $('#trackResult').html('<div class="alert alert-danger">Please enter a consignment number.</div>');
    return;
  }

  const $btn = $(this).find('button[type="submit"]');
  const originalText = $btn.text();
  $btn.prop('disabled', true).text('Tracking...');

  $.ajax({
    url: 'http://192.168.3.245:8000/uae-attestation/software/courier/CheckConsignment',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ consignmentNo: consignmentNo }),

    success: function (res) {
      if (res.success && res.html) {
        $('#trackResult').html(res.html); // this shows your table
      } else {
        $('#trackResult').html(
          '<div class="alert alert-danger">' +
            (res.message || 'Failed to fetch tracking status.') +
          '</div>'
        );
      }
    },

    error: function (xhr) {
      let msg = 'Failed to fetch tracking status.';
      if (xhr && xhr.responseJSON && xhr.responseJSON.message) {
        msg = xhr.responseJSON.message;
      }
      $('#trackResult').html('<div class="alert alert-danger">' + msg + '</div>');
    },

    complete: function () {
      $btn.prop('disabled', false).text(originalText);
    }
  });
});
</script>
<style>.shipment-table {
  width: 100%; 
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 14px;
  margin: 20px 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
}

.shipment-table th,
.shipment-table td {
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.shipment-table th {
  background: #f3f4f6;
  color: #111827;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.shipment-table tbody tr:last-child td {
  border-bottom: none;
}

.shipment-table tbody tr:hover {
  background: #f9fafb;
}

.shipment-table td:nth-child(3) {
  font-weight: 500;
}

/* Status colors (optional) */
.shipment-table td.status-pending {
  color: #b45309; /* amber/dark orange */
}
.shipment-table td.status-done {
  color: #047857; /* green */
}
.shipment-table td.status-error {
  color: #b91c1c; /* red */
}</style>
	</body> 
</html>