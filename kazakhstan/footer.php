<footer>
	<div class="container">
		<div class="row">
			<div class="col-12 col-md-4">
				<h3>Quick links</h3>
				<ul>
					<li><a href="./">Home</a></li>
					<li><a href="about.php">About Us</a></li>
					<li><a href="contact.php">Contact Us</a></li>
					<!--li><a href="https://www.mofa.gov.ae/EN" target="_blank">Ministry of Foreign Affairs - UAE</a></li-->
				</ul>
			</div>
			<div class="col-12 col-md-4">
				<h3>Services</h3>
                <ul>
					<li><a href="birth-certification.php">Birth Certificate Attestation For UAE</a></li>
					<li><a href="marriage-certification.php">Marriage Certificate Attestation For UAE</a></li>
					<li><a href="education-certification.php">Educational Certificate Attestation For UAE</a></li>
					<li><a href="degree-certification.php">Degree Certificate Attestation For UAE</a></li>
					<li><a href="diploma-certification.php">Diploma Certificate Attestation For UAE</a></li>
					<li><a href="pcc-certification.php">PCC (police clearance certificate) Attestation For UAE</a></li>
				</ul>     
			</div>
			<!--div class="col-12 col-md-3">
				<h3 class="none_mob">Visa services</h3>
				<ul>
					<ul>
					<li><p>Schengen Visa (Short Term)</p>
						<li><a href="schengen-tourism-visa.php">Tourism</a></li>
						<li><a href="schengen-business-visa.php">Business</a></li>
						<li><a href="schengen-mt-visa.php">Medical Treatment</a></li>
						<li><a href="schengen-visitfriendfamily-visa.php">Visiting Family/Friends</a></li>
					</li>
					</ul>
				</ul>
                <ul>
					<ul>
					<li><p>National Visa (Long Term)</p>
						<li><a href="national-employment-visa.php">Employment Visa</a></li>
					</li>
					</ul>
				</ul>             
			</div-->
			<div class="col-12 col-md-4">
                <h3>Information </h3>
				<ul>
					<li><a href="useful-links.php">Useful Links</a></li>
					<li><a href="faq.php">FAQs</a></li>
				</ul>
			</div>
		</div>
        <div class="footer-bottom">
			<div class="copyright">
				<p>(©) <?php echo date("Y"); ?><a href="https://blsinternational.com/" target="_blank"> BLS International </a> . All Rights Reserved</p>
			</div>
			<ol>
				<li><a href="disclaimer.php">Disclaimer</a></li>
				<li><a href="cookies.php">Cookies policy</a></li>
				<li><a href="privacy-policy.php">Privacy notice</a></li>
				<!--li><a href="privacy-policy.php">Privacy policy</a></li>
				<li><a href="copy-right-policy.php">Copyright policy</a></li-->
				<li><a href="terms-conditions.php">Terms & conditions</a></li>
			</ol>
		</div>
</footer>
<script src="assets/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/jquery-3.7.1.slim.min.js"></script>
<script src="assets/js/owl.carousel.min.js"></script>
<script src="assets/js/wow.min.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/sienna.min.js"></script>
<style>
.but-process {
    background: #c99825;
    color: #fff;
    padding: 15px 15px;
    /*margin: 15px 0px 0px 0px;*/
    display: block;
    text-align: center;
    font-weight: bold;
    border: solid 1px;
	border-radius: 5px;
}
</style>
<div class="cookies" style="padding:15px 0; z-index:999; position:fixed; bottom:0; left:0; right:0; background: #fff; box-shadow: 0 -1px 4px rgba(0,0,0,0.1);display:none;">
<div class="container" >
    <div class="row align-items-center">
		<div class="col-md-8">
			<div class="left" >
				<h5>We respect your privacy!</h5>
				  <p style="font-size: 15px; margin:0">We use cookies to ensure our website functions properly and to improve your experience. To learn more about our use of the cookies, refer to our<a href="cookies.php" target="_blank" style="border:none; color: #b9952e; display: inline-block; margin-left:3px;">Cookie Policy</a>.</p>
			</div>				
		</div>
		<div class="col-md-4" >
			<div class="right"> 
			<a href="javascript:;" class="cl but-process" role="button" aria-pressed="true">ACCEPT ALL COOKIES</a></br>
			<a href="javascript:;" class="cl but-process" role="button" aria-pressed="true">ACCEPT ONLY NECESSARY</a>
			<!--a href="javascript:;" class="close btn btn-primary me-3">Accept Only Necessary Cookies</a> </br>
		    <!--a href="javascript:;" class="close btn btn-primary ">Accept All Cookies</a>
        <!--<a href="javascript:;" class="close btn btn-primary reject-btn">Accept All Cookies</a>-->
      </div>
		</div>
	</div>
 </div>
</div>
    
 
<script>
$(".reject-btn").click(function(){
  $(".cookies").hide();
});
  function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  
  function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); 
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; 
  }

 
  function checkCookieConsent() {
    let consent = getCookie('cookie_consent');
    if (!consent) {
      document.querySelector('.cookies').style.display = 'block'; 
    }
  }

 
  document.querySelectorAll('.cookies .cl').forEach(el => el.addEventListener('click',function (e) {
  // document.querySelectorAll('.cookies .cl').addEventListener('click', function () {
    setCookie('cookie_consent', 'true', 365);
    document.querySelector('.cookies').style.display = 'none'; 
	sendData();
  }));

  
  function sendData() {
    let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
	let postData = {
    log: [
      {"name":"necessary","status":"yes"},
      {"name":"analytics","status":"yes"},
      {"ip"  : "64.94.87.129"}
    ]
  };

   
    fetch('data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken 
      },
      body: JSON.stringify(postData) 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Server error or invalid response');
      }
      return response.json(); // Parse the JSON response
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

 
  window.onload = function() {
    checkCookieConsent();
    //sendData(); 
    $('#investorModal').modal('show');
  };
</script>
 </div>
</body>
  
</html>