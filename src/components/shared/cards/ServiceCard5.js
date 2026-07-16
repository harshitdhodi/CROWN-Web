import modifyNumber from "@/libs/modifyNumber";

const ServiceCard5 = ({ service, idx, lastItemIdx }) => {
  const {
    title,
    desc,
    id,
    img,          // ✅ was img3 (never passed from parent)
    icon,         // ✅ the icon_image URL
  } = service || {};

  return (
    <div
      className={`service-item style-5 ${
        idx !== lastItemIdx ? "service-stack" : ""
      }`}
    >
      <div className="service-content-area">
        <div className="service-icon">
          {icon
            ? <img src={icon} alt={title || ""} width={48} height={48} style={{ objectFit: "contain", width: "48px", height: "48px" }} />
            : <i className="tji-service-1"></i>
          }
        </div>
        <div className="service-content" style={{ maxWidth: "460px" }}>
          <span className="no title">{modifyNumber(idx + 1)}.</span>
          <h3 className="title" style={{ maxWidth: "420px" }}>
            <span>{title}</span>
          </h3>
          <p className="desc" style={{ color: "var(--tj-color-text-body-5)" }}>{desc}</p>
          {/* <ButtonPrimary text={"Learn More"} aria-label={`Learn More about ${title}`} /> */}
        </div>
      </div>
      <div className="service-img">
        {/* Plain img so CSS height:605px + object-fit:cover from _h4-services.scss takes full effect */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img || "/images/service/service-6.webp"}
          alt={title || ""}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    </div>
  );
};

export default ServiceCard5;