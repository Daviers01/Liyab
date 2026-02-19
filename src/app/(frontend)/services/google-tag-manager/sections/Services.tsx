const ServiceCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="group p-6 rounded-lg border border-border bg-card hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      icon: "⚙️",
      title: "GTM Setup & Implementation",
      description: "Complete GTM installation and configuration, including container setup, platform integration with Google Analytics, and establishing a solid foundation for all your tracking needs."
    },
    {
      icon: "🏷️",
      title: "Tag Creation & Management",
      description: "Professional tag setup from standard tracking to custom events. Ongoing optimization ensures your tags fire correctly and capture every critical interaction."
    },
    {
      icon: "🎯",
      title: "Custom Tracking Solutions",
      description: "Advanced tracking tailored to your needs—eCommerce tracking, cross-domain measurement, custom events, and complex user journey tracking."
    },
    {
      icon: "🔍",
      title: "GTM Audits & Optimization",
      description: "Comprehensive review of your GTM setup to identify inefficiencies, fix issues, and optimize for better performance and data accuracy."
    },
    {
      icon: "📊",
      title: "Data Layer Implementation",
      description: "Expert data layer architecture and implementation to pass dynamic data into GTM, enabling sophisticated tracking for complex business requirements."
    },
    {
      icon: "✅",
      title: "Testing & Quality Assurance",
      description: "Rigorous testing using Preview and Debug modes to verify tag accuracy. Continuous QA ensures reliable tracking as your site evolves."
    },
    {
      icon: "🎓",
      title: "GTM Training & Consulting",
      description: "Personalized training sessions and expert consultation to empower your team. Learn to manage GTM confidently from basics to advanced features."
    },
    {
      icon: "🛠️",
      title: "Ongoing Support & Maintenance",
      description: "Continuous monitoring, updates, and proactive maintenance to keep your GTM setup aligned with your business goals and running smoothly."
    },
    {
      icon: "📈",
      title: "Google Analytics Integration",
      description: "Seamless GA4 setup and integration with GTM, including conversion tracking, custom reports, and analytics audits to maximize your data insights."
    }
  ];

  return (
    <div id="services" className="space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Comprehensive GTM Services
        </h2>
        <p className="text-lg text-muted-foreground">
          Everything you need to master your tag management and data collection
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default Services;
