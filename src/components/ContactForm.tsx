import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShinyButton } from './magicui/shiny-button';
import { Ripple } from './magicui/ripple';

export function ContactForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    productType: '',
    projectRequirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', companyName: '', productType: '', projectRequirements: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-2">
      <Ripple className="fixed inset-0 z-0" mainCircleSize={250} mainCircleOpacity={0.35} numCircles={10} />
      <div className="relative z-10 w-full max-w-sm space-y-1.5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold text-foreground">Contact Us</h2>
          <ShinyButton
            onClick={() => navigate('/')}
            className="text-[8px] sm:text-[9px] px-1.5 py-0.5 bg-background/95 dark:bg-background/80 text-foreground"
          >
            Back to Home
          </ShinyButton>
        </div>
        <form onSubmit={handleSubmit} className="space-y-1.5">
          <div className="space-y-0.5">
            <label htmlFor="name" className="block text-xs font-medium text-foreground">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-2 py-1 border border-border/50 rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm text-sm"
            />
          </div>
          <div className="space-y-0.5">
            <label htmlFor="email" className="block text-xs font-medium text-foreground">
              Business Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@company.com"
              className="w-full px-2 py-1 border border-border/50 rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm text-sm"
            />
          </div>
          <div className="space-y-0.5">
            <label htmlFor="companyName" className="block text-xs font-medium text-foreground">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Your Company Ltd."
              className="w-full px-2 py-1 border border-border/50 rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm text-sm"
            />
          </div>
          <div className="space-y-0.5">
            <label htmlFor="productType" className="block text-xs font-medium text-foreground">
              Product Type *
            </label>
            <select
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border border-border/50 rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm text-sm"
            >
              <option value="">Select a product type</option>
              <option value="ai-agent">AI Agent Development</option>
              <option value="web-app">Web Application</option>
              <option value="mobile-app">Mobile Application</option>
              <option value="custom-solution">Custom Solution</option>
            </select>
          </div>
          <div className="space-y-0.5">
            <label htmlFor="projectRequirements" className="block text-xs font-medium text-foreground">
              Project Requirements *
            </label>
            <textarea
              id="projectRequirements"
              name="projectRequirements"
              value={formData.projectRequirements}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Please describe your project requirements and goals..."
              className="w-full px-2 py-1 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none text-sm"
            />
          </div>
          <div className="flex justify-center">
            <ShinyButton
              type="submit"
              className="px-8 py-2 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground hover:from-primary hover:to-primary/90 transition-all duration-300 font-medium tracking-wide shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2"
            >
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
            </ShinyButton>
          </div>
        </form>
      </div>
    </div>
  );
}