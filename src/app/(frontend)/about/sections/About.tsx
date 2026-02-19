const About = () => {
  return (
    <>
      <div className="text-5xl font-bold pb-12 text-foreground">About Me</div>
      
      <div className="flex flex-col lg:flex-row gap-20 text-xl leading-relaxed tracking-normal font-medium text-foreground">
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Professional</h3>
            <div className="space-y-5 text-muted-foreground">
              <p>
                I&apos;m a full stack developer with almost 9 years of professional
                experience. I specialize in building web applications and implementing web analytics.
              </p>
              <p>
                I am highly skilled in JavaScript and also knowledgeable in some of its
                popular libraries and frameworks such as{" "}
                <span className="text-orange-600 dark:text-orange-400 font-bold">React</span>,{" "}
                <span className="text-amber-600 dark:text-amber-400 font-bold">NextJS</span> and{" "}
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">PayloadCMS</span>.
              </p>
              <p>
                I&apos;m currently working at{" "}
                <span className="text-orange-700 dark:text-orange-400 font-bold">Dentsu</span> as
                Analytics Implementation Consultant. I&apos;m also the founder of{" "}
                <a 
                  href="https://www.facebook.com/liyabdigitalph" 
                  className="text-amber-600 dark:text-amber-400 hover:underline font-bold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Liyab Digital
                </a>{" "}
                🔥, my own agency.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Behind the Code</h3>
            <div className="space-y-5 text-muted-foreground">
              <p>
                I am a certified Cloud Practitioner in AWS and Microsoft Azure, and
                continuously learning about Web Analytics, Web Development, Cloud Computing, AI, and other cutting-edge
                technologies.
              </p>
              <p>
                When I&apos;m not debugging, I&apos;m playing with my kids{" "}
                <span className="font-bold text-foreground">Eliana</span> and{" "}
                <span className="font-bold text-foreground">Eliam</span>, dating my wife{" "}
                <span className="font-bold text-foreground">Elizabeth</span>, or grinding ranked on Wild Rift. 🎮💘
              </p>
              <p className="italic text-muted-foreground/80">
                Family is my &quot;why&quot; behind every line of code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
