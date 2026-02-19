const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Proven Expertise",
      description: "Years of experience implementing GTM for businesses across industries, from startups to enterprise."
    },
    {
      title: "Data-Driven Approach",
      description: "Every implementation is backed by best practices and focused on delivering accurate, actionable insights."
    },
    {
      title: "Custom Solutions",
      description: "No cookie-cutter setups. Each GTM configuration is tailored to your specific business needs and goals."
    },
    {
      title: "Ongoing Partnership",
      description: "Not just a one-time setup. Continuous support ensures your tracking evolves with your business."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Why Choose Our GTM Services?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get expert tag management solutions that drive real business results
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
