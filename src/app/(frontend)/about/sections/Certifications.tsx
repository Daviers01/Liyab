import { CertificationCard } from '../components';
import { certifications } from "../data/certifications";

const Certifications = () => {
  return (
    <>
      <div className="text-xl text-muted-foreground mb-12">
        The university where I graduated from and professional certifications I&apos;ve earned to stay current in the industry.
      </div>
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
        {certifications.map((cert, i) => (
          <CertificationCard key={`cert-${i}`} {...cert} />
        ))}
      </div>
    </>
  );
};

export default Certifications;
