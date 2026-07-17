"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ReactNiceSelect from "@/components/shared/Inputs/ReactNiceSelect";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

const fieldStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    outline: "none",
    fontSize: "14px",
    color: "#1a1a1a",
    background: "#fafafa",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
};

const fieldWrap = { marginBottom: "12px", width: "100%" };

const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
};

/**
 * Reusable contact/enquiry form.
 * Props:
 *  - singleColumn: boolean — stacks all fields in one column (default: false = 2-col grid)
 *  - redirectPath: string  — where to push after success
 *  - compact: boolean      — compact layout for sidebar
 */
const ContactForm = ({
    singleColumn = false,
    redirectPath = "/contact/thank-you",
    compact = false,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        product_id: "",
        message: "",
    });
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setProductsLoading(true);
                const res = await fetch("/api/data/our_products");
                if (!res.ok) throw new Error("Failed to load products");
                const result = await res.json();
                if (result.success && Array.isArray(result.data)) {
                    setProducts(result.data);
                } else {
                    throw new Error("Invalid product data format");
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setProductsError("Failed to load products.");
            } finally {
                setProductsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const options = useMemo(() => [
        { value: "", optionName: "Choose a product" },
        ...products.map((p) => ({ value: String(p.id), optionName: p.name })),
    ], [products]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductSelect = useCallback((val) => {
        setFormData((prev) => ({ ...prev, product_id: val }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!formData.name || !formData.email || !formData.message) {
            setError("Name, email and message are required.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    url: typeof window !== "undefined" ? window.location.href : "",
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Failed to submit form");
            setFormData({ name: "", email: "", phone: "", product_id: "", message: "" });
            router.push(redirectPath);
        } catch (err) {
            setError(err.message || "Failed to submit form");
        } finally {
            setLoading(false);
        }
    };

    /* For the contact page (not compact) we keep the 2-col grid via Bootstrap */
    if (!compact) {
        const colClass = singleColumn ? "col-12" : "col-sm-6";
        return (
            <div className="contact-form">
                {error && (
                    <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px 14px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className={`${colClass} mb-3`}>
                            <div className="form-input">
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name*" required />
                            </div>
                        </div>
                        <div className={`${colClass} mb-3`}>
                            <div className="form-input">
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address*" required />
                            </div>
                        </div>
                        <div className={`${colClass} mb-3`}>
                            <div className="form-input">
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" />
                            </div>
                        </div>
                        <div className={`${colClass} mb-3`}>
                            <div className="form-input">
                                <div className="tj-nice-select-box">
                                    <div className="tj-select">
                                        <ReactNiceSelect options={options} getSelectedOption={handleProductSelect} disabled={productsLoading} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 my-3">
                            <div className="form-input message-input">
                                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Type message*" required rows={5} />
                            </div>
                        </div>
                        <div className="submit-btn">
                            <ButtonPrimary type="submit" text={loading ? "Sending..." : "Submit Now"} disabled={loading || productsLoading} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    /* ── Compact sidebar form ── */
    return (
        <div>
            <style>{`
                .enquiry-input {
                    width: 100%;
                    padding: 10px 14px;
                    border-radius: 8px;
                    border: 1.5px solid #e5e7eb;
                    outline: none;
                    font-size: 13.5px;
                    color: #1a1a1a;
                    background: #f9fafb;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                    display: block;
                }
                .enquiry-input:focus {
                    border-color: #c49e48;
                    box-shadow: 0 0 0 3px rgba(196,158,72,0.12);
                    background: #fff;
                }
                .enquiry-input::placeholder { color: #9ca3af; }
                .enquiry-field { margin-bottom: 12px; width: 100%; }
                .enquiry-label {
                    display: block;
                    font-size: 11px;
                    font-weight: 700;
                    color: #6b7280;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                }
                /* Override nice-select to exactly match .enquiry-input */
                .enquiry-select .nice-select {
                    width: 100% !important;
                    border: 1.5px solid #e5e7eb !important;
                    border-radius: 8px !important;
                    background: #f9fafb !important;
                    font-size: 13.5px !important;
                    height: 42px !important;
                    line-height: 40px !important;
                    padding: 0 36px 0 14px !important;
                    color: #9ca3af !important;
                    box-shadow: none !important;
                    margin: 0 !important;
                    float: none !important;
                }
                .enquiry-select .nice-select.open,
                .enquiry-select .nice-select:focus {
                    border-color: #c49e48 !important;
                    box-shadow: 0 0 0 3px rgba(196,158,72,0.12) !important;
                }
                .enquiry-select .nice-select .current {
                    color: #9ca3af !important;
                    font-size: 13.5px !important;
                }
                .enquiry-select .nice-select.has-value .current {
                    color: #1a1a1a !important;
                }
                .enquiry-select .nice-select .list {
                    border-radius: 8px !important;
                    border: 1.5px solid #e5e7eb !important;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.10) !important;
                    width: 100% !important;
                }
                /* Remove any extra margin/padding the library adds around the select */
                .enquiry-select {
                    display: block;
                    width: 100%;
                    line-height: 1;
                }
                .enquiry-textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                .enquiry-submit-btn {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #c49e48 0%, #a07c2e 100%);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    letter-spacing: 0.3px;
                    transition: opacity 0.2s, transform 0.2s;
                    margin-top: 4px;
                }
                .enquiry-submit-btn:hover:not(:disabled) {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .enquiry-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>

            {error && (
                <div style={{ background: "#fef2f2", color: "#dc2626", padding: "9px 12px", borderRadius: "7px", marginBottom: "12px", fontSize: "12.5px", border: "1px solid #fecaca" }}>
                    {error}
                </div>
            )}
            {productsError && (
                <div style={{ background: "#fffbeb", color: "#92400e", padding: "9px 12px", borderRadius: "7px", marginBottom: "12px", fontSize: "12.5px", border: "1px solid #fde68a" }}>
                    {productsError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="enquiry-field">
                    <label className="enquiry-label">Full Name *</label>
                    <input className="enquiry-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Smith" required />
                </div>

                <div className="enquiry-field">
                    <label className="enquiry-label">Email Address *</label>
                    <input className="enquiry-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>

                <div className="enquiry-field">
                    <label className="enquiry-label">Phone Number</label>
                    <input className="enquiry-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (000) 000-0000" />
                </div>

                <div className="enquiry-field">
                    <label className="enquiry-label">Product of Interest</label>
                    <div className="enquiry-select">
                        <ReactNiceSelect options={options} getSelectedOption={handleProductSelect} disabled={productsLoading} />
                    </div>
                </div>

                <div className="enquiry-field">
                    <label className="enquiry-label">Your Message *</label>
                    <textarea className="enquiry-input enquiry-textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Describe your requirements..." required rows={3} />
                </div>

                <button type="submit" className="enquiry-submit-btn" disabled={loading || productsLoading}>
                    {loading ? (
                        <span>Sending&hellip;</span>
                    ) : (
                        <span>Send Enquiry <i className="tji-arrow-right" style={{ marginLeft: "6px" }}></i></span>
                    )}
                </button>

                <p style={{ textAlign: "center", fontSize: "11.5px", color: "#9ca3af", marginTop: "10px", marginBottom: 0 }}>
                    🔒 Your information is secure &amp; confidential
                </p>
            </form>
        </div>
    );
};

export default ContactForm;
