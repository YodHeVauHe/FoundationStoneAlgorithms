import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShinyButton } from "./magicui/shiny-button";
import { Ripple } from "./magicui/ripple";

export function ContactForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    productType: "",
    projectRequirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
      // Reset form
      setFormData({
        name: "",
        email: "",
        companyName: "",
        productType: "",
        projectRequirements: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Ripple
        className="fixed inset-0 z-0"
        mainCircleSize={250}
        mainCircleOpacity={0.35}
        numCircles={10}
      />
      <div className="relative w-full max-w-lg">
        <ShinyButton
          onClick={() => navigate("/")}
          className="absolute -top-10 left-0 text-[9px] px-2 py-0.5 bg-background/95 dark:bg-background/80 text-foreground hover:bg-background/90 transition-colors"
        >
          Back to Home
        </ShinyButton>
        <div className="relative z-10 w-full space-y-4 bg-background/30 backdrop-blur-lg rounded-xl p-5 shadow-2xl border border-white/10">
          <div className="flex flex-col items-center text-center gap-2 mb-2">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Contact Us
              </h2>
              <p className="text-xs text-foreground/70">
                Fill out the form below and we'll get back to you shortly.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-xs font-medium text-foreground"
              >
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-2.5 py-1.5 border border-border/50 rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 backdrop-blur-sm text-sm placeholder:text-foreground/50"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-foreground"
              >
                Business Email <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@company.com"
                className="w-full px-2.5 py-1.5 border border-border/50 rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 backdrop-blur-sm text-sm placeholder:text-foreground/50"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="companyName"
                className="block text-xs font-medium text-foreground"
              >
                Company Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Your Company Ltd."
                className="w-full px-2.5 py-1.5 border border-border/50 rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 backdrop-blur-sm text-sm placeholder:text-foreground/50"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="productType"
                className="block text-xs font-medium text-foreground"
              >
                Product Type <span className="text-primary">*</span>
              </label>
              <select
                id="productType"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                required
                className="w-full px-2.5 py-1.5 border border-border/50 rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 backdrop-blur-sm text-sm appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                <option value="">Select a product type</option>
                <option value="ai-agent">AI Agent Development</option>
                <option value="web-app">Web Application</option>
                <option value="mobile-app">Mobile Application</option>
                <option value="custom-solution">Custom Solution</option>
              </select>
            </div>

            <div className="col-span-2 space-y-1">
              <label
                htmlFor="projectRequirements"
                className="block text-xs font-medium text-foreground"
              >
                Project Requirements <span className="text-primary">*</span>
              </label>
              <textarea
                id="projectRequirements"
                name="projectRequirements"
                value={formData.projectRequirements}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Please describe your project requirements and goals..."
                className="w-full px-2.5 py-1.5 border border-border/50 rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200 backdrop-blur-sm text-sm resize-none placeholder:text-foreground/50"
              />
            </div>

            <div className="col-span-2">
              <ShinyButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground hover:from-primary hover:to-primary/90 transition-all duration-300 font-medium tracking-wide shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </ShinyButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
