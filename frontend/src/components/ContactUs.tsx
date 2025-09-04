import { Mail, Phone, MapPin } from "lucide-react";

export const ContactUs = () => {
  return (
    <section id="contact" className="bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-purple-400 font-serif mb-6">Contact Us</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">
          Have any questions or want to work with us? Reach out through the form
          or use the details below—we’d love to hear from you!
        </p>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <Mail className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-gray-400">jayajha122006@gmail.com</p>
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
        <form className="max-w-2xl mx-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>
          <textarea
            placeholder="Your Message"
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-3 rounded-lg font-semibold"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};
