import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Link from "next/link";

const ThankYou = () => {
	return (
		<section className="tj-thankyou-section section-gap">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-lg-8">
						<div className="thankyou-content text-center">
							<div className="thankyou-icon mb-4">
								<i className="tji-check-circle" style={{ fontSize: '80px', color: '#10b981' }}></i>
							</div>
							<h2 className="title mb-3">Thank You!</h2>
							<p className="mb-4">
								We have received your application and our HR team will review it shortly.
								We'll contact you if your profile matches our requirements.
							</p>
							<div className="thankyou-btns">
								<ButtonPrimary
									text="Back to Home"
									url="/"
									className="btn-primary me-3"
								/>
								<ButtonPrimary
									text="Get In Touch"
									url="/contact"
									className="btn-outline"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ThankYou;
