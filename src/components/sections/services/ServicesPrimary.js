import ServiceCard4 from "@/components/shared/cards/ServiceCard4";
import getALlServices from "@/libs/getALlServices";
import makeWowDelay from "@/libs/makeWowDelay";

const ServicesPrimary = async () => {
	const items = await getALlServices();
console.log("Fetched services:", items); // Debug log to check fetched data
	return (
		<div className="tj-service-section service-4 section-gap">
			<div className="container">
				<div className="row row-gap-4">
					{items?.length
						? items.map((item, idx) => (
								<div
									key={item.id || idx}
									className="col-lg-4 col-md-6 wow fadeInUp"
									data-wow-delay={makeWowDelay(idx, 0.1)}
								>
									<ServiceCard4 service={item} idx={idx} />
								</div>
						  ))
						: ""}
				</div>
			</div>
		</div>
	);
};

export default ServicesPrimary;
