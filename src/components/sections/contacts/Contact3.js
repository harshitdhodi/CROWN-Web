"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ReactNiceSelect from "@/components/shared/Inputs/ReactNiceSelect";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LazyMap from "@/components/shared/LazyMap";

const Contact3 = ({ mapUrl, formHeading }) => {
    console.log("mapUrl", mapUrl);
    const headingText = typeof formHeading === 'string'
        ? formHeading
        : (formHeading?.form_heading || "Feel Free to Get in Touch or Visit our Location.");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service_id: "",
        message: ""
    });
    console.log("form Data", formData)
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [servicesError, setServicesError] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    // Fetch services dynamically
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setServicesLoading(true);
                const response = await fetch("/api/data/service");

                if (!response.ok) {
                    throw new Error("Failed to load services");
                }

                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    setServices(result.data);
                } else {
                    throw new Error("Invalid service data format");
                }
            } catch (err) {
                console.error("Error fetching services:", err);
                setServicesError("Failed to load services. Please refresh the page.");
                // Optional: fallback to static options
            } finally {
                setServicesLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!formData.name || !formData.email || !formData.message) {
            setError("All fields are required");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, url: typeof window !== 'undefined' ? window.location.href : '' }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to submit form");
            }

            setSuccess(true);
            setFormData({ name: "", email: "", phone: "", service_id: "", message: "" });
            router.push("/contact/thank-you");
        } catch (err) {
            setError(err.message || "Failed to submit form");
        } finally {
            setLoading(false);
        }
    };

    // Convert API data to ReactNiceSelect format
    const options = [
        { value: "", optionName: "Choose a service" },
        ...services.map((service) => ({
            value: String(service.id),  // ensure it's a string
            optionName: service.title,
        }))
    ];

    if (success) {
        return (
            <section className="tj-contact-section-2  section-bottom-gap">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <div className="success-message">
                                <h3 className="title">Thank You!</h3>
                                <p className="text-muted">Your message has been sent successfully. We'll get back to you shortly.</p>
                                <ButtonPrimary text="Back to Contact" onClick={() => router.push("/contact")} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="tj-contact-section-2 section-gap section-bottom-gap">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="contact-form wow fadeInUp" data-wow-delay=".1s">
                            <h3 className="title">
                                {headingText}
                            </h3>

                            {error && (
                                <div className="alert alert-danger" style={{ background: "#f8d7da", color: "#721c24", padding: "12px", borderRadius: "4px", marginBottom: "15px" }}>
                                    {error}
                                </div>
                            )}

                            {servicesError && (
                                <div className="alert alert-warning" style={{ background: "#fff3cd", color: "#856404", padding: "12px", borderRadius: "4px", marginBottom: "15px" }}>
                                    {servicesError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-input">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Full Name*"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-input">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email Address*"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-input">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-input">
                                            <div className="tj-nice-select-box">
                                                <div className="tj-select">
                                                    <ReactNiceSelect
                                                        options={options}
                                                        getSelectedOption={(val) => {
                                                            console.log("ReactNiceSelect onChange:", val);
                                                            setFormData(prev => ({ ...prev, service_id: val }))
                                                        }}
                                                        disabled={servicesLoading}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        <div className="form-input message-input">
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                id="message"
                                                placeholder="Type message*"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="submit-btn">
                                        <ButtonPrimary
                                            type="submit"
                                            text={loading ? "Sending..." : "Submit Now"}
                                            disabled={loading || servicesLoading}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div
                            className="map-area wow fadeInUp"
                            data-wow-delay=".3s"
                            style={{
                                backgroundColor: 'var(--tj-color-theme-dark)',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}
                        >
                            {mapUrl ? (
                                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="map-link d-block h-100">
                                    <LazyMap
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(mapUrl)}&output=embed`}
                                        width="100%"
                                        height="100%"
                                        style={{
                                            border: 0,
                                            filter: 'grayscale(100%) contrast(1.2)',
                                            opacity: 0.6,
                                            mixBlendMode: 'luminosity'
                                        }}
                                        loading="lazy"
                                        allowFullScreen=""
                                    />
                                </a>
                            ) : (
                                "Map not found"
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact3;