<?php
	require "header.php";
	?>
		<script type="module" src="myjs/postController.js"></script>
		<div class="site-main-container">
			<!-- Start latest-post Area -->
			<section class="latest-post-area pb-120">
				<div class="container no-padding">
					<div class="row">
						<div class="col-lg-8 post-list">
							<!-- Start single-post Area -->
							<div class="single-post-wrap">
								<div class="feature-img-thumb relative">
									<div class="overlay overlay-bg"></div>
									<img id="main-img" class="img-fluid" alt="">
								</div>
								<div class="content-wrap">
									<ul class="tags mt-10">
										<li><a id="column-name" href="#"></a></li>
									</ul>
									<h3 id="title"></h3>									
									<ul class="meta pb-20">
										<li><a id="author-name" href="#"><span class="lnr lnr-user"></span></a></li>
										<li><a id="date" href="#"><span class="lnr lnr-calendar-full"></span></a></li>
									</ul>
									<div class="article-lead" id="lead"></div>
									<div id="text" class="article-text"></div>																								
							</div>							
						</div>
						<!-- End single-post Area -->
					</div>
					<div class="col-lg-4">
						<div class="sidebars-area">
							<?php 
							require "recommended.php"
							?>
							<?php
							require "notes.php";
							?>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- End latest-post Area -->
	</div>
	
<?php
require "footer.php";
?>