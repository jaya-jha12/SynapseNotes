import { useState } from "react";
import { Mail, Phone, MapPin, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

export const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Clear form
      } else {
        toast.error(data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-purple-400 font-serif mb-6">Contact Us</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">
          Have any questions? Reach out below—we’d love to hear from you!
        </p>

        {/* Contact Info (Unchanged) */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <Mail className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-gray-400">testermailuse14@gmail.com</p>
          </div>
          <div className="flex flex-col items-center">
            <Phone className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="font-semibold">Phone</h3>
            <p className="text-gray-400">+91 8178322487</p>
          </div>
          <div className="flex flex-col items-center">
            <MapPin className="w-8 h-8 text-red-400 mb-2" />
            <h3 className="font-semibold">Location</h3>
            <p className="text-gray-400">New Delhi, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            required
          ></textarea>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};