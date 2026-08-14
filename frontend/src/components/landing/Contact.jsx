import { Mail, MapPin, Users, GraduationCap } from 'lucide-react';

const GOOGLE_MAPS_LINK = 'https://www.google.com/maps/place/Shree+Venkateshwara+Hi-Tech+Engineering+College/@11.1403316,77.4996336,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba93f17e9e6017b:0xe3d715156d58259a!8m2!3d11.1403316!4d77.4996336!16s';
const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.0!2d77.4996336!3d11.1403316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba93f17e9e6017b%3A0xe3d715156d58259a!2sShree%20Venkateshwara%20Hi-Tech%20Engineering%20College!5e0!3m2!1sen!2sin!4v1691234567890!5m2!1sen!2sin';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-dark relative z-10 border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-400 text-lg">Have questions? Reach out to our organizing team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            {/* Location */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-dark-surface/50 border border-gray-800 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1 text-lg">Location</h4>
                <a 
                  href={GOOGLE_MAPS_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm leading-relaxed"
                >
                  Shree Venkateshwara Hi-Tech Engineering College (Autonomous)<br/>
                  Othakuthirai, Gobichettipalayam,<br/>
                  Erode District, Tamil Nadu, India
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-dark-surface/50 border border-gray-800 hover:border-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="text-secondary" size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1 text-lg">Email</h4>
                <a href="mailto:svhectrifusion2026@gmail.com" className="text-gray-400 hover:text-secondary transition-colors text-sm">
                  svhectrifusion2026@gmail.com
                </a>
              </div>
            </div>

            {/* Faculty Coordinators */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-dark-surface/50 border border-gray-800 hover:border-accent/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="text-accent" size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-lg">Faculty Coordinators</h4>
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-semibold">Mrs. G. Revathi <span className="text-gray-500">– AP/ECE</span></span>
                    <a href="tel:+917812826937" className="text-gray-400 hover:text-accent transition-colors text-sm">
                      +91 78128 26937
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-semibold">K. C. Anandhan <span className="text-gray-500">– AP/EEE (Sr.G)</span></span>
                    <a href="tel:+919787468182" className="text-gray-400 hover:text-accent transition-colors text-sm">
                      +91 97874 68182
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-semibold">K. Boopathi <span className="text-gray-500">– AP/BME</span></span>
                    <a href="tel:+919597616173" className="text-gray-400 hover:text-accent transition-colors text-sm">
                      +91 95976 16173
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Coordinators */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-dark-surface/50 border border-gray-800 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-lg">Student Coordinators</h4>
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-semibold">Ashik T S <span className="text-gray-500">– III/ECE</span></span>
                    <a href="tel:+919489553313" className="text-gray-400 hover:text-primary transition-colors text-sm">+91 94895 53313</a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-semibold">Balaji J <span className="text-gray-500">– III/ECE</span></span>
                    <a href="tel:+919629001885" className="text-gray-400 hover:text-primary transition-colors text-sm">+91 96290 01885</a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-semibold">Naveen P <span className="text-gray-500">– III/ECE</span></span>
                    <a href="tel:+919361052674" className="text-gray-400 hover:text-primary transition-colors text-sm">+91 93610 52674</a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-semibold">Balamuthaiyan M <span className="text-gray-500">– III/ECE</span></span>
                    <a href="tel:+917094681907" className="text-gray-400 hover:text-primary transition-colors text-sm">+91 70946 81907</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="h-80 lg:h-auto min-h-[400px] rounded-2xl overflow-hidden border border-gray-800 relative group">
            <a 
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all duration-300 group"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/90 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg backdrop-blur-sm flex items-center gap-2">
                <MapPin size={18} />
                Open in Google Maps
              </span>
            </a>
            <iframe
              src={GOOGLE_MAPS_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shree Venkateshwara Hi-Tech Engineering College Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
